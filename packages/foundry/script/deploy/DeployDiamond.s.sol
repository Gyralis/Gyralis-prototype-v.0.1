// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import { BaseScript, FacetHelper } from "../Base.s.sol";
import { DiamondFactory } from "src/factory/DiamondFactory.sol";
import { IDiamond } from "src/Diamond.sol";
import { MULTI_INIT_ADDRESS } from "src/Constants.sol";

import "forge-std/console.sol";

contract DeployDiamond is BaseScript {
    struct FacetAddresses {
        address diamond_cut;
        address diamond_loupe;
        address access_control;
        address organization_factory;
        address organization;
        address loop_factory;
        address loop;
        address facet_registry;
    }

    FacetAddresses f;
    string public jsonWriteKey = "diamond";
    string public facetsPath;
    string public outputPath;

    address factory_add;
    address trusted_signer ;
    address diamond;

    function run() public  broadcaster {
        _deployDiamond();
    }

    function _readFacetsJson() internal {
        string memory root = vm.projectRoot();
        string memory chainIdStr = vm.toString(block.chainid);
        facetsPath = string.concat(root, "/deployments/facets.", chainIdStr, ".json");
        outputPath = string.concat(root, "/deployments/diamond.", chainIdStr, ".json");

        string memory json = vm.readFile(facetsPath);
        f.facet_registry        = vm.parseJsonAddress(json, ".FacetRegistry");
        f.diamond_cut           = vm.parseJsonAddress(json, ".DiamondCutFacet");
        f.diamond_loupe         = vm.parseJsonAddress(json, ".DiamondLoupeFacet");
        f.access_control        = vm.parseJsonAddress(json, ".AccessControlFacet");
        f.organization_factory  = vm.parseJsonAddress(json, ".OrganizationFactoryFacet");
        f.organization          = vm.parseJsonAddress(json, ".OrganizationFacet");
        f.loop_factory          = vm.parseJsonAddress(json, ".LoopFactoryFacet");
        f.loop                  = vm.parseJsonAddress(json, ".LoopFacet");
    }

    function _deployDiamond() internal {
        deployer = vm.addr(vm.envUint("DEPLOYER_PK"));
        trusted_signer = vm.envAddress("TRUSTED_SIGNER");
        systemAdmin = vm.envAddress("SYSTEM_ADDRESS");

        // Deploy Factory
        DiamondFactory factory = new DiamondFactory();
        factory_add = address(factory);
        console.log("DiamondFactory deployed at:", address(factory));

        address [] memory facetAddresses = new address[](7) ;
        facetAddresses[0] = f.diamond_cut;
        facetAddresses[1] = f.diamond_loupe;
        facetAddresses[2] = f.access_control;
        facetAddresses[3] = f.organization_factory;
        facetAddresses[4] = f.organization;
        facetAddresses[5] = f.loop_factory;
        facetAddresses[6] = f.loop;

        IDiamond.FacetCut[] memory baseFacets = new IDiamond.FacetCut[](facetHelpers.length);
        for (uint i = 0; i < facetHelpers.length; i++) {
            baseFacets[i] = facetHelpers[i].makeFacetCut(facetAddresses[i], IDiamond.FacetCutAction.Add);
        }

        IDiamond.MultiInit [] memory initData = new IDiamond.MultiInit [](5);
        initData[0] = facetHelpers[0].makeInitData(f.diamond_cut, abi.encode(deployer));
        initData[1] = facetHelpers[1].makeInitData(f.diamond_loupe, "");
        initData[2] = facetHelpers[2].makeInitData(f.access_control, abi.encode(deployer));
        initData[3] = facetHelpers[3].makeInitData(f.organization_factory, abi.encode(factory, f.facet_registry));
        initData[4] = facetHelpers[5].makeInitData(f.loop_factory, abi.encode(factory, f.facet_registry, trusted_signer));

        IDiamond.InitParams memory params = IDiamond.InitParams({
            baseFacets: baseFacets,
            init: MULTI_INIT_ADDRESS,
            initData: abi.encode(initData)
        });

        diamond = factory.createDiamond(params);
        factory.setSystemDiamond(diamond);
    }
    function _writeOutputJson() override virtual internal {
        // Save to JSON
        vm.serializeString(jsonWriteKey, "DiamondFactory", vm.toString(address(factory_add)));
        vm.serializeString(jsonWriteKey, "SystemDiamond", vm.toString(diamond));
        vm.writeJson(jsonWriteKey, outputPath);
        console.log("Diamond deployed and saved to:", outputPath);
    }
}
