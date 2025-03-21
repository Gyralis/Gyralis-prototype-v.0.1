// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import { BaseScript, FacetHelper } from "../Base.s.sol";
import { FacetRegistry } from "src/registry/FacetRegistry.sol";
import "forge-std/console.sol";

contract DeployFacets is BaseScript {
    struct FacetAddresses {
        address facet_registry;
        address diamond_cut;
        address diamond_loupe;
        address access_control;
        address organization_factory;
        address organization;
        address loop_factory;
        address loop;
    }

    FacetAddresses public f;
    string public jsonWriteKey = "facets";

    function run() public  broadcaster {
        _deployFacets();
    }

    function _deployFacets() internal {
        console.log(">> Deploying FacetRegistry...");
        FacetRegistry registry = new FacetRegistry();
        f.facet_registry = address(registry);
        console.log("FacetRegistry deployed at:", address(registry));
        string[] memory facetNames = _facetNames();
        address[] memory facetAddresses = new address[](facetHelpers.length);

        for (uint256 i = 0; i < facetHelpers.length; i++) {
            FacetHelper helper = facetHelpers[i];
            address facet = registry.deployFacet(salt, helper.creationCode(), helper.selectors());
            facetAddresses[i] = facet;

            console.log("Facet", facetNames[i], "deployed at:", facet);
            require(_isContract(facet), "ERROR: Facet not deployed");
        }

        // Map each facet by position
        f.diamond_cut         = facetAddresses[0];
        f.diamond_loupe       = facetAddresses[1];
        f.access_control      = facetAddresses[2];
        f.organization_factory = facetAddresses[3];
        f.organization        = facetAddresses[4];
        f.loop_factory        = facetAddresses[5];
        f.loop                = facetAddresses[6];
    }
    event log_named_string(string _msg,string _json);

    function _facetNames() internal pure returns(string[] memory){
        string[] memory facetNames = new string[](7);
        facetNames[0] = "DiamondCutFacet";
        facetNames[1] = "DiamondLoupeFacet";
        facetNames[2] = "AccessControlFacet";
        facetNames[3] = "OrganizationFactoryFacet";
        facetNames[4] = "OrganizationFacet";
        facetNames[5] = "LoopFactoryFacet";
        facetNames[6] = "LoopFacet";
        return facetNames;
    }
   //function _writeOutputJson() internal virtual override {
   //     string memory root = vm.projectRoot();
   //     string memory chainIdStr = vm.toString(block.chainid);
   //     string memory blockIdStr = vm.toString(block.timestamp);
   //     string memory path = string.concat(root, "/deployments/facets/", chainIdStr,"_",blockIdStr, ".json");
   //     // Importante: usar siempre el mismo nombre estático
   //     string memory jsonWrite = "jsonWrite";
   //     emit log_named_string('json_string',jsonWrite);
   //     vm.serializeString(jsonWrite, "FacetRegistry", vm.toString(f.facet_registry));
   //     emit log_named_string('json_string',jsonWrite);
   //     vm.serializeString(jsonWrite, "DiamondCutFacet", vm.toString(f.diamond_cut));
   //     emit log_named_string('json_string',jsonWrite);
   //     vm.serializeString(jsonWrite, "DiamondLoupeFacet", vm.toString(f.diamond_loupe));
   //     emit log_named_string('json_string',jsonWrite);
   //     vm.serializeString(jsonWrite, "AccessControlFacet", vm.toString(f.access_control));
   //     emit log_named_string('json_string',jsonWrite);
   //     vm.serializeString(jsonWrite, "OrganizationFactoryFacet", vm.toString(f.organization_factory));
   //     emit log_named_string('json_string',jsonWrite);
   //     vm.serializeString(jsonWrite, "OrganizationFacet", vm.toString(f.organization));
   //     emit log_named_string('json_string',jsonWrite);
   //     vm.serializeString(jsonWrite, "LoopFactoryFacet", vm.toString(f.loop_factory));
   //     emit log_named_string('json_string',jsonWrite);
   //     vm.serializeString(jsonWrite, "LoopFacet", vm.toString(f.loop));
   //     emit log_named_string('json_string',jsonWrite);

   //     vm.writeJson(jsonWrite, path);
   //     console.log("Facet deployment saved to:", path);
   // }




    function _isContract(address _addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(_addr)
        }
        return size > 0;
    }
}
