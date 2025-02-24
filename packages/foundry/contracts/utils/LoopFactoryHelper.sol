// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import {FacetHelper} from "./FacetHelper.sol";
import {LoopFactoryFacet} from "../facets/loop/LoopFactoryFacet.sol";
import {ILoopFactory} from "../facets/loop/ILoopFactory.sol";

contract LoopFactoryHelper is FacetHelper {
    LoopFactoryFacet public loopFactory;

    constructor() {
        loopFactory = new LoopFactoryFacet();
    }

    function facet() public view override returns (address) {
        return address(loopFactory);
    }

    function selectors() public view override returns (bytes4[] memory selectors_) {
         selectors_ = new bytes4[](2);
         selectors_[0] = loopFactory.createLoop.selector;
         selectors_[1] = loopFactory.getLoopsByOrganization.selector;
    }

    function initializer() public view override returns (bytes4) {
        return loopFactory.LoopFactory_init.selector;
    }

    function supportedInterfaces() public pure override returns (bytes4[] memory interfaces_) {
        interfaces_ = new bytes4[](2);
        interfaces_[0] = type(ILoopFactory).interfaceId;

    }

    function creationCode() public pure override returns (bytes memory) {
        return type(LoopFactoryFacet).creationCode;
    }

    function makeInitData( address _facet, bytes memory args) public view override returns (MultiInit memory) {
    // Decode args as a tuple of two addresses
        (address diamondFactory, address facetRegistry) = abi.decode(args, (address, address));

        return MultiInit({
            init: _facet,
            // Encode the selector with the two addresses
            initData: abi.encodeWithSelector(initializer(), diamondFactory, facetRegistry)
        });
    }
}
