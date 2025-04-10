// SPDX-License-Identifier: MIT License
pragma solidity >=0.8.20;

import { BaseScript, FacetHelper } from "../Base.s.sol";
import { FacetRegistry } from "src/registry/FacetRegistry.sol";
import { DiamondFactory } from "src/factory/DiamondFactory.sol";
import { IDiamond } from "src/Diamond.sol";
import {TestToken} from "src/utils/TestToken.sol";
import { MULTI_INIT_ADDRESS } from "src/Constants.sol";


import "forge-std/console.sol";

contract Deploy is BaseScript {
    event EventFacetAddresses(string _msg, FacetAddresses f);
    event EventDeployedContracts(string _msg, DeployedContracts d);

    struct FacetAddresses {
        address diamond_cut ;
        address diamond_loupe ;
        address access_control ;
        address organization_registry ;
        address organization_helper ;
        address loop_factory_helper;
        address loop_helper;
    }
    struct DeployedContracts {
        address facet_registry;
        address factory_diamond;
        address system_diamond;
        address test_token_address;
        address organization;
        address loop;
    }
    FacetAddresses f;
    DeployedContracts d;
    uint deployer_pk;
    address trusted_signer;

    modifier wrapDeployment(){
        console.log("Starting Deployment...");
        _;
        wrap_deployment();
    }
    modifier broadcaster() override {
        deployer_pk = vm.envUint('DEPLOYER_PK');
        vm.startBroadcast(_testerPk);
        _;
        vm.stopBroadcast();
    }
    function run() public virtual wrapDeployment broadcaster {
        _run();
    }


    function _run()internal {
        trusted_signer = vm.envAddress("TRUSTED_SIGNER");
        deployer =  vm.addr(deployer_pk);
        systemAdmin =  0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // address that can call the diamondCut on the diamonds

        // Create the Facet Registry
        FacetRegistry registry = new FacetRegistry();
        d.facet_registry = address(registry);
        {
            console.log("FacetRegistry deployed at:", address(registry));
        }

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
        {
            d.factory_diamond = address(diamondFactory);
            console.log("DiamondFactory deployed at:",d.factory_diamond);
        }

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
            console.log("Setting up initialization data for facets...");
            IDiamond.MultiInit[] memory diamondInitData = new IDiamond.MultiInit[](5);
        {
            // Prepare the Init Data for the Facets
            diamondInitData[0] = facetHelpers[0].makeInitData(facetAddresses[0], abi.encode(systemAdmin)); // DiamondCut
            diamondInitData[1] = facetHelpers[1].makeInitData(facetAddresses[1], ""); // DiamondLoupe
            diamondInitData[2] = facetHelpers[2].makeInitData(facetAddresses[2], abi.encode(msg.sender)); // AccessControl
            diamondInitData[3] = facetHelpers[3].makeInitData(facetAddresses[3], abi.encode(diamondFactory, registry)); // OrganizationFactory
            diamondInitData[4] = facetHelpers[5].makeInitData(facetAddresses[5], abi.encode(diamondFactory, registry, trusted_signer)); // LoopFactory

            f.diamond_cut = facetAddresses[0];
            f.diamond_loupe = facetAddresses[1];
            f.access_control = facetAddresses[2];
            f.organization_registry = facetAddresses[3];
            f.organization_helper = facetAddresses[4];
            f.loop_factory_helper= facetAddresses[5];
            f.loop_helper= facetAddresses[6];
        }


        // Log Init Data
        console.log("DiamondCut init set with address:", facetAddresses[0]);
        console.log("DiamondLoupe init set with address:", facetAddresses[1]);
        console.log("AccessControl init set with address:", facetAddresses[2]);
        console.log("OrganizationFactory init set with address:", facetAddresses[3]);
        console.log("Organization init set with address:", facetAddresses[4]);
        console.log("LoopFactory init set with address:", facetAddresses[5]);

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
        d.system_diamond = diamondFactory.createDiamond(initParams);
        console.log("Diamond deployed at:", d.system_diamond);

        diamondFactory.setSystemDiamond(d.system_diamond);

         //Call createOrganization through the Diamond**
        console.log("Creating Organization...");


        (bool success, bytes memory result) = d.system_diamond.call(
            abi.encodeWithSignature(
                "createOrganization(string,address,string)",
                "1Hive",
                deployer,
                "1Hive DAO Organization"
            )
        );

        d.organization = abi.decode(result, (address));

        printResult(success, result);

        TestToken newToken = new TestToken("Honey", "HNY");
        d.test_token_address = address(newToken);
        console.log("Token Created Successfully at address:", d.test_token_address);

        console.log("Creating Loop through Organization Diamond...");
        (bool loopSuccess, bytes memory loopResult) = d.organization.call(
            abi.encodeWithSignature(
                "createNewLoop(address,address,uint256,uint256)",
                d.system_diamond, // LoopFactory address
                address(newToken), // New token address
                60, // Example duration (120 seconds)
                10 // Example percentage (10%)
            )
        );

        if (loopSuccess) {
            console.log("Loop Created Successfully!");
            d.loop = abi.decode(loopResult, (address));
            console.log("Minting tokens to Loop Diamond...");
            newToken.transfer(d.loop, 1000 * 1e18);  // Transfer 1K tokens to the Loop Diamond
            console.log("Loop Created at address:", d.loop);
        } else {
            console.log("Loop Creation Failed!");
            console.logBytes(loopResult);
        }
    }

    string root;
    string path;
    string chainIdStr ;
    function wrap_deployment() internal {
        console.log("Deployment Complete.");
        emit EventFacetAddresses('wrapping_up::facets',f);
        emit EventDeployedContracts('wrapping_up::contracts',d);

        {
            root = vm.projectRoot();
            path = string.concat(root, "/deployments/");
            chainIdStr = vm.toString(block.chainid);
            path = string.concat(path, string.concat(chainIdStr, ".json"));

            // Inicializa el JSON con una clave base
            string memory jsonWrite = "jsonWrite";

            // facets
            vm.serializeString(jsonWrite, "DiamondCutFacet", vm.toString(f.diamond_cut));
            vm.serializeString(jsonWrite, "DiamondLoupeFacet", vm.toString(f.diamond_loupe));
            vm.serializeString(jsonWrite, "AccessControlFacet", vm.toString(f.access_control));
            vm.serializeString(jsonWrite, "OrganizationFactoryFacet", vm.toString(f.organization_registry));
            vm.serializeString(jsonWrite, "OrganizationFacet", vm.toString(f.organization_helper));
            vm.serializeString(jsonWrite, "LoopFactoryFacet", vm.toString(f.loop_factory_helper));
            vm.serializeString(jsonWrite, "LoopFacet", vm.toString(f.loop_helper));

            // deployments
            vm.serializeString(jsonWrite, "facet_registry", vm.toString(d.facet_registry));
            vm.serializeString(jsonWrite, "factory_diamond", vm.toString(d.factory_diamond));
            vm.serializeString(jsonWrite, "system_diamond", vm.toString(d.system_diamond));
            vm.serializeString(jsonWrite, "test_token_address", vm.toString(d.test_token_address));
            vm.serializeString(jsonWrite, "organization", vm.toString(d.organization));
            vm.serializeString(jsonWrite, "loop", vm.toString(d.loop));

            // Agregar el nombre de la red (corrigiendo el tipo de dato)
            vm.serializeString(jsonWrite, "force_abis", "true");
            jsonWrite = vm.serializeString(jsonWrite, "networkName", chainIdStr);

            // Escribir el JSON en el archivo
            vm.writeJson(jsonWrite, path);
        }

    }
    function printResult(bool success, bytes memory result) public pure{
         if (success) {
            console.log("Organization Created Successfully!");
            address newOrganization = abi.decode(result, (address));
            console.log("Organization Created Successfully at address:", newOrganization);
        } else {
            console.log("Organization Creation Failed!");
            console.logBytes(result);
        }
    }

}
