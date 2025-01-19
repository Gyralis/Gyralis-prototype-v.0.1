// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import {FacetHelper} from "../../utils/FacetHelper.sol";
import {OrganizationFactoryFacet} from "../../facets/Organization/OrganizationFactoryFacet.sol";
import {IOrganizationFactory} from "./IOrganizationFactory.sol";

contract DiamondLoupeFacetHelper is FacetHelper {
    OrganizationFactoryFacet public organizationFactory;

    constructor() {
        organizationFactory = new OrganizationFactoryFacet();
    }

    function facet() public view override returns (address) {
        return address(organizationFactory);
    }

    function selectors() public view override returns (bytes4[] memory selectors_) {
        // selectors_ = new bytes4[](5);
        // selectors_[0] = organizationFactory.facetFunctionSelectors.selector;
        // selectors_[1] = organizationFactory.facetAddresses.selector;
        // selectors_[2] = organizationFactory.facetAddress.selector;
        // selectors_[3] = organizationFactory.facets.selector;
        // selectors_[4] = organizationFactory.supportsInterface.selector;
    }

    function initializer() public view override returns (bytes4) {
        return organizationFactory.OrganizationFactory_init.selector;
    }

    function supportedInterfaces() public pure override returns (bytes4[] memory interfaces_) {
        interfaces_ = new bytes4[](2);
        interfaces_[0] = type(IOrganizationFactory).interfaceId;
        
    }

    function creationCode() public pure override returns (bytes memory) {
        return type(OrganizationFactoryFacet).creationCode;
    }
}
