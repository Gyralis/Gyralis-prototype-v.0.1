// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

interface IOrganization {
    // Events
    event FaucetCreated(address indexed faucetAddress, string description);

    // Initialization function
    function Organization_init(string memory _name, address _admin, string memory _description) external;

    // View functions
    function getName() external view returns (string memory);
    function getAdmin() external view returns (address);
    function getDescription() external view returns (string memory);

    // Functions to manage faucets
    function createFaucet(string memory faucetDescription) external;

    // Admin management functions
    function addAdmin(address newAdmin) external;
    function removeAdmin(address adminToRemove) external;
}