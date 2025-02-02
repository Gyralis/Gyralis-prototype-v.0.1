// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Loop , Function } from '../loop_registry_st.sol';

/**
 * @title LibLoopSt
 * @notice Library for managing the storage and metadata associated with Loop proxy contracts in compliance with EIP-7201.
 * @dev This library provides utilities to access and manipulate the core storage structure `LOOP_ST`,
 * which contains information about authorized addresses, loop registries, basic loop details, and facet mappings.
 */
library LibLoopSt {

    /**
     * @notice The main storage structure for Loop proxy contracts.
     * @dev Contains the following:
     * - `authed`: Address of the authorized entity for this loop.
     * - `loop_registry`: Address of the loop registry contract.
     * - `basic_loop_info`: Basic loop information, represented by the `Loop` struct.
     * - `loop_facet_info`: Mapping from function selectors to packed data containing version, status, and facet address.
     */
    struct LOOP_ST {
        address authed; // Address of the authorized user for this loop.
        address loop_registry; // Address of the loop registry.
        address system;       // Address of the system diamond
        Loop basic_loop_info; // Basic information about the loop.
        bytes4[] selectors;   // selectors of this LOOP
        mapping(bytes4 => bytes32) loop_facet_info; // Function selector to packed data mapping.
    }

    /**
     * @custom:storage-location erc7201:loop.proxy.diamond
     * @notice Specifies the storage location identifier for the `LOOP_ST` structure.
     * @dev This identifier is computed as:
     * `keccak256(abi.encode(uint256(keccak256("loop.proxy.diamond")) - 1)) & ~bytes32(uint256(0xff))`
     * Reference: https://eips.ethereum.org/EIPS/eip-7201
     */
    bytes32 constant LOOP_ST_SLOT = 0x1fb8d28d35d7e6fad784700f856cbdc7d88611c49fb45a14892907db4f6d7600;

    /**
     * @notice Provides access to the storage structure `LOOP_ST`.
     * @dev Uses inline assembly to load the storage slot defined by `LOOP_ST_SLOT`.
     * This allows direct and efficient access to the data stored for Loop proxy contracts.
     * @return st A reference to the `LOOP_ST` structure in the specified storage slot.
     */
    function _storage() internal pure returns (LOOP_ST storage st) {
        assembly {
            st.slot := LOOP_ST_SLOT
        }
    }
}

