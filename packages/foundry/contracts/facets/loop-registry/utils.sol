// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

/*
 * @notice Unpacks a packed `bytes32` value into its components: selector, data, and facet address.
 * @dev This function extracts the following components from the packed data:
 *      - **[4 bytes] Selector:** The function selector, a unique identifier for the function.
 *      - **[8 bytes] Data:** A generic field that can encode multiple meanings (e.g., version, status).
 *      - **[20 bytes] Address:** The address of the associated facet.
 * @param packedData The packed `bytes32` value containing the selector, data, and facet address.
 * @return selector The first 4 bytes of the packed data (function selector).
 * @return data The next 8 bytes of the packed data, representing version or status as defined in usage context.
 * @return facetAddress The last 20 bytes of the packed data (facet address).
 * @custom:example
 * // Input packed data
 * bytes32 packedData = 0xabcdef12000000010000000000000000000000123456789012345678901234567890;
 *
 * // Unpack the data
 * (bytes4 sel, uint64 data, address addr) = unpackFacetData(packedData);
 *
 * // Output:
 * // sel -> 0xabcdef12 (Function selector)
 * // data -> 0x0000000100000000 (Encoded version or status)
 * // addr -> 0x1234567890123456789012345678901234567890 (Facet address)
 **/
function unpackData(bytes32 packedData)
  pure
  returns (bytes4 selector, bytes8 data, address facetAddress)
{
    // Extract the first 4 bytes (function selector)
    selector = bytes4(packedData);

    // Extract the next 8 bytes (data)
    data = bytes8(packedData << 32);

    // Extract the last 20 bytes (facet address)
    facetAddress = address(uint160(uint256(packedData)));
}

/*
 * @notice Packs the selector, data, and facet address into a single `bytes32`.
 * @dev The packed format is as follows:
 *      - **[4 bytes] Selector:** A unique identifier for the function.
 *      - **[8 bytes] Data:** Encodes version, status, or other information depending on context.
 *      - **[20 bytes] Address:** The address of the associated facet.
 * @param selector The function selector (4 bytes).
 * @param data The generic data field (8 bytes), which may represent version, status, or other encoded information.
 * @param facetAddress The address of the associated facet (20 bytes).
 * @return bytes32 Packed data containing the selector, data, and facet address.
 * @custom:example
 * // Input components
 * bytes4 selector = 0xabcdef12;
 * uint64 data = 1; // Could represent version 1
 * address facetAddress = 0x1234567890123456789012345678901234567890;
 *
 * // Pack the data
 * bytes32 packedData = packFacetData(selector, data, facetAddress);
 *
 * // Output:
 * // packedData -> 0xabcdef12000000010000000000000000000000123456789012345678901234567890
 **/
function packData(
    bytes4 selector,
    bytes8 data,
    address facetAddress
) pure returns (bytes32) {
    require(facetAddress != address(0), "Facet address cannot be zero");
    return bytes32(
        (uint256(uint32(selector)) << 224) | 
        (uint256(uint64(data)) << 160) | 
        uint256(uint160(facetAddress))       
    );
}


/// @title Bitwise Operations Library for bytes32
/// @notice This library provides utility functions for manipulating and querying individual bits within a bytes32 variable.
/// @dev This library is primarily designed for tracking whether users have claimed rewards in different loops,
/// but it can also be used for any application requiring efficient bit manipulation.
/// It enables setting, clearing, toggling, checking, counting, and inverting bits efficiently.
/// 
/// ## Example Use Case
/// Imagine you are tracking rewards for users in a game where each bit represents whether a user has claimed a reward.
/// Using this library, you can efficiently track and manipulate these states without using large storage mappings.
/// 
/// Example representation:
/// - `0x000000000000000000000000000000000000000000000000000000000000000F` (Bits 0-3 are set, indicating four rewards claimed)
/// - `0x0000000000000000000000000000000000000000000000000000000000000000` (No rewards claimed)
/// - `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF` (All rewards claimed)
/// 
/// This makes it particularly useful for gas-efficient state tracking.
library BitOperations {
    
    error IndexOutOfBounds();
    
    /// @notice Checks if a specific bit in a bytes32 variable is set to 1.
    /// @param data The bytes32 value to check.
    /// @param index The bit position (0-255) to check.
    /// @return bool True if the bit is set, false otherwise.
    /// @custom:example
    /// bytes32 exampleData = 0x04; // 000...0100 (Bit 2 is set)
    /// bool isSet = BitOperations.isBitSet(exampleData, 2); // Returns true
    function isBitSet(bytes32 data, uint8 index) internal pure returns (bool) {
        if (index >= 256) revert IndexOutOfBounds();
        return (uint256(data) & (1 << index)) != 0;
    }
    
    /// @notice Sets a specific bit in a bytes32 variable.
    /// @param data The original bytes32 value.
    /// @param index The bit position (0-255) to set.
    /// @return bytes32 The new bytes32 value with the bit set.
    /// @custom:example
    /// bytes32 exampleData = 0x00;
    /// bytes32 updatedData = BitOperations.setBit(exampleData, 3); // 000...1000
    function setBit(bytes32 data, uint8 index) internal pure returns (bytes32) {
        if (index >= 256) revert IndexOutOfBounds();
        return bytes32(uint256(data) | (1 << index));
    }

    /// @notice Clears (sets to 0) a specific bit in a bytes32 variable.
    /// @param data The original bytes32 value.
    /// @param index The bit position (0-255) to clear.
    /// @return bytes32 The new bytes32 value with the bit cleared.
    /// @custom:example
    /// bytes32 exampleData = 0x08; // 000...1000 (Bit 3 is set)
    /// bytes32 updatedData = BitOperations.clearBit(exampleData, 3); // 000...0000
    function clearBit(bytes32 data, uint8 index) internal pure returns (bytes32) {
        if (index >= 256) revert IndexOutOfBounds();
        return bytes32(uint256(data) & ~(1 << index));
    }

    /// @notice Toggles (flips) a specific bit in a bytes32 variable.
    /// @param data The original bytes32 value.
    /// @param index The bit position (0-255) to toggle.
    /// @return bytes32 The new bytes32 value with the bit flipped.
    /// @custom:example
    /// bytes32 exampleData = 0x00;
    /// bytes32 toggledOnce = BitOperations.toggleBit(exampleData, 4); // 000...10000
    /// bytes32 toggledTwice = BitOperations.toggleBit(toggledOnce, 4); // 000...00000
    function toggleBit(bytes32 data, uint8 index) internal pure returns (bytes32) {
        if (index >= 256) revert IndexOutOfBounds();
        return bytes32(uint256(data) ^ (1 << index));
    }

    /// @notice Counts the number of bits set to 1 in a bytes32 variable.
    /// @param data The bytes32 value to check.
    /// @return uint8 The number of bits set to 1.
    /// @custom:example
    /// bytes32 exampleData = 0x03; // 000...0011 (Two bits are set)
    /// uint8 count = BitOperations.countSetBits(exampleData); // Returns 2
    function countSetBits(bytes32 data) internal pure returns (uint8) {
        uint256 value = uint256(data);
        uint8 count = 0;
        while (value > 0) {
            count += uint8(value & 1);
            value >>= 1;
        }
        return count;
    }

    /// @notice Inverts all bits in a bytes32 variable.
    /// @param data The original bytes32 value.
    /// @return bytes32 The inverted bytes32 value.
    /// @custom:example
    /// bytes32 exampleData = 0x00; // 000...0000
    /// bytes32 invertedData = BitOperations.invertBits(exampleData); // 111...1111
    function invertBits(bytes32 data) internal pure returns (bytes32) {
        return bytes32(~uint256(data));
    }
}

