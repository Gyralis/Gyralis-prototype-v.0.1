pragma solidity >=0.8.20;

import {FacetHelper} from "./FacetHelper.sol";
import {DiamondLoupeFacet, IERC165} from "../facets/loupe/DiamondLoupeFacet.sol";
import {IDiamondLoupe} from "../facets/loupe/IDiamondLoupe.sol";


contract DiamondLoupeFacetHelper is FacetHelper {
    DiamondLoupeFacet public diamondLoupe;

    constructor() {
        diamondLoupe = new DiamondLoupeFacet();
    }

    function facet() public view override returns (address) {
        return address(diamondLoupe);
    }

    function selectors() public view override returns (bytes4[] memory selectors_) {
        selectors_ = new bytes4[](5);
        selectors_[0] = diamondLoupe.facetFunctionSelectors.selector;
        selectors_[1] = diamondLoupe.facetAddresses.selector;
        selectors_[2] = diamondLoupe.facetAddress.selector;
        selectors_[3] = diamondLoupe.facets.selector;
        selectors_[4] = diamondLoupe.supportsInterface.selector;
    }

    function initializer() public view override returns (bytes4) {
        return diamondLoupe.DiamondLoupe_init.selector;
    }

    function supportedInterfaces() public pure override returns (bytes4[] memory interfaces_) {
        interfaces_ = new bytes4[](2);
        interfaces_[0] = type(IDiamondLoupe).interfaceId;
        interfaces_[1] = type(IERC165).interfaceId;
    }

    function creationCode() public pure override returns (bytes memory) {
        return type(DiamondLoupeFacet).creationCode;
    }
}