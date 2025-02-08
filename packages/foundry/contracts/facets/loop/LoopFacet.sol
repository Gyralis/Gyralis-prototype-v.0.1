// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControlBase } from "../access-control/AccessControlBase.sol";
import { IAccessControl } from "../access-control/IAccessControl.sol";
import { DEFAULT_ADMIN_ROLE } from "src/Constants.sol";

contract LoopFacet is AccessControlBase {
    error InvalidPeriodLength();
    error InvalidPeriodPercentage();
    error AlreadyRegistered();
    error CannotClaim();
    error FaucetBalanceIsZero();
    error NotAuthorized();

    uint256 public constant ONE_HUNDRED_PERCENT = 1e18;

    struct Claimer {
        uint256 registeredForPeriod;
        uint256 latestClaimPeriod;
    }

    struct Period {
        uint256 totalRegisteredUsers;
        uint256 maxPayout;
    }

    ERC20 public token;
    uint256 public periodLength;
    uint256 public percentPerPeriod;
    uint256 public firstPeriodStart;

    mapping(address => Claimer) public claimers;
    mapping(uint256 => Period) public periods;

    event Initialize(address token, uint256 periodLength, uint256 percentPerPeriod);
    event SetPercentPerPeriod(uint256 percentPerPeriod);
    event Claim(address claimer, uint256 periodNumber, uint256 payout);
    event Register(address sender, uint256 periodNumber);
    event Withdraw(address admin, address to, uint256 amount);

    /**
    * @notice Initializes the LoopFacet with permissions.
    * @param _token Token distributed by the loop
    * @param _loopAdmin The organization that manages this loop
    * @param _periodLength Length of each distribution period
    * @param _percentPerPeriod Percent of total balance distributed each period
    */
    function Loop_init(ERC20 _token, address _loopAdmin, uint256 _periodLength, uint256 _percentPerPeriod) external {
        if (_periodLength == 0) revert InvalidPeriodLength();
        if (_percentPerPeriod > ONE_HUNDRED_PERCENT) revert InvalidPeriodPercentage();
        if (_loopAdmin == address(0)) revert NotAuthorized();

        token = _token;
        periodLength = _periodLength;
        percentPerPeriod = _percentPerPeriod;
        firstPeriodStart = block.timestamp;

        // Assign LOOP_ADMIN_ROLE to the organization
        _setUserRole(_loopAdmin, DEFAULT_ADMIN_ROLE, true);

        emit Initialize(address(_token), _periodLength, _percentPerPeriod);
    }

    /**
    * @notice Set percent per period (Only `DEFAULT_ADMIN_ROLE` can call this)
    * @param _percentPerPeriod Percent of total balance distributed each period
    */
    function setPercentPerPeriod(uint256 _percentPerPeriod) external onlyAuthorized {
        if (_percentPerPeriod > ONE_HUNDRED_PERCENT) revert InvalidPeriodPercentage();

        percentPerPeriod = _percentPerPeriod;
        emit SetPercentPerPeriod(_percentPerPeriod);
    }

    /**
    * @notice Register for the next period and claim if registered for the current period.
    */
    function claimAndRegister() external {
        Claimer storage claimer = claimers[msg.sender];

        uint256 currentPeriod = getCurrentPeriod();
        if (claimer.registeredForPeriod > currentPeriod) revert AlreadyRegistered();

        if (_canClaim(claimer, currentPeriod)) {
            _claim(claimer, currentPeriod);
        }

        uint256 nextPeriod = currentPeriod + 1;
        claimer.registeredForPeriod = nextPeriod;
        periods[nextPeriod].totalRegisteredUsers++;

        emit Register(msg.sender, nextPeriod);
    }

    /**
    * @notice Claim from the faucet without registering for the next period.
    */
    function claim() external {
        Claimer storage claimer = claimers[msg.sender];
        uint256 currentPeriod = getCurrentPeriod();

        if (!_canClaim(claimer, currentPeriod)) revert CannotClaim();

        _claim(claimer, currentPeriod);
    }

    /**
    * @notice Withdraw the faucet's entire balance of the distributed token.
    * @param _to Address to withdraw to
    */
    function withdrawDeposit(address _to) external onlyAuthorized {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(_to, balance);
        emit Withdraw(msg.sender, _to, balance);
    }

    /**
    * @notice Get the current period number.
    */
    function getCurrentPeriod() public view returns (uint256) {
        return (block.timestamp - firstPeriodStart) / periodLength;
    }

    /**
    * @notice Get a specific period's individual payouts. For future and uninitialized periods, it will return 0.
    * @param _periodNumber Period number
    */
    function getPeriodIndividualPayout(uint256 _periodNumber) public view returns (uint256) {
        Period storage period = periods[_periodNumber];
        return _getPeriodIndividualPayout(period);
    }

    function _canClaim(Claimer storage claimer, uint256 currentPeriod) internal view returns (bool) {
        bool userRegisteredCurrentPeriod = claimer.registeredForPeriod == currentPeriod;
        bool userYetToClaimCurrentPeriod = claimer.latestClaimPeriod < currentPeriod;

        return userRegisteredCurrentPeriod && userYetToClaimCurrentPeriod;
    }

    function _claim(Claimer storage _claimer, uint256 _currentPeriod) internal {
        Period storage period = periods[_currentPeriod];
        uint256 faucetBalance = token.balanceOf(address(this));

        if (faucetBalance == 0) revert FaucetBalanceIsZero();

        // Save maxPayout so every claimer gets the same payout amount.
        if (period.maxPayout == 0) {
            period.maxPayout = _getPeriodMaxPayout(faucetBalance);
        }

        uint256 claimerPayout = _getPeriodIndividualPayout(period);
        token.transfer(msg.sender, claimerPayout);

        _claimer.latestClaimPeriod = _currentPeriod;
        emit Claim(msg.sender, _currentPeriod, claimerPayout);
    }

    function _getPeriodMaxPayout(uint256 _faucetBalance) internal view returns (uint256) {
        return (_faucetBalance * percentPerPeriod) / ONE_HUNDRED_PERCENT;
    }

    function _getPeriodIndividualPayout(Period storage period) internal view returns (uint256) {
        if (period.totalRegisteredUsers == 0) return 0;

        uint256 periodMaxPayout = period.maxPayout == 0
            ? _getPeriodMaxPayout(token.balanceOf(address(this)))
            : period.maxPayout;

        return periodMaxPayout / period.totalRegisteredUsers;
    }
}
