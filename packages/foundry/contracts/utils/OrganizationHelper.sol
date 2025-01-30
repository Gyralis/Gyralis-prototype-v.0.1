// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import {FacetHelper} from "./FacetHelper.sol";
import {OrganizationFacet} from "../facets/Organization/OrganizationFacet.sol";
import {IOrganization} from "../facets/Organization/IOrganization.sol";

contract OrganizationHelper is FacetHelper {
    OrganizationFacet public organization;

    constructor() {
        organization = new OrganizationFacet();
    }

    function facet() public view override returns (address) {
        return address(organization);
    }

    function selectors() public view override returns (bytes4[] memory selectors_) {
         selectors_ = new bytes4[](6);
         selectors_[0] = organization.addAdmin.selector;
         selectors_[1] = organization.createLoop.selector;
         selectors_[2] = organization.getOrganizationAdmin.selector;
         selectors_[3] = organization.getOrganizationDescription.selector;
         selectors_[4] = organization.getOrganizationName.selector;
         selectors_[5] = organization.removeAdmin.selector;
    }

    function initializer() public view override returns (bytes4) {
        return organization.Organization_init.selector;
    }

    function supportedInterfaces() public pure override returns (bytes4[] memory interfaces_) {
        interfaces_ = new bytes4[](2);
        interfaces_[0] = type(IOrganization).interfaceId;
        
    }

    function creationCode() public pure override returns (bytes memory) {
        return type(OrganizationFacet).creationCode;
    }
   
    function makeInitData( address _facet, bytes memory args) public view override returns (MultiInit memory) {
    // Decode args as a tuple of two addresses
        (string memory name, address admin , string memory description) = abi.decode(args, (string, address, string));
        
        return MultiInit({
            init: _facet,
            // Encode the selector with the two addresses
            initData: abi.encodeWithSelector(initializer(), name, admin, description)
        });
    }
}
