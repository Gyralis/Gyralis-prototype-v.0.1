// SPDX-License-Identifier: MIT License
pragma solidity >=0.8.20;

import "forge-std/console2.sol";
import { FacetHelper } from "../../test/facets/Facet.t.sol";
import { DiamondCutFacetHelper,DiamondCut } from "../../test/facets/cut/cut.t.sol";
import { DiamondLoupeFacetHelper ,DiamondLoupe} from "../../test/facets/loupe/loupe.t.sol";
import {Diamond,IDiamond} from '../../contracts/Diamond.sol';

abstract contract LoopRegistryDeploy_Base  {
    //@custom:external-vars
    address public deployer_address;
    address public registry_diamond_add;
    //@custom:internal-vars
    FacetCut[] internal facetHelpers;

    function deploy() public virtual returns(Diamond){
        Diamond.InitParams memory _initParams;
       {
         facetHelpers.push(new DiamondCutFacetHelper().diamondFacet());
         facetHelpers.push(new DiamondLoupeFacetHelper().diamondFacet());
        }
        //facetHelpers.push(new AccessControlFacetHelper());
        {
          console2.log('Deployando diamante (LoopRegistry)...');
          (address _init,bytes memory _initData) = _encodeLoopRegistryInitializer();
          _initParams = Diamond.InitParams(
            facetHelpers,
            _init,
            _initData
          );
        }
        registry_diamond_add = address(new Diamond(_initParams));
      return registry_diamond_add;
    }

    function getHelpers()external view virtual returns(FacetCut[] memory){
      return facetHelpers;
    }
    function _encodeLoopRegistryInitializer()internal view virtual returns (address _init,bytes memory _initData);
}
