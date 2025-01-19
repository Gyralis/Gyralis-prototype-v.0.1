// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Organization.sol";

library LibOrganizationFactory {
    bytes32 constant STORAGE_POSITION = keccak256("diamond.organization.factory.storage");

    struct OrganizationFactoryStorage {
        mapping(uint256 => address) organizationById;
        uint256 organizationCounter;
    }

    function organizationFactoryStorage() internal pure returns (OrganizationFactoryStorage storage ds) {
        bytes32 position = STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }
}

contract OrganizationFactoryFacet is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event OrganizationCreated(uint256 indexed id, address indexed organizationAddress, string name, address indexed admin, string description);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Creates a new Organization contract.
     * @param name The name of the organization.
     * @param admin The address of the organization admin.
     * @param admin The description of the organization .
     */
    function createOrganization(string memory name, address admin, string memory description) external onlyRole(ADMIN_ROLE) {
        require(bytes(name).length > 0, "Organization name is required");
        require(admin != address(0), "Admin address is invalid");
        require(bytes(description).length > 0, "Organization description is required");

        Organization organization = new Organization(name, admin,description);

        LibOrganizationFactory.OrganizationFactoryStorage storage ds = LibOrganizationFactory.organizationFactoryStorage();
        uint256 newId = ds.organizationCounter++;
        ds.organizationById[newId] = address(organization);

        emit OrganizationCreated(newId, address(organization), name, admin, description);
    }

    /**
     * @notice Fetches an organization address by ID.
     * @param id The ID of the organization.
     * @return address The address of the organization contract.
     */
    function getOrganizationById(uint256 id) external view returns (address) {
        LibOrganizationFactory.OrganizationFactoryStorage storage ds = LibOrganizationFactory.organizationFactoryStorage();
        require(ds.organizationById[id] != address(0), "No organization found for this ID");
        return ds.organizationById[id];
    }

    /**
     * @notice Fetches the total number of created organizations.
     * @return uint256 The total count of organizations.
     */
    function getOrganizationCount() external view returns (uint256) {
        LibOrganizationFactory.OrganizationFactoryStorage storage ds = LibOrganizationFactory.organizationFactoryStorage();
        return ds.organizationCounter;
    }
}
