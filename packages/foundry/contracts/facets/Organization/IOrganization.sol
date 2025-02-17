// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

interface IOrganization {
    // Events
    event LoopCreated(address indexed loopAddress, address token, uint256 periodLength, uint256 percentPerPeriod);

    // Initialization function
    function Organization_init(string memory _name, address _admin, string memory _description) external;

    // View functions
    function getOrganizationName() external view returns (string memory);
    function getOrganizationAdmin() external view returns (address);
    function getOrganizationDescription() external view returns (string memory);

    // Functions to manage loops
    function createLoop(address loopFactory, address token, uint256 periodLength, uint256 percentPerPeriod) external;

    // Admin management functions
    function addAdmin(address newAdmin) external;
    function removeAdmin(address adminToRemove) external;
}
