// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {OrganizationFacet} from "./OrganizationFacet.sol";
import { Facet } from "src/facets/Facet.sol";
import {IOrganizationFactory} from "./IOrganizationFactory.sol";
import { OrganizationFactoryStorage } from "./OrganizationFactoryStorage.sol";
import {IDiamondCut} from "../cut/IDiamondCut.sol";
import {IDiamondLoupe} from "../loupe/IDiamondLoupe.sol";
import {IDiamond} from "../../IDiamond.sol";
import {IFacetRegistry} from "../../registry/IFacetRegistry.sol";
import {IDiamondFactory} from "../../factory/IDiamondFactory.sol";


contract OrganizationFactoryFacet is AccessControl, Facet, IOrganizationFactory {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

     function OrganizationFactory_init(address diamondFactory, address facetRegistry) external onlyInitializing {
        // _addInterface(type(IDiamondLoupe).interfaceId);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }


    //JUST TO FEDE TO CHECK THIS CODE NEEDS TO BE ON THE REGISTRY 
    function getFacetBySelector(address facetRegistry, bytes4 selector) internal view returns (address facet) {
    address[] memory facets = IFacetRegistry(facetRegistry).facetAddresses();
    for (uint256 i = 0; i < facets.length; i++) {
        bytes4[] memory selectors = IFacetRegistry(facetRegistry).facetSelectors(facets[i]);
        for (uint256 j = 0; j < selectors.length; j++) {
            if (selectors[j] == selector) {
                return facets[i];
            }
        }
    }
    revert("Facet for selector not found");
}

    /**
     * @notice Creates a new Organization contract.
     * @param name The name of the organization.
     * @param admin The address of the organization admin.
     * @param admin The description of the organization .
     */
    function createOrganization(string memory name, address admin, string memory description) external  {
    require(bytes(name).length > 0, "Organization name is required");
    require(admin != address(0), "Admin address is invalid");
    require(bytes(description).length > 0, "Organization description is required");

    OrganizationFactoryStorage.Layout storage ds = OrganizationFactoryStorage.layout();

    address diamondFactory = ds.diamondFactory;
    address facetRegistry = ds.facetRegistry;

    require(diamondFactory != address(0), "Invalid DiamondFactory address");
    require(facetRegistry != address(0), "Invalid FacetRegistry address");

   // Get required facets using their selectors
    address diamondCutFacet = getFacetBySelector(facetRegistry, IDiamondCut.diamondCut.selector);
    address diamondLoupeFacet = getFacetBySelector(facetRegistry, IDiamondLoupe.facets.selector);

    // Change for the IOrganization init selector when create the interface
    address organizationFacet = getFacetBySelector(facetRegistry, OrganizationFacet.Organization_init.selector);

    require(diamondCutFacet != address(0), "DiamondCutFacet not found");
    require(diamondLoupeFacet != address(0), "DiamondLoupeFacet not found");
    require(organizationFacet != address(0), "OrganizationFacet not found");

    // Prepare FacetCut array for the new Diamond
    
    IDiamond.FacetCut[] memory facetCuts = new IDiamond.FacetCut[](3);
    // Add DiamondCutFacet
    bytes4[] memory diamondCutSelectors = IFacetRegistry(facetRegistry).facetSelectors(diamondCutFacet);
    facetCuts[0] = IDiamond.FacetCut({
        facetAddress: diamondCutFacet,
        action: IDiamond.FacetCutAction.Add,
        functionSelectors: diamondCutSelectors
    });

    // Add DiamondLoupeFacet
    bytes4[] memory diamondLoupeSelectors = IFacetRegistry(facetRegistry).facetSelectors(diamondLoupeFacet);
    facetCuts[1] = IDiamond.FacetCut({
        facetAddress: diamondLoupeFacet,
        action: IDiamond.FacetCutAction.Add,
        functionSelectors: diamondLoupeSelectors
    });

    // Add OrganizationFacet
    bytes4[] memory organizationSelectors = IFacetRegistry(facetRegistry).facetSelectors(organizationFacet);
    facetCuts[2] = IDiamond.FacetCut({
        facetAddress: organizationFacet,
        action: IDiamond.FacetCutAction.Add,
        functionSelectors: organizationSelectors
    });

    //Initialize the Diamond
    IDiamond.InitParams memory initParams = IDiamond.InitParams({
        baseFacets: facetCuts,
        init: organizationFacet, // Initialize with OrganizationFacet
        initData: abi.encodeWithSelector(
            OrganizationFacet.initialize.selector,
            name,
            admin,
            description
        )
    });

    // Create the Diamond using the DiamondFactory
    address newDiamond = IDiamondFactory(diamondFactory).createDiamond(initParams);

    //Store the new organization's Diamond address
    
    uint256 newId = ds.organizationCounter++;
    ds.organizationById[newId] = newDiamond;

    // Emit event for organization creation
    emit OrganizationCreated(newId, newDiamond, name, admin, description);

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
