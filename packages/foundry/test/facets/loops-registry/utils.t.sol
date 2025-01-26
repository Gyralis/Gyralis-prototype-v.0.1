// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {PackedDataUtils} from "contracts/facets/loop-registry/constants.sol";
import {packData,unpackData} from 'contracts/facets/loop-registry/utils.sol';

contract PackedDataUtils_Test is Test {
    // Constants for testing
    bytes4 constant TEST_SELECTOR = 0xabcdef12; // Function selector
    bytes8 constant TEST_DATA = 0x0000000100000000; // Encoded version or status
    address constant TEST_ADDRESS = 0x1234567890123456789012345678901234567890; // Test address

    /// @notice Test packing data into `bytes32` using the `pack` function.
    function testPackData() public {
        // Pack the data using the library function
        bytes32 packed = packData(TEST_SELECTOR, TEST_DATA, TEST_ADDRESS);

        bytes32 expected = bytes32(
            (uint256(uint32(TEST_SELECTOR)) << 224) | 
            (uint256(uint64(TEST_DATA)) << 160) | 
            uint256(uint160(TEST_ADDRESS))       
        );
        emit log_named_bytes32('Expected',expected);
        emit log_named_bytes32('Packed  ',packed);

        // Validate the packed result
        assertEq(packed, expected, "Packed data does not match the expected result");
    }

    /// @notice Test unpacking `bytes32` into components using the `unpack` function.
    function testUnpackData() public {
        // Pack the data for testing
        bytes32 packed = packData(TEST_SELECTOR, TEST_DATA, TEST_ADDRESS);

        // Unpack the data using the library function
        (bytes4 selector, bytes8 data, address facetAddress) = unpackData(packed);

        // Validate unpacked components
        assertEq(selector, TEST_SELECTOR, "Selector mismatch");
        assertEq(data, TEST_DATA, "Data mismatch");
        assertEq(facetAddress, TEST_ADDRESS, "Address mismatch");
    }

    /// @notice Test consistency of packing and unpacking data.
    function testPackAndUnpackConsistency() public {
        // Pack the data

        bytes32 packed = packData(TEST_SELECTOR, TEST_DATA, TEST_ADDRESS);
        // Unpack the packed data
        (bytes4 selector, bytes8 data, address facetAddress) = unpackData(packed);

        // Repack the unpacked data
        bytes32 repacked = packData(selector, data, facetAddress);

        // Validate that the original packed data matches the repacked data
        assertEq(packed, repacked, "Packed and repacked data do not match");
    }

    /// @notice Test validation of selector using `hasSelector`.
    function testHasSelector(uint8 _selIndex) public {
        _selIndex =uint8(bound(_selIndex,0,5));
        bytes4 _sel;
        { 
            if(_selIndex==0) _sel = PackedDataUtils.LIVE;
            if(_selIndex==1) _sel = PackedDataUtils.UNDER_MAINTENANCE;
            if(_selIndex==2) _sel = PackedDataUtils.DEPRECATED;
            if(_selIndex==3) _sel = PackedDataUtils.UPGRADING;
            if(_selIndex==4) _sel = PackedDataUtils.STATIC;
            if(_selIndex==5) _sel = PackedDataUtils.IMMUTABLE;
        }
        // Pack the data
        bytes32 packed = packData(_sel, TEST_DATA, TEST_ADDRESS);
        emit log_named_bytes32('PackedData',packed);
        // Verify the selector matches
        bool hasCorrectSelector = PackedDataUtils.hasSelector(packed,_sel);
        assertTrue(hasCorrectSelector, "Selector does not match");

        // Verify with an incorrect selector
        bool hasIncorrectSelector = PackedDataUtils.hasSelector(packed, 0xdeadbeef);
        assertFalse(hasIncorrectSelector, "Selector should not match");
    }

    /// @notice Test packing data with invalid address (zero address).
    function testPackDataWithZeroAddress() public {
        vm.expectRevert("Facet address cannot be zero");
        packData(PackedDataUtils.LIVE, TEST_DATA, address(0));
    }

    /// @notice Test unpacking specific field boundaries.
    function testUnpackDataFieldBoundaries() public {
        // Manually create packed data
        bytes32 packed = bytes32(
            (uint256(0xdeadbeef) << 224) | // Selector
            (uint256(0x1234567890abcdef) << 160) | // Data
            uint256(uint160(TEST_ADDRESS)) // Address
        );

        // Unpack the data using the library
        (bytes4 selector, bytes8 data, address facetAddress) = unpackData(packed);

        // Validate each field
        assertEq(bytes32(selector),bytes4(0xdeadbeef), "Selector mismatch");
        assertEq(data, bytes8(0x1234567890abcdef), "Data mismatch");
        assertEq(facetAddress, TEST_ADDRESS, "Address mismatch");
    }
}

