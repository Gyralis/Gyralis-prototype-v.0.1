// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Initializable} from '@oz-upgrades/proxy/utils/Initializable.sol';
import {unpackData, packData} from '../utils.sol';
import {LibLoopSt, Loop, Function} from './loop_st.sol';
import {PackedDataUtils} from '../constants.sol';
/**
 * @title Loop_Initializer_V0
 * @notice Contract for initializing Loop storage and registering functions for a Loop diamond proxy.
 * @dev This contract uses OpenZeppelin's Initializable for protection against reinitialization.
 * It configures essential loop metadata, authorized addresses, and function mappings within the storage structure.

  @custom:todos 
  1. Add authorization guard (and roles) into initializer
  2. Add epoch time (or strategy) into initializer (limited to 256 epochs and due math simplicity, SHOULD BE divisible into 2)
  3. Facets -> register (add authed address or regostry?)
            -> claim (merkletrees + bitmaps are the way)
 */
contract Loop_Initializer_V0 is Initializable {
    event LoopInitialized();
    using {unpackData} for bytes32;

    /// @notice Error emitted when no functions are provided for initialization.
    error MUST_SEND_FNs();

    /// @notice Error emitted when a function selector is already registered.
    error FN_ALREADY_USED();

    /**
     * @notice Initializes the Loop storage with metadata, authorized addresses, and functions.
     * @dev This function sets up the following:
     * - Basic Loop information such as version, sybil protection, distribution strategy, etc.
     * - Important addresses including the sender, loop registry, and system address.
     * - Function selectors mapped to packed data (version, status, and function address).
     * @param _packedFns An array of packed function data, each containing the selector, additional metadata, and function address.
     * @param _l A struct containing basic Loop metadata.
     * @param _sender Address of the entity authorized to manage this Loop.
     * @param _loopRegistry Address of the Loop registry contract.
     * @param _system Address of the system responsible for managing this Loop.
     */
    function initialize_loop(
        bytes32[] calldata _packedFns,
        Loop calldata _l,
        address _sender,
        address _loopRegistry,
        address _system
    ) external initializer {
        // Access the Loop storage structure
        LibLoopSt.LOOP_ST storage st = LibLoopSt._storage();

        // Store basic Loop metadata
        st.basic_loop_info.autoUpdate = _l.autoUpdate; // Auto-update flag for Loop facets.
        st.basic_loop_info.sybil = _l.sybil; // Sybil protection flag.
        st.basic_loop_info.version = _l.version; // Version identifier for the Loop.
        st.basic_loop_info.distStrategy = _l.distStrategy; // Distribution strategy for Loop rewards.
        st.basic_loop_info.distToken = _l.distToken; // Token used for distributions.
        st.basic_loop_info.orgName = _l.orgName; // Organization name associated with the Loop.

        // Store important addresses
        st.authed = _sender; // Address authorized to manage the Loop.
        st.loop_registry = _loopRegistry; // Address of the Loop registry contract.
        st.system = _system; // Address of the system managing this Loop.
            
        emit DebugBytesArr('Adentro del init',_packedFns);
        // Validate and store function data
        uint256 p_len = _packedFns.length;
        if (p_len == 0) revert MUST_SEND_FNs(); // Revert if no functions are provided.
        uint _stV = st.basic_loop_info.version;
        for (uint256 i = 0; i < p_len; i++) {
            bytes32 _f = _packedFns[i]; // Extract packed function data
            (bytes4 _sel, bytes8 _data, address _fAdd) = _f.unpackData(); // Unpack into selector, metadata, and address.

            // Check if the function selector is already registered
            bytes32 _stored = st.loop_facet_info[_sel];
            if (_stored != 0x00) revert FN_ALREADY_USED(); // Revert if selector is already in use.

            // Store function mapping with version, status, and address
            st.loop_facet_info[_sel] = packData(
                bytes4(uint32(_stV)), // Store the Loop version.
                PackedDataUtils.LIVE, // Mark the function as live.
                _fAdd // Store the function address.
            );
            st.selectors.push(_sel);
        }
        emit LoopInitialized();
    }
}

