// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import {FacetHelper} from "./FacetHelper.sol";
import {DiamondCutFacet} from "../facets/cut/DiamondCutFacet.sol";
import {IDiamondCut} from "../facets/cut/IDiamondCut.sol";

contract DiamondCutFacetHelper is FacetHelper {
    DiamondCutFacet public diamondCut;

    constructor() {
        diamondCut = new DiamondCutFacet();
    }

    function facet() public view override returns (address) {
        return address(diamondCut);
    }

    function selectors() public view override returns (bytes4[] memory selectors_) {
        selectors_ = new bytes4[](1);
        selectors_[0] = diamondCut.diamondCut.selector;
    }

    function initializer() public view override returns (bytes4) {
        return diamondCut.DiamondCut_init.selector;
    }

    function supportedInterfaces() public pure override returns (bytes4[] memory interfaces) {
        interfaces = new bytes4[](1);
        interfaces[0] = type(IDiamondCut).interfaceId;
    }

    function creationCode() public pure override returns (bytes memory) {
        return type(DiamondCutFacet).creationCode;
    }
}