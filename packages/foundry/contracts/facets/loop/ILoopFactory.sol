// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILoopFactory {
    event LoopCreated(
        uint256 indexed loopId,
        address loopAddress,
        address organization,
        address token,
        uint256 periodLength,
        uint256 percentPerPeriod
    );

    function createLoop(
        address organization,
        address token,
        address admin,
        uint256 periodLength,
        uint256 percentPerPeriod
    ) external returns (address newLoop);

    function getLoopsByOrganization(address organization) external view returns (address[] memory);
}
