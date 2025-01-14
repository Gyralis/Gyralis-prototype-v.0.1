// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.20;

import { Test } from "forge-std/Test.sol";
import { 
  LoopRegistryDeploy_Base,
  IDiamond,
  Diamond,
  DiamondLoupe,
  DiamondCut
} from "script/deploy/LoopRegistryDeploymentHelper.s.sol"; 


contract LoopRegistryDeploy_Test is Test {
  LoopRegistryDeploy_Base deploy_helper;
  Diamond loop_registry;

  function setUp() public virtual{
    deployer_address = makeAddr('DEPLOYER_DEL_MOCK');
    vm.deal(deployer_address,100 ether);
    vm.startPrank(deployer_address);
    deploy_helper = new LoopRegistryDeploy_Base();
    loop_registry = deploy_helper.deploy();
    vm.stopPrank();
  }
  function test_hasFacetsInstalled() external {
   DiamondLoupe w_loupe = DiamondLoupe(address(loop_registry));
   IDiamond.FacetCut[] memory expected =  deploy_helper.getHelpers();

   for(uint i =0;i<expected.length;i++){
     bytes32 hashed_expected_selectors = keccak256(abi.encodePacked(expected[i].selectors));
     bytes32 hashed_stored = keccak256(abi.encodePacked(w_loupe.facetFunctionSelectors(expected.facet)));
     assertEq32(hashed_stored,hashed_expected_selectors);
   }
  }
}


