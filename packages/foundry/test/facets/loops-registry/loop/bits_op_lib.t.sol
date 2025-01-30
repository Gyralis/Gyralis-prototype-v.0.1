// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.20;

import { Test, console2 } from "forge-std/Test.sol";
import {BitOperations} from "contracts/facets/loop-registry/utils.sol";

contract TestBitOperations is Test {
    function testIsBitSet() public {
        bytes32 data = bytes32(uint(0x02)); // 000...0010 (bit 1 is set)
        assertEq(BitOperations.isBitSet(data, 1), true, "Bit 1 should be set");
        assertEq(BitOperations.isBitSet(data, 0), false, "Bit 0 should not be set");
    }

    function testSetBit() public {
        bytes32 data = 0x00;
        bytes32 expected = bytes32(uint(0x04)); // 000...0100 (bit 2 is set)
        assertEq(BitOperations.setBit(data, 2), expected, "Bit 2 should be set");
    }

    function testClearBit() public {
        bytes32 data = bytes32(uint(0x08)); // 000...1000 (bit 3 is set)
        bytes32 expected = 0x00; // All bits cleared
        assertEq(BitOperations.clearBit(data, 3), expected, "Bit 3 should be cleared");
    }

    function testToggleBit() public {
        bytes32 data = 0x00;
        bytes32 toggledOnce = BitOperations.toggleBit(data, 4); // 000...10000
        bytes32 toggledTwice = BitOperations.toggleBit(toggledOnce, 4); // Back to 0
        assertEq(toggledOnce, bytes32(uint(0x10)), "Bit 4 should be toggled to 1");
        assertEq(toggledTwice, 0x00, "Bit 4 should be toggled back to 0");
    }

    function testCountSetBits() public {
        bytes32 data = bytes32(uint(0x03)); // 000...0011 (2 bits set)
        assertEq(BitOperations.countSetBits(data), 2, "Should count 2 bits set");
    }

    function testInvertBits() public {
        bytes32 data = 0x00; // All bits cleared
        bytes32 expected = bytes32(~uint256(0x00)); // All bits should be flipped
        assertEq(BitOperations.invertBits(data), expected, "All bits should be inverted");
    }
}

