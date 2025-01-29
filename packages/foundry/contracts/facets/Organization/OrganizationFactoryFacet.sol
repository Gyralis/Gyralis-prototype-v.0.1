// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControlBase} from "../access-control/AccessControlBase.sol";
import {OrganizationFacet} from "./OrganizationFacet.sol";
import { Facet } from "src/facets/Facet.sol";
import {IOrganizationFactory} from "./IOrganizationFactory.sol";
import { OrganizationFactoryStorage } from "./OrganizationFactoryStorage.sol";
import {IDiamondCut} from "../cut/IDiamondCut.sol";
import {IDiamondLoupe} from "../loupe/IDiamondLoupe.sol";
import {IOrganization} from "./IOrganization.sol";
import {IDiamond} from "../../IDiamond.sol";
import {IFacetRegistry} from "../../registry/IFacetRegistry.sol";
import {IDiamondFactory} from "../../factory/IDiamondFactory.sol";
import { MULTI_INIT_ADDRESS } from "src/Constants.sol";

import { DEFAULT_ADMIN_ROLE } from "src/Constants.sol";


contract OrganizationFactoryFacet is AccessControlBase, Facet, IOrganizationFactory {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

     
    function OrganizationFactory_init(address diamondFactory, address facetRegistry) external onlyInitializing {
        // _addInterface(type(IDiamondLoupe).interfaceId);
        _setUserRole(msg.sender, DEFAULT_ADMIN_ROLE, true);
        OrganizationFactoryStorage.Layout storage ds = OrganizationFactoryStorage.layout();
        ds.diamondFactory = diamondFactory;
        ds.facetRegistry = facetRegistry;
    }

    /**
     * @notice Creates a new Organization contract.
     * @param name The name of the organization.
     * @param admin The address of the organization admin.
     * @param admin The description of the organization .
     */
    function createOrganization(string memory name, address admin, string memory description) external {
        require(bytes(name).length > 0, "Organization name is required");
        require(admin != address(0), "Admin address is invalid");
        require(bytes(description).length > 0, "Organization description is required");

        OrganizationFactoryStorage.Layout storage ds = OrganizationFactoryStorage.layout();

        address diamondFactory = ds.diamondFactory;
        address facetRegistry = ds.facetRegistry;

        require(diamondFactory != address(0), "Invalid DiamondFactory address");
        require(facetRegistry != address(0), "Invalid FacetRegistry address");

        // Get Facet Addresses
        address diamondCutFacet = IFacetRegistry(facetRegistry).getFacetBySelector(IDiamondCut.diamondCut.selector);
        address diamondLoupeFacet = IFacetRegistry(facetRegistry).getFacetBySelector(IDiamondLoupe.facets.selector);

        // Change for the IOrganization init selector when create the interface
        address organizationFacet = IFacetRegistry(facetRegistry).getFacetBySelector(OrganizationFacet.Organization_init.selector);

        require(diamondCutFacet != address(0), "DiamondCutFacet not found");
        require(diamondLoupeFacet != address(0), "DiamondLoupeFacet not found");
        require(organizationFacet != address(0), "OrganizationFacet not found");

        // Initialize the Diamond
        IDiamond.InitParams memory initParams = IDiamond.InitParams({
            baseFacets: _prepareFacetCuts(facetRegistry, diamondCutFacet, diamondLoupeFacet, organizationFacet),
            init: MULTI_INIT_ADDRESS,
            initData: abi.encode(_prepareDiamondInitData(diamondCutFacet, diamondLoupeFacet, organizationFacet, name, admin, description))
        });

        // Create the Diamond using the DiamondFactory
        address newDiamond = IDiamondFactory(diamondFactory).createDiamond(initParams);

        // Store the new organization's Diamond address
        uint256 newId = ds.organizationCounter++;
        ds.organizationById[newId] = newDiamond;

        
        emit OrganizationCreated(newId, newDiamond, name, admin, description);
}


    function _prepareFacetCuts(
        address facetRegistry,
        address diamondCutFacet,
        address diamondLoupeFacet,
        address organizationFacet
    ) internal view returns (IDiamond.FacetCut[] memory facetCuts) {
         // Add DiamondCutFacet
        facetCuts = new IDiamond.FacetCut[](3);  
        facetCuts[0] = IDiamond.FacetCut({
            facet: diamondCutFacet,
            action: IDiamond.FacetCutAction.Add,
            selectors: IFacetRegistry(facetRegistry).facetSelectors(diamondCutFacet)
        });

        // Add DiamondLoupeFacet
        facetCuts[1] = IDiamond.FacetCut({
            facet: diamondLoupeFacet,
            action: IDiamond.FacetCutAction.Add,
            selectors: IFacetRegistry(facetRegistry).facetSelectors(diamondLoupeFacet)
        });

        // Add OrganizationFacet
        facetCuts[2] = IDiamond.FacetCut({
            facet: organizationFacet,
            action: IDiamond.FacetCutAction.Add,
            selectors: IFacetRegistry(facetRegistry).facetSelectors(organizationFacet)
        });
    }

    function _prepareDiamondInitData(
        address diamondCutFacet,
        address diamondLoupeFacet,
        address organizationFacet,
        string memory name,
        address admin,
        string memory description
    ) internal pure returns (IDiamond.MultiInit[] memory diamondInitData) {

        diamondInitData = new IDiamond.MultiInit[](3) ;

        //Initialize DiamondCutFacet
        diamondInitData[0] = IDiamond.MultiInit({
            init: diamondCutFacet,
            initData: abi.encodeWithSelector(IDiamondCut(diamondCutFacet).DiamondCut_init.selector)
        });

        // Initialize DiamondLoupeFacet
        diamondInitData[1] = IDiamond.MultiInit({
            init: diamondLoupeFacet,
            initData: abi.encodeWithSelector(IDiamondLoupe(diamondLoupeFacet).DiamondLoupe_init.selector)
        });

        // Initialize OrganizationFacet
        diamondInitData[2] = IDiamond.MultiInit({
            init: organizationFacet,
            initData: abi.encodeWithSelector(IOrganization(organizationFacet).Organization_init.selector, name, admin, description)
        });
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
