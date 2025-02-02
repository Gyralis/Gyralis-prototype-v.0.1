// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { unpackData } from './utils.sol';
/// @title Packed Data Utilities Library
/// @notice Provides utilities for managing packed `bytes32` data and predefined state constants.
/// @dev This library includes constants and functions to extract and verify components from a `bytes32`.
library PackedDataUtils {
    // State constants
    bytes4 constant LIVE = 0x4c495645; // Represents the LIVE state
    bytes4 constant UNDER_MAINTENANCE = 0x4d4e544d; // Represents the UNDER_MAINTENANCE state
    bytes4 constant DEPRECATED = 0x44455052; // Represents the DEPRECATED state
    bytes4 constant UPGRADING = 0x55504752; // Represents the UPGRADING state
    bytes4 constant STATIC = 0x53544943; // Represents the STATIC state
    bytes4 constant IMMUTABLE = 0x494d4d54; // Represents the IMMUTABLE state

    /// @notice Verifies if a packed `bytes32` contains a specific state in the selector.
    /// @dev Compares the selector component with predefined constants like `LIVE` or `DEPRECATED`.
    /// @param packedData The packed `bytes32` value.
    /// @param expectedSelector The expected selector to check for.
    /// @return isMatch Returns `true` if the selector matches the expected value.
    function hasSelector(bytes32 packedData, bytes4 expectedSelector)
        internal
        pure
        returns (bool isMatch)
    {
        (bytes4 selector, , ) = unpackData(packedData);
        isMatch = (selector == expectedSelector);
    }
}

