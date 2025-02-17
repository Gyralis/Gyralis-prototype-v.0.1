// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Facet } from "src/facets/Facet.sol";
import { IOrganization } from "./IOrganization.sol";
import { ILoopFactory } from "../Loop/ILoopFactory.sol";
import { OrganizationStorage } from "./OrganizationStorage.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

contract OrganizationFacet is IOrganization, AccessControl, Facet {
    bytes32 public constant ORGANIZATION_ADMIN_ROLE = keccak256("ORGANIZATION_ADMIN_ROLE");

    function Organization_init(string memory _name, address _admin, string memory _description) external onlyInitializing {
        require(bytes(_name).length > 0, "Organization name is required");
        require(_admin != address(0), "Admin address is invalid");
        require(bytes(_description).length > 0, "Organization description is required");

        OrganizationStorage.Layout storage os = OrganizationStorage.layout();
        os.name = _name;
        os.admin = _admin;
        os.description = _description;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ORGANIZATION_ADMIN_ROLE, _admin);
    }

    function getOrganizationName() external view returns (string memory) {
        return OrganizationStorage.layout().name;
    }

    function getOrganizationAdmin() external view returns (address) {
        return OrganizationStorage.layout().admin;
    }

    function getOrganizationDescription() external view returns (string memory) {
        return OrganizationStorage.layout().description;
    }

    function createLoop(address loopFactory, address token, uint256 periodLength, uint256 percentPerPeriod) external onlyRole(ORGANIZATION_ADMIN_ROLE) {
        require(loopFactory != address(0), "Invalid LoopFactory address");
        require(token != address(0), "Invalid token address");

        ILoopFactory(loopFactory).createLoop(address(this), token, periodLength, percentPerPeriod);
        OrganizationStorage.layout().faucets[address(this)] = true;
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
