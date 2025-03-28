// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface ILoop {
    error InvalidPeriodLength();
    error InvalidPeriodPercentage();
    error AlreadyRegistered();
    error CannotClaim();
    error FaucetBalanceIsZero();
    error NotAuthorized();
    error INVALID_ADDRESS();
    error INVALID_ADMIN_ADDRESS();
    error INVALID_SIGNER_ADDRESS();
    // Events
    event Initialize(address indexed token, uint256 periodLength, uint256 percentPerPeriod);
    event SetPercentPerPeriod(uint256 percentPerPeriod);
    event Claim(address indexed claimer, uint256 periodNumber, uint256 payout);
    event Register(address indexed sender, uint256 indexed periodNumber);
    event Withdraw(address indexed admin, address indexed to, uint256 amount);
    event TrustedBackendSignerUpdated(address indexed newSigner);

    /**
     * @notice Initializes the LoopFacet with permissions.
     * @param _token Token distributed by the loop
     * @param _loopAdmin The organization that manages this loop
     * @param _periodLength Length of each distribution period
     * @param _percentPerPeriod Percent of total balance distributed each period
     */
    function Loop_init(
        address _token,
        address _loopAdmin,
        uint256 _periodLength,
        uint256 _percentPerPeriod,
        address _trustedBackendSigner
    ) external;

    /**
     * @notice Set percent per period.
     * @param _percentPerPeriod Percent of total balance distributed each period
     */
    function setPercentPerPeriod(uint256 _percentPerPeriod) external;

    /**
     * @notice Register for the next period and claim if registered for the current period.
     */
    function claimAndRegister(bytes calldata signature) external;

    /**
     * @notice Claim from the faucet without registering for the next period.
     */
    function claim() external;

    /**
     * @notice Withdraw the faucet's entire balance of the distributed token.
     * @param _to Address to withdraw to
     */
    function withdrawDeposit(address _to) external;

    /**
     * @notice Get the current period number.
     * @return uint256 The current period number
     */
    function getCurrentPeriod() external view returns (uint256);

    /**
     * @notice Get a specific period's individual payout.
     * @param _periodNumber Period number
     * @return uint256 The payout amount for the given period
     */
    function getPeriodIndividualPayout(uint256 _periodNumber) external view returns (uint256);

    function setTrustedBackendSigner(address _newSigner) external;
}
