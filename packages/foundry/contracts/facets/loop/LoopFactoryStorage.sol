// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LoopFactoryStorage {
    bytes32 internal constant STORAGE_SLOT = keccak256("diamond.loopfactory.storage");

    struct Layout {
        address diamondFactory;
        address facetRegistry;
        uint256 loopCounter;
        mapping(uint256 => address) loops;
        mapping(address => address[]) organizationLoops;
    }


    function layout() internal pure returns (Layout storage ds) {
        bytes32 position = STORAGE_SLOT;
        assembly {
            ds.slot := position
        }
    }
}
