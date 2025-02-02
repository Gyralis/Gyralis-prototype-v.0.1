// SPDX-License-Identifier: MIT License
pragma solidity >=0.8.20;

import { BaseScript, FacetHelper } from "../Base.s.sol";
import { FacetRegistry } from "src/facet_registry/FacetRegistry.sol";
import {DiamondFactory } from "src/factory/DiamondFactory.sol";
import  {IDiamond} from "src/Diamond.sol";
import {DiamondCutFacetHelper} from "src/utils/DiamondCutFacetHelper.sol";

contract Deploy is BaseScript {
    function run() public broadcaster {

        //Create the registry
        FacetRegistry registry = new FacetRegistry();

        //Deploy the facets
        for (uint256 i = 0; i < facetHelpers.length; i++) {
            FacetHelper helper = facetHelpers[i];
            registry.deployFacet(salt, helper.creationCode(), helper.selectors());
        }

        // Deploy the DiamondFactory
        DiamondFactory diamondFactory = new DiamondFactory();


        // Prepare the base facets
        IDiamond.FacetCut[] memory baseFacets = new IDiamond.FacetCut[](facetHelpers.length);
        for (uint256 i = 0; i < facetHelpers.length; i++) {
            baseFacets[i] = facetHelpers[i].makeFacetCut(IDiamond.FacetCutAction.Add);
        }

        // Prepare the init data for the facets
        IDiamond.MultiInit[] memory diamondInitData = new IDiamond.MultiInit[](4);
        diamondInitData[0] = facetHelpers[0].makeInitData(""); //DiamondCut
        diamondInitData[2] = facetHelpers[1].makeInitData(""); //DiamondLoupe
        diamondInitData[3] = facetHelpers[2].makeInitData(abi.encode(msg.sender)); //AccessControl





    }
}
