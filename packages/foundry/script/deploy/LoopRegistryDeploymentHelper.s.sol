// SPDX-License-Identifier: MIT License
pragma solidity >=0.8.20;

import {console2} from "forge-std/console2.sol";
import { FacetHelper } from "../../test/facets/Facet.t.sol";
import { DiamondCutFacetHelper,DiamondCutFacet as DiamondCut} from "../../test/facets/cut/cut.t.sol";
import { DiamondLoupeFacetHelper ,DiamondLoupeFacet as DiamondLoupe} from "../../test/facets/loupe/loupe.t.sol";
import {Diamond,IDiamond} from '../../contracts/Diamond.sol';

abstract contract LoopRegistryDeploy_Base  {

    //@custom:external-vars
    address public registry_diamond_add;
    //@custom:internal-vars
    IDiamond.FacetCut[] internal facetHelpers;

    function deploy() public virtual returns(Diamond){
        Diamond.InitParams memory _initParams;
       {
         facetHelpers.push(new DiamondCutFacetHelper().diamondFacet());
         facetHelpers.push(new DiamondLoupeFacetHelper().diamondFacet());
        }
        //facetHelpers.push(new AccessControlFacetHelper());
        {
          console2.log('Deployando diamante (LoopRegistry)...',true);
          (address _init,bytes memory _initData) = _encodeLoopRegistryInitializer();
          _initParams = Diamond.InitParams(
            facetHelpers,
            _init,
            _initData
          );
        }
        Diamond _r = new Diamond(_initParams);
        registry_diamond_add = address(_r);
        return _r;
    }

    function getHelpers()external view virtual returns(IDiamond.FacetCut[] memory){
      return facetHelpers;
    }
    function _encodeLoopRegistryInitializer()internal view virtual returns (address _init,bytes memory _initData);
}
