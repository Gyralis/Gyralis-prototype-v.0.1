// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.20;

import { Test, console2 } from "forge-std/Test.sol";
import {
  LoopRegistryDeploy_Base,
  IDiamond,
  Diamond,
  DiamondLoupe,
  DiamondCut
} from "script/deploy/loop_registry_deployment_helper.sol";

contract WLoopRegistryDeploy_Base is LoopRegistryDeploy_Base{
    event InitializingLoopRegistryInputs();
    constructor(
        address _facet_registry,
        address _admin
    ){
       facet_registry = _facet_registry;
       admin = _admin;
    }

    function _initializeLoopRegistryInputs() internal virtual override{
        emit InitializingLoopRegistryInputs();
    }
}

contract LoopRegistryDeploy_Test is Test {
  WLoopRegistryDeploy_Base deploy_helper;
  Diamond loop_registry;
  address deployer_address;
  address facet_registry;
  address admin;

  function setUp() public virtual{
    deployer_address = makeAddr('DEPLOYER_DEL_MOCK');
    facet_registry = makeAddr('FACET_REGISTRY');
    admin = makeAddr('ADMIN');
    vm.deal(deployer_address,100 ether);
    vm.startPrank(deployer_address);
    deploy_helper = new WLoopRegistryDeploy_Base(facet_registry,admin);
    loop_registry = deploy_helper.deploy();
    vm.stopPrank();
  }
  function test_hasFacetsInstalled() external {
   DiamondLoupe w_loupe = DiamondLoupe(address(loop_registry));
   IDiamond.FacetCut[] memory expected =  deploy_helper.getHelpers();

   for(uint i =0;i<expected.length;i++){
     bytes32 hashed_expected_selectors = keccak256(abi.encodePacked(expected[i].selectors));
     bytes32 hashed_stored = keccak256(abi.encodePacked(w_loupe.facetFunctionSelectors(expected[i].facet)));
     assertEq32(hashed_stored,hashed_expected_selectors);
   }
  }
}
