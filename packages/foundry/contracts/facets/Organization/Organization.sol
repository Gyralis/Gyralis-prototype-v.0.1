// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

library LibOrganization {
    bytes32 constant STORAGE_POSITION = keccak256("diamond.organization.storage");

    struct OrganizationStorage {
        string name;
        address admin;
        string description;
        mapping(address => bool) faucets;
    }

    function organizationStorage() internal pure returns (OrganizationStorage storage os) {
        bytes32 position = STORAGE_POSITION;
        assembly {
            os.slot := position
        }
    }
}

contract Organization is AccessControl {
    bytes32 public constant ORGANIZATION_ADMIN_ROLE = keccak256("ORGANIZATION_ADMIN_ROLE");

    event FaucetCreated(address indexed faucetAddress, string description);

    constructor(string memory _name, address _admin, string memory _description) {
        require(bytes(_name).length > 0, "Organization name is required");
        require(_admin != address(0), "Admin address is invalid");
        require(bytes(_description).length > 0, "Organization description is required");

        LibOrganization.OrganizationStorage storage os = LibOrganization.organizationStorage();
        os.name = _name;
        os.admin = _admin;
        os.description = _description;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ORGANIZATION_ADMIN_ROLE, _admin);
    }

    function getName() external view returns (string memory) {
        return LibOrganization.organizationStorage().name;
    }

    function getAdmin() external view returns (address) {
        return LibOrganization.organizationStorage().admin;
    }

    function getDescription() external view returns (string memory) {
        return LibOrganization.organizationStorage().description;
    }

    function createFaucet(string memory faucetDescription) external onlyRole(ORGANIZATION_ADMIN_ROLE) {
    
    }

    function addAdmin(address newAdmin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newAdmin != address(0), "Invalid admin address");
        grantRole(ORGANIZATION_ADMIN_ROLE, newAdmin);
    }

    function removeAdmin(address adminToRemove) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(adminToRemove != address(0), "Invalid admin address");
        revokeRole(ORGANIZATION_ADMIN_ROLE, adminToRemove);
    }
}
