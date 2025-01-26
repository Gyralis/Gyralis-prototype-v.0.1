// SPDX-License-Identifier: MIT

pragma solidity >=0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import {LibLoopRegistrySt,Loop,Function} from './loop_registry_st.sol';
import { unpackData,packData} from './utils.sol';
/**
    Funciones a hacer :
    1. Crear loop
    2. Hacer un update de las funciones para algunas loops (solo las autoUpdate)
    3. Hacer update de las facets (y que quede en el registro) [esto sube el latest_version]
    4. Poder treaerte las versiones historicas
*/
abstract contract LoopRegistryFacet {

    /// @dev Emitted when a new loop is created.
    event LoopCreated(
        address indexed loopAddress,
        string orgName,
        bytes31 sybil,
        uint88 distStrategy,
        address distToken,
        bool autoUpdate
    );
    ///@dev If == address(0) || address.code.length == 0
    error INVALID_DIST_TOKEN();
    error ORG_NAME_REQUIRED();
    error NO_LOOP_SELECTORS();
    error INVALID_FACET_FOR_SELECTOR(bytes4 selector);
    error LOOP_INITIALIZATION_FAILED();



    /// @dev Initialize the contract with the loop implementation.
    constructor(address _loopImplementation,bytes4 _initSelector) {
        require(_loopImplementation != address(0), "Invalid implementation address");
        LibLoopRegistrySt._storage().loop_minimalImplementation= _loopImplementation;
        LibLoopRegistrySt._storage().initialize_selector= _initSelector;
    }

    /// @notice Creates a new loop and initializes its state.
    /// @param orgName Name of the organization.
    /// @param sybil Sybil type (bytes31).
    /// @param distStrategy Distribution strategy ID (uint88).
    /// @param distToken Address of the distribution token.
    /// @param autoUpdate Indicates if the loop supports auto-update.
    /// @return loopAddress Address of the newly created loop.
    function createLoop(
      string memory orgName,
      bytes31 sybil,
      uint88 distStrategy,
      address distToken,
      bool autoUpdate
    ) external virtual returns (address loopAddress) {
        if (bytes(orgName).length == 0) revert ORG_NAME_REQUIRED();
        if (distToken == address(0) || distToken.code.length == 0) revert INVALID_DIST_TOKEN();
    
        // Initialize the loop storage
        LibLoopRegistrySt.REGISTRY_ST storage st = LibLoopRegistrySt._storage();
    
        // Ensure there are selectors available
        if (st.loop_selectors.length == 0) revert NO_LOOP_SELECTORS();
    
        // Clone the loop implementation
        loopAddress = Clones.clone(st.loop_minimalImplementation);
    
        // Create and initialize the new loop
        Loop memory newLoop = Loop({
            autoUpdate: autoUpdate,
            sybil: sybil,
            version: 1,
            distStrategy: distStrategy,
            distToken: distToken,
            orgName: orgName
        });
        uint _l = st.loop_selectors.length;
        // Prepare selectors and facets
        Function[] memory loopFunctions = new Function[](_l);
        if(_l == 0) revert LOOP_INITIALIZATION_FAILED();
    
        for (uint256 i = 0; i <_l; i++) {
            bytes4 selector = st.loop_selectors[i];
            bytes32 packedFacet = st.historic_facet_registry[selector];
            (, , address facetAddress) = unpackData(packedFacet);
    
            if (facetAddress == address(0)) revert INVALID_FACET_FOR_SELECTOR(selector);
    
            loopFunctions[i] = Function({
                selector: selector,
                facet: facetAddress
            });
    
            // Map the loop to its facets
            st.loop_facets_info[loopAddress][selector] = packedFacet;
        }
    
        // Initialize the loop with facets
        (bool success, ) = loopAddress.call(
            abi.encodeWithSelector(st.initialize_selector,newLoop ,loopFunctions)
        );
        if (!success) revert LOOP_INITIALIZATION_FAILED();
    
        // Save the loop to storage
        st.loop_info[loopAddress] = newLoop;
    
        emit LoopCreated(loopAddress, orgName, sybil, distStrategy, distToken, autoUpdate);
    }

}
