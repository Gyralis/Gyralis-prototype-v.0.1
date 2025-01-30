// SPDX-License-Identifier: MIT License
pragma solidity >=0.8.20;

import { BaseScript, FacetHelper } from "../Base.s.sol";
import { FacetRegistry } from "src/registry/FacetRegistry.sol";
import { DiamondFactory } from "src/factory/DiamondFactory.sol";
import { IDiamond } from "src/Diamond.sol";
import { MULTI_INIT_ADDRESS } from "src/Constants.sol";

import "forge-std/console.sol";

contract Deploy is BaseScript {
    function run() public broadcaster {
        console.log("Starting Deployment...");

        // Create the Facet Registry
        FacetRegistry registry = new FacetRegistry();
        console.log("FacetRegistry deployed at:", address(registry));

        // Deploy the Facets
        address[] memory facetAddresses = new address[](facetHelpers.length);
        for (uint256 i = 0; i < facetHelpers.length; i++) {
            FacetHelper helper = facetHelpers[i];
            facetAddresses[i] = registry.deployFacet(salt, helper.creationCode(), helper.selectors());

            console.log("Facet", i, "deployed at:", facetAddresses[i]);

            // Verify the facet is actually deployed
            address facetAddress = facetAddresses[i];
            uint256 codeSize;
            assembly {
                codeSize := extcodesize(facetAddress)
            }
            require(codeSize > 0, "ERROR: Facet is not a deployed contract!");
        }

        // Deploy the Diamond Factory
        DiamondFactory diamondFactory = new DiamondFactory();
        console.log("DiamondFactory deployed at:", address(diamondFactory));

        // Log All Facet Addresses
        console.log("Facet addresses:");
        for (uint256 i = 0; i < facetAddresses.length; i++) {
            console.log("Facet", i, "address:", facetAddresses[i]);
        }

        // Prepare the Base Facets
        IDiamond.FacetCut[] memory baseFacets = new IDiamond.FacetCut[](facetHelpers.length);
        for (uint256 i = 0; i < facetHelpers.length; i++) {
            baseFacets[i] = facetHelpers[i].makeFacetCut(facetAddresses[i],IDiamond.FacetCutAction.Add);
        }

        // Prepare the Init Data for the Facets
        console.log("Setting up initialization data for facets...");
        IDiamond.MultiInit[] memory diamondInitData = new IDiamond.MultiInit[](4);

        diamondInitData[0] = facetHelpers[0].makeInitData(facetAddresses[0], ""); // DiamondCut
        diamondInitData[1] = facetHelpers[1].makeInitData(facetAddresses[1], ""); // DiamondLoupe
        diamondInitData[2] = facetHelpers[2].makeInitData(facetAddresses[2], abi.encode(msg.sender)); // AccessControl
        diamondInitData[3] = facetHelpers[3].makeInitData(facetAddresses[3], abi.encode(diamondFactory, registry)); // OrganizationFactory

        // Log Init Data
        console.log("DiamondCut init set with address:", facetAddresses[0]);
        console.log("DiamondLoupe init set with address:", facetAddresses[1]);
        console.log("AccessControl init set with address:", facetAddresses[2]);
        console.log("OrganizationFactory init set with address:", facetAddresses[3]);
        console.log("Organization init set with address:", facetAddresses[4]);

        // Initialize the Diamond
        console.log("Initializing Diamond...");
        console.log("MULTI_INIT_ADDRESS:", MULTI_INIT_ADDRESS);

        for (uint256 i = 0; i < baseFacets.length; i++) {
            console.log("BaseFacet Address:", baseFacets[i].facet, "Selectors:", baseFacets[i].selectors.length);
        }

        IDiamond.InitParams memory initParams = IDiamond.InitParams({
            baseFacets: baseFacets,
            init: MULTI_INIT_ADDRESS,
            initData: abi.encode(diamondInitData)
        });

        console.log("Encoded initData length:", bytes(abi.encode(diamondInitData)).length);

        // Deploy the Diamond
        console.log("Creating the Diamond...");
        address systemDiamond = diamondFactory.createDiamond(initParams);
        console.log("Diamond deployed at:", systemDiamond);

         //Call createOrganization through the Diamond**
        console.log("Creating Organization...");

        (bool success, bytes memory result) = systemDiamond.call(
            abi.encodeWithSignature(
                "createOrganization(string,address,string)",
                "My Organization",
                msg.sender,
                "This is a test organization"
            )
        );

        if (success) {
            console.log("Organization Created Successfully!");
        } else {
            console.log("Organization Creation Failed!");
            console.logBytes(result);
        }

        console.log("Deployment Complete.");
    }
    
}
