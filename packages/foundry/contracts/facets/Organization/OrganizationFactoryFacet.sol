// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {OrganizationFacet} from "./OrganizationFacet.sol";
import { Facet } from "src/facets/Facet.sol";
import {IOrganizationFactory} from "./IOrganizationFactory.sol";
import { OrganizationFactoryStorage } from "./OrganizationFactoryStorage.sol";


contract OrganizationFactoryFacet is AccessControl, Facet, IOrganizationFactory {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

     function OrganizationFactory_init() external onlyInitializing {
        // _addInterface(type(IDiamondLoupe).interfaceId);
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

        OrganizationFacet organization = new OrganizationFacet(name, admin,description);

        OrganizationFactoryStorage.Layout storage ds = OrganizationFactoryStorage.layout();
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
        OrganizationFactoryStorage.Layout storage ds = OrganizationFactoryStorage.layout();
        require(ds.organizationById[id] != address(0), "No organization found for this ID");
        return ds.organizationById[id];
    }

    /**
     * @notice Fetches the total number of created organizations.
     * @return uint256 The total count of organizations.
     */
    function getOrganizationCount() external view returns (uint256) {
        OrganizationFactoryStorage.Layout storage ds = OrganizationFactoryStorage.layout();
        return ds.organizationCounter;
    }
}
