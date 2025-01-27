// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import {FacetHelper} from "./FacetHelper.sol";
import {OrganizationFactoryFacet} from "../facets/Organization/OrganizationFactoryFacet.sol";
import {IOrganizationFactory} from "../facets/Organization/IOrganizationFactory.sol";

contract OrganizationFactoryHelper is FacetHelper {
    OrganizationFactoryFacet public organizationFactory;

    constructor() {
        organizationFactory = new OrganizationFactoryFacet();
    }

    function facet() public view override returns (address) {
        return address(organizationFactory);
    }

    function selectors() public view override returns (bytes4[] memory selectors_) {
         selectors_ = new bytes4[](3);
         selectors_[0] = organizationFactory.createOrganization.selector;
         selectors_[1] = organizationFactory.getOrganizationById.selector;
         selectors_[2] = organizationFactory.getOrganizationCount.selector;
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
   
    function makeInitData( bytes memory args) public view override returns (MultiInit memory) {
    // Decode args as a tuple of two addresses
        (address diamondFactory, address facetRegistry) = abi.decode(args, (address, address));
        
        return MultiInit({
            init: facet(),
            // Encode the selector with the two addresses
            initData: abi.encodeWithSelector(initializer(), diamondFactory, facetRegistry)
        });
    }
}
