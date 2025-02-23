// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LoopStorage.sol";
import { ILoop } from "./ILoop.sol";
import { AccessControlBase } from "../access-control/AccessControlBase.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { DEFAULT_ADMIN_ROLE } from "src/Constants.sol";

contract LoopFacet is ILoop, AccessControlBase {
    uint256 public constant ONE_HUNDRED_PERCENT = 1e18;
    bytes32 public constant LOOP_ADMIN_ROLE = keccak256("LOOP_ADMIN_ROLE");

    /**
     * @notice Initializes the LoopFacet with permissions.
     * @param _token Token distributed by the loop
     * @param _loopAdmin The organization that manages this loop
     * @param _periodLength Length of each distribution period
     * @param _percentPerPeriod Percent of total balance distributed each period
     */
    function Loop_init(
        ERC20 _token,
        address _loopAdmin,
        uint256 _periodLength,
        uint256 _percentPerPeriod
    ) external override {
        if (_periodLength == 0) revert InvalidPeriodLength();
        if (_percentPerPeriod > ONE_HUNDRED_PERCENT) revert InvalidPeriodPercentage();
        if (_loopAdmin == address(0)) revert NotAuthorized();

        LoopStorage.Layout storage ds = LoopStorage.layout();
        ds.token = _token;
        ds.loopAdmin = _loopAdmin;
        ds.periodLength = _periodLength;
        ds.percentPerPeriod = _percentPerPeriod;
        ds.firstPeriodStart = block.timestamp;

        // Assign LOOP_ADMIN_ROLE to the loop admin
        _setUserRole(_loopAdmin, DEFAULT_ADMIN_ROLE, true);

        emit Initialize(address(_token), _periodLength, _percentPerPeriod);
    }

    /**
     * @notice Set percent per period (Only `LOOP_ADMIN_ROLE` can call this)
     * @param _percentPerPeriod Percent of total balance distributed each period
     */
    function setPercentPerPeriod(uint256 _percentPerPeriod) external override onlyAuthorized {
        if (_percentPerPeriod > ONE_HUNDRED_PERCENT) revert InvalidPeriodPercentage();

        LoopStorage.layout().percentPerPeriod = _percentPerPeriod;
        emit SetPercentPerPeriod(_percentPerPeriod);
    }

    /**
     * @notice Register for the next period and claim if registered for the current period.
     */
    function claimAndRegister() external override {
        LoopStorage.Layout storage ds = LoopStorage.layout();
        LoopStorage.Claimer storage claimer = ds.claimers[msg.sender];

        uint256 currentPeriod = getCurrentPeriod();
        if (claimer.registeredForPeriod > currentPeriod) revert AlreadyRegistered();

        if (_canClaim(claimer, currentPeriod)) {
            _claim(claimer, currentPeriod);
        }

        uint256 nextPeriod = currentPeriod + 1;
        claimer.registeredForPeriod = nextPeriod;
        ds.periods[nextPeriod].totalRegisteredUsers++;

        emit Register(msg.sender, nextPeriod);
    }

    /**
     * @notice Claim from the faucet without registering for the next period.
     */
    function claim() external override {
        LoopStorage.Layout storage ds = LoopStorage.layout();
        LoopStorage.Claimer storage claimer = ds.claimers[msg.sender];
        uint256 currentPeriod = getCurrentPeriod();

        if (!_canClaim(claimer, currentPeriod)) revert CannotClaim();

        _claim(claimer, currentPeriod);
    }

    /**
     * @notice Withdraw the faucet's entire balance of the distributed token.
     * @param _to Address to withdraw to
     */
    function withdrawDeposit(address _to) external override onlyAuthorized {
        LoopStorage.Layout storage ds = LoopStorage.layout();
        uint256 balance = ds.token.balanceOf(address(this));
        ds.token.transfer(_to, balance);
        emit Withdraw(msg.sender, _to, balance);
    }

    /**
     * @notice Get the current period number.
     */
    function getCurrentPeriod() public view override returns (uint256) {
        return (block.timestamp - LoopStorage.layout().firstPeriodStart) / LoopStorage.layout().periodLength;
    }

    /**
     * @notice Get a specific period's individual payouts. For future and uninitialized periods, it will return 0.
     * @param _periodNumber Period number
     */
    function getPeriodIndividualPayout(uint256 _periodNumber) public view override returns (uint256) {
        LoopStorage.Layout storage ds = LoopStorage.layout();
        LoopStorage.Period storage period = ds.periods[_periodNumber];
        return _getPeriodIndividualPayout(period);
    }

    /**
     * @notice Get the loop details.
     * @return token The token address associated with the loop
     * @return periodLength Length of each distribution period
     * @return percentPerPeriod Percent of total balance distributed each period
     * @return firstPeriodStart Timestamp when the first period started
     */
    function getLoopDetails() external view returns (address token, uint256 periodLength, uint256 percentPerPeriod, uint256 firstPeriodStart) {
        LoopStorage.Layout storage ds = LoopStorage.layout();
        return (address(ds.token), ds.periodLength, ds.percentPerPeriod, ds.firstPeriodStart);
    }

    /**
     * @notice Get data of the current period.
     * @return totalRegisteredUsers The total number of users registered for this period
     * @return maxPayout The maximum payout for this period
     */
    function getCurrentPeriodData() external view returns (uint256 totalRegisteredUsers, uint256 maxPayout) {
        LoopStorage.Layout storage ds = LoopStorage.layout();
        uint256 currentPeriod = getCurrentPeriod();
        LoopStorage.Period storage period = ds.periods[currentPeriod];

        return (period.totalRegisteredUsers, period.maxPayout);
    }


    function _canClaim(LoopStorage.Claimer storage claimer, uint256 currentPeriod) internal view returns (bool) {
        bool userRegisteredCurrentPeriod = claimer.registeredForPeriod == currentPeriod;
        bool userYetToClaimCurrentPeriod = claimer.latestClaimPeriod < currentPeriod;

        return userRegisteredCurrentPeriod && userYetToClaimCurrentPeriod;
    }

    function _claim(LoopStorage.Claimer storage _claimer, uint256 _currentPeriod) internal {
        LoopStorage.Layout storage ds = LoopStorage.layout();
        LoopStorage.Period storage period = ds.periods[_currentPeriod];
        uint256 faucetBalance = ds.token.balanceOf(address(this));

        if (faucetBalance == 0) revert FaucetBalanceIsZero();

        // Save maxPayout so every claimer gets the same payout amount.
        if (period.maxPayout == 0) {
            period.maxPayout = _getPeriodMaxPayout(faucetBalance);
        }

        uint256 claimerPayout = _getPeriodIndividualPayout(period);
        ds.token.transfer(msg.sender, claimerPayout);

        _claimer.latestClaimPeriod = _currentPeriod;
        emit Claim(msg.sender, _currentPeriod, claimerPayout);
    }

    function _getPeriodMaxPayout(uint256 _faucetBalance) internal view returns (uint256) {
        LoopStorage.Layout storage ds = LoopStorage.layout();
        return (_faucetBalance * ds.percentPerPeriod) / ONE_HUNDRED_PERCENT;
    }

    function _getPeriodIndividualPayout(LoopStorage.Period storage period) internal view returns (uint256) {
        if (period.totalRegisteredUsers == 0) return 0;

        uint256 periodMaxPayout = period.maxPayout == 0
            ? _getPeriodMaxPayout(LoopStorage.layout().token.balanceOf(address(this)))
            : period.maxPayout;

        return periodMaxPayout / period.totalRegisteredUsers;
    }
}
