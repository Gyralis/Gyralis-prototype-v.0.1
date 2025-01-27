pragma solidity >=0.8.20;

import {FacetHelper} from "./FacetHelper.sol";
import {AccessControlFacet} from "../facets/access-control/AccessControlFacet.sol";
import {IAccessControl} from "../facets/access-control/IAccessControl.sol";

contract AccessControlFacetHelper is FacetHelper {
    AccessControlFacet public acl;

    constructor() {
        acl = new AccessControlFacet();
    }

    function facet() public view override returns (address) {
        return address(acl);
    }

    function selectors() public view override returns (bytes4[] memory selectors_) {
        selectors_ = new bytes4[](7);
        selectors_[0] = acl.setFunctionAccess.selector;
        selectors_[1] = acl.setUserRole.selector;
        selectors_[2] = acl.canCall.selector;
        selectors_[3] = acl.userRoles.selector;
        selectors_[4] = acl.functionRoles.selector;
        selectors_[5] = acl.hasRole.selector;
        selectors_[6] = acl.roleHasAccess.selector;
    }

    function initializer() public view override returns (bytes4) {
        return acl.AccessControl_init.selector;
    }

    function supportedInterfaces() public pure override returns (bytes4[] memory interfaces) {
        interfaces = new bytes4[](1);
        interfaces[0] = type(IAccessControl).interfaceId;
    }

    function creationCode() public pure override returns (bytes memory) {
        return type(AccessControlFacet).creationCode;
    }

    function makeInitData(bytes memory args) public view override returns (MultiInit memory) {
        return
            MultiInit({ init: facet(), initData: abi.encodeWithSelector(initializer(), abi.decode(args, (address))) });
    }
}
