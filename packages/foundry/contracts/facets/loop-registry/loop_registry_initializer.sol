// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.20;

import {Initializable} from '@oz-upgrades/proxy/utils/Initializable.sol';
import { IDiamond } from "contracts/IDiamond.sol";
import {DiamondCutBase} from 'contracts/facets/cut/DiamondCutBase.sol';
import {LibLoopRegistrySt} from './loop_registry_st.sol';
import {unpackData, packData} from './utils.sol';
import {MinimalAccressControl} from './utils/minimal_access_control.sol';
import {PackedDataUtils} from './constants.sol';

/**
 * @title Loop Registry Initializer V0
 * @notice This contract is responsible for initializing the loop registry in a diamond-based architecture.
 * @dev The contract uses the Initializable modifier to ensure the registry is set up only once. It configures key
 * parameters such as the loop initializer selector, the minimal implementation address, the facet registry address,
 * and administrator roles. Additionally, it installs facets using the diamond cut mechanism and registers loop functions
 * based on packed function data.
 */
interface ILoop_Registry_InitializerV0 {
    /**
     * @notice Emitted when the loop registry has been successfully initialized.
     */
    event LoopRegistryInitialized();

    event LoopSelectorRegistered(bytes4 _sel,address _f);


    /**
     * @notice Initializes the loop registry with the provided configuration parameters and registers loop functions.
     * @dev This function must be called only once due to the initializer modifier.
     * The initialization process involves:
     *  - Setting the loop initializer selector.
     *  - Configuring the minimal loop implementation address.
     *  - Assigning the facet registry address.
     *  - Granting the DEFAULT_ADMIN_ROLE to the specified administrator.
     *  - Installing provided facets via the diamond cut mechanism.
     *  - Registering loop functions from an array of packed function data. Each packed entry is expected to contain:
     *      - A 4-byte function selector.
     *      - An 8-byte metadata segment (containing version and status information).
     *      - A function implementation address.
     * If a function selector is already registered, the function reverts with an FN_ALREADY_USED error.
     * Additionally, if no function data is provided, the function reverts with a MUST_SEND_FNs error.
     *
     * @param _loop_initializer The 4-byte selector of the loop initialization function.
     * @param _loop_implementation The address of the minimal implementation for the loop.
     * @param _admin The address that will be granted the DEFAULT_ADMIN_ROLE.
     * @param _packedLoopFns An array of packed function data entries. Each entry must contain:
     *        - The function selector (first 4 bytes).
     *        - Metadata (next 8 bytes) including version and status.
     *        - The function implementation address (remaining bytes).
     *
     * @return A boolean value indicating whether the initialization was successful.
     *
     * Emits a {LoopRegistryInitialized} event upon successful completion.
     */
    function init_loop_registry(
        bytes4 _loop_initializer,
        address _loop_implementation,
        address _facet_registry,
        address _admin,
        bytes32[] memory _packedLoopFns
    ) external returns (bool);
}

/**
 * @title Loop_Registry_InitializerV0
 * @notice Implements the initialization of the loop registry for a diamond-based system.
 * @dev Inherits from Initializable, DiamondCutBase, and MinimalAccressControl. Uses the initializer modifier to prevent
 * re-initialization. The initializer sets up critical loop parameters and registers loop functions by processing
 * packed function data entries.
 */
contract Loop_Registry_InitializerV0 is ILoop_Registry_InitializerV0, Initializable,  MinimalAccressControl {
    using {unpackData} for bytes32;

    /// @notice Error emitted when no functions are provided for initialization.
    error MUST_SEND_FNs();

    /// @notice Error emitted when a function selector is already registered.
    error FN_ALREADY_USED();


    uint8 constant DEFAULT_ADMIN_ROLE = 0;
    bytes4 constant INIT_V = bytes4(uint32(1));

    /**
     * @notice Initializes the loop registry with configuration parameters and registers loop functions.
     * @dev This function can be called only once because of the initializer modifier.
     * It performs the following operations:
     *  1. Sets the loop initializer selector.
     *  2. Stores the loop minimal implementation address.
     *  3. Registers the facet registry address.
     *  4. Assigns the DEFAULT_ADMIN_ROLE to the provided administrator address.
     *  5. Installs the provided facets using the diamond cut mechanism.
     *  6. Processes an array of packed loop function data to register each function:
     *      - Unpacks each entry into a function selector, metadata (e.g., version), and function address.
     *      - Checks that the function selector is not already registered.
     *      - Stores the function information, marking it as live and associating it with a version.
     *
     * Reverts with:
     *  - MUST_SEND_FNs if the _packedLoopFns array is empty.
     *  - FN_ALREADY_USED if a function selector is already registered.
     *
     * @param _loop_initializer The 4-byte selector for the loop initializer function.
     * @param _loop_implementation The address of the minimal loop implementation.
     * @param _facet_registry The address of the facet registry contract.
     * @param _admin The address to be granted the DEFAULT_ADMIN_ROLE.
     * @param _packedLoopFns An array of packed data entries for loop functions. Each entry includes:
     *        - A 4-byte function selector.
     *        - An 8-byte metadata segment containing version and status.
     *        - The function implementation address.
     *
     * @return A boolean value indicating successful initialization.
     *
     * Emits a {LoopRegistryInitialized} event upon successful initialization.
     */
    function init_loop_registry(
        bytes4 _loop_initializer,
        address _loop_implementation,
        address _facet_registry,
        address _admin,
        bytes32[] memory _packedLoopFns
    ) external initializer returns (bool) {
        LibLoopRegistrySt.REGISTRY_ST storage st = LibLoopRegistrySt._storage();

        // 1. Set the loop initializer selector.
        st.initialize_selector = _loop_initializer;

        // 2. Set the minimal loop implementation address.
        st.loop_minimalImplementation = _loop_implementation;

        // 3. Set the facet registry address.
        st.facet_registry = _facet_registry;

        // 4. Assign the DEFAULT_ADMIN_ROLE to the provided administrator.
        _setUserRole(_admin, DEFAULT_ADMIN_ROLE, false);


        // 5. Register loop functions using the provided packed data.
        uint256 p_len = _packedLoopFns.length;
        if (p_len == 0) revert MUST_SEND_FNs(); // Revert if no function data is provided.

        for (uint256 i = 0; i < p_len; i++) {
            bytes32 _f = _packedLoopFns[i]; // Extract the packed function data.
            (bytes4 _sel, bytes8 _data, address _fAdd) = _f.unpackData(); // Unpack into selector, metadata, and function address.

            // Verify that the function selector has not been registered previously.
            bytes32 _stored = st.historic_facet_registry[_sel];

            emit LoopSelectorRegistered(_sel,_fAdd);

            if (_stored != 0x00) revert FN_ALREADY_USED(); // Revert if selector is already in use.

            // Build a key combining the selector and metadata.
            // @custom:note This SHOULD be added in next versions, for now, we ONLY use the selector
            //bytes32 _key = bytes32(_sel << 224) | _data;
            // Store the function information: version, live status, and implementation address.
            st.historic_facet_registry[_sel] = packData(
                INIT_V,                     // Loop version.
                PackedDataUtils.LIVE,     // Status set to live.
                _fAdd                     // Function implementation address.
            );
            st.loop_selectors.push(_sel);
        }
        // Emit the initialization event.
        emit LoopRegistryInitialized();

        return true;
    }
}
