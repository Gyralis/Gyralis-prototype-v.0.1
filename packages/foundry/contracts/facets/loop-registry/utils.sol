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
 * @example
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
 * @example
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

