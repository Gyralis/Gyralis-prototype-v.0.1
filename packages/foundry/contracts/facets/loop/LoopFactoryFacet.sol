// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControlBase} from "../access-control/AccessControlBase.sol";
import { Facet } from "src/facets/Facet.sol";
import { ILoopFactory } from "./ILoopFactory.sol";
import {IDiamondCut} from "../cut/IDiamondCut.sol";
import {IDiamondLoupe} from "../loupe/IDiamondLoupe.sol";
import { LoopFactoryStorage } from "./LoopFactoryStorage.sol";
import { IDiamond } from "../../IDiamond.sol";
import { IFacetRegistry } from "../../registry/IFacetRegistry.sol";
import { IDiamondFactory } from "../../factory/IDiamondFactory.sol";
import { MULTI_INIT_ADDRESS, DEFAULT_ADMIN_ROLE } from "src/Constants.sol";
import { OrganizationFactoryStorage } from "../Organization/OrganizationFactoryStorage.sol";
import { ILoop } from "./ILoop.sol";
import "forge-std/console2.sol";

contract LoopFactoryFacet is Facet, ILoopFactory, AccessControlBase {

    function LoopFactory_init(address diamondFactory, address facetRegistry) external onlyInitializing {
        _setUserRole(msg.sender, DEFAULT_ADMIN_ROLE, true);
        LoopFactoryStorage.Layout storage ds = LoopFactoryStorage.layout();
        ds.diamondFactory = diamondFactory;
        ds.facetRegistry = facetRegistry;
    }

    function createLoop(
        address organization,
        address token,
        address admin,
        uint256 periodLength,
        uint256 percentPerPeriod
    ) external returns (address newLoop) {
        // Ensure caller is a registered Organization
        OrganizationFactoryStorage.Layout storage orgDs = OrganizationFactoryStorage.layout();

       require(
        orgDs.organizationByAddress[msg.sender] != 0,
        "LoopFactory: Caller is not a registered Organization"
    );   

        // Load Loop Factory Storage
        LoopFactoryStorage.Layout storage ds = LoopFactoryStorage.layout();

        require(ds.diamondFactory != address(0), "LoopFactory: Invalid DiamondFactory address");
        require(ds.facetRegistry != address(0), "LoopFactory: Invalid FacetRegistry address");

        // Get Required Facet Addresses
        address diamondCutFacet = IFacetRegistry(ds.facetRegistry).getFacetBySelector(IDiamondCut.diamondCut.selector);
        address diamondLoupeFacet = IFacetRegistry(ds.facetRegistry).getFacetBySelector(IDiamondLoupe.facets.selector);
        address loopFacet = IFacetRegistry(ds.facetRegistry).getFacetBySelector(ILoop.claimAndRegister.selector);

        require(diamondCutFacet != address(0), "LoopFactory: DiamondCutFacet not found");
        require(diamondLoupeFacet != address(0), "LoopFactory: DiamondLoupeFacet not found");
        require(loopFacet != address(0), "LoopFactory: LoopFacet not found");

        // Initialize the Loop Diamond
        IDiamond.InitParams memory initParams = IDiamond.InitParams({
            baseFacets: _prepareFacetCuts(ds.facetRegistry, diamondCutFacet, diamondLoupeFacet, loopFacet),
            init: MULTI_INIT_ADDRESS,
            initData: abi.encode(
                _prepareDiamondInitData(diamondCutFacet, diamondLoupeFacet, loopFacet, admin, token, periodLength, percentPerPeriod)
            )
        });

        // Deploy Loop Diamond
        newLoop = IDiamondFactory(ds.diamondFactory).createDiamond(initParams);

        // Store Loop Data
        uint256 newLoopId = ds.loopCounter++;
        ds.loops[newLoopId] = newLoop;
        ds.organizationLoops[organization].push(newLoop);

        emit LoopCreated(newLoopId, newLoop, organization, token, periodLength, percentPerPeriod);
    }

    function _prepareFacetCuts(
        address facetRegistry,
        address diamondCutFacet,
        address diamondLoupeFacet,
        address loopFacet
    ) internal view returns (IDiamond.FacetCut[] memory facetCuts) {
        facetCuts = new IDiamond.FacetCut[](3);

        facetCuts[0] = IDiamond.FacetCut({
            facet: diamondCutFacet,
            action: IDiamond.FacetCutAction.Add,
            selectors: IFacetRegistry(facetRegistry).facetSelectors(diamondCutFacet)
        });

        facetCuts[1] = IDiamond.FacetCut({
            facet: diamondLoupeFacet,
            action: IDiamond.FacetCutAction.Add,
            selectors: IFacetRegistry(facetRegistry).facetSelectors(diamondLoupeFacet)
        });

        facetCuts[2] = IDiamond.FacetCut({
            facet: loopFacet,
            action: IDiamond.FacetCutAction.Add,
            selectors: IFacetRegistry(facetRegistry).facetSelectors(loopFacet)
        });
    }

    function _prepareDiamondInitData(
        address diamondCutFacet,
        address diamondLoupeFacet,
        address loopFacet,
        address admin,
        address token,
        uint256 periodLength,
        uint256 percentPerPeriod
    ) internal pure returns (IDiamond.MultiInit[] memory diamondInitData) {
        diamondInitData = new IDiamond.MultiInit[] (3) ;

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

        // Initialize LoopFacet
        diamondInitData[2] = IDiamond.MultiInit({
            init: loopFacet,
            initData: abi.encodeWithSelector(ILoop(loopFacet).Loop_init.selector, token,admin, periodLength, percentPerPeriod)
        });
    }

    function getLoopsByOrganization(address organization) external view returns (address[] memory) {
        LoopFactoryStorage.Layout storage ds = LoopFactoryStorage.layout();
        return ds.organizationLoops[organization];
    }
}
