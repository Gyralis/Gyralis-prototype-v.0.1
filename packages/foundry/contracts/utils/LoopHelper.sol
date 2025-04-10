// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import {FacetHelper} from "./FacetHelper.sol";
import {LoopFacet} from "../facets/loop/LoopFacet.sol";
import {ILoop} from "../facets/loop/ILoop.sol";

contract LoopHelper is FacetHelper {
    LoopFacet public loop;

    constructor() {
        loop = new LoopFacet();
    }

    function facet() public view override returns (address) {
        return address(loop);
    }

    function selectors() public view override returns (bytes4[] memory selectors_) {
         selectors_ = new bytes4[](9);
         selectors_[0] = loop.setPercentPerPeriod.selector;
         selectors_[1] = loop.withdrawDeposit.selector;
         selectors_[2] = loop.claim.selector;
         selectors_[3] = loop.claimAndRegister.selector;
         selectors_[4] = loop.getCurrentPeriod.selector;
         selectors_[5] = loop.getPeriodIndividualPayout.selector;
         selectors_[6] = loop.getLoopDetails.selector;
         selectors_[7] = loop.getCurrentPeriodData.selector;
         selectors_[8] = loop.getClaimerStatus.selector;
    }

    function initializer() public view override returns (bytes4) {
        return loop.Loop_init.selector;
    }

    function supportedInterfaces() public pure override returns (bytes4[] memory interfaces_) {
        interfaces_ = new bytes4[](2);
        interfaces_[0] = type(ILoop).interfaceId;
        
    }

    function creationCode() public pure override returns (bytes memory) {
        return type(LoopFacet).creationCode;
    }
   
}
