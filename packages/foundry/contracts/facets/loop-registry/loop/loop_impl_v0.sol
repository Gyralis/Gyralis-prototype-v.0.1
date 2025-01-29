// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


/**
   Todos:
   1. Register 
    - epoch (users)
    - cambiar de epoch ? eso se hace de forma manual
   2. Claim
    - users can claim (need to upload merkle proof + amount to claim)


    
*/

import { MerkleProof } from '@oz/utils/cryptography/MerkleProof.sol';
import { Loop, Function, LibLoopSt } from './loop_st.sol';
import { Epoch, BitMaps, LibEpochSt } from './epoch_st.sol';
import { ReentrancyGuardTransient } from '@oz/utils/ReentrancyGuardTransient.sol';
import {IERC20} from '@oz/token/ERC20/IERC20.sol';
/**
 * @title Loop Implementation V0
 * @dev Implements the core logic for managing epochs and claims in a loop-based distribution system.
 */
contract Loop_Implementation_V0 is ReentrancyGuardTransient {
    /// @notice Thrown when the provided leaf does not match the expected format or data.
    /// @dev This error is triggered if the `leaf` passed to the `claim_current_epoch` function 
    /// does not correspond to the packed data of epoch ID, amount, and address.
    error INVALID_LEAF();
    
    /// @notice Thrown when the Merkle proof verification fails.
    /// @dev This error indicates that the provided proof does not match the expected Merkle root
    /// for the current epoch, meaning the claim cannot be verified.
    error INVALID_PROOF();
    
    /// @notice Thrown when a user attempts to claim tokens but has already claimed.
    /// @dev This error ensures that a user cannot claim tokens multiple times for the same epoch.
    /// The check is performed using a `BitMap` to track claimed addresses.
    error ALREADY_CLAIMED();
    
    /// @notice Thrown when an invalid epoch ID is provided.
    /// @dev This error occurs when an epoch ID is not sequential or does not match
    /// the expected `current_epoch_id` in the storage.
    error INVALID_EPOCH_ID();
    
    /// @notice Thrown when the maximum allowed epoch ID has been reached.
    /// @dev Since the `current_epoch_id` is stored as a `uint8`, the maximum value is 255.
    /// This error prevents attempts to exceed the allowable range of epochs.
    error MAX_EPOCH_ID_REACHED();
    
    /// @notice Thrown when a token transfer fails.
    /// @dev This error indicates that the ERC-20 `transfer` function returned `false`, 
    /// meaning the token transfer was unsuccessful. The contract relies on this check 
    /// to ensure the user receives their tokens.
    error TOKEN_TRANSFER_FAILED();

    /// @notice Error thrown when the sender is not authorized.
    error UNAUTHED_SENDER();

    /// @dev Error thrown when the claim process fails.
    error CLAIM_FAILED();

    /// @dev Event emitted when tokens are successfully claimed.
    event TokensClaimed(uint8 epochId, address indexed claimant, uint80 amount);

    /// @dev Event emitted when a new epoch is registered.
    event EpochRegistered(uint8 epochId, uint64 startTimestamp, uint64 finishTimestamp, bytes32 merkleRoot);
    
    /// @dev Event emitted when a certain epoch is closed.
    event EpochFinalized(uint8 epochId, uint64 startTimestamp, uint64 finishTimestamp, bytes32 merkleRoot);

    // -------------------------------------------- //
    //              MODIFIERS 
    // -------------------------------------------- //

    /// @notice Restricts access to functions that can only be called by the registry contract.
    modifier onlyRegistry() virtual {
        if (LibLoopSt._storage().loop_registry != msg.sender) revert UNAUTHED_SENDER();
        _;
    }

    // -------------------------------------------- //
    //               AUTHORIZED FUNCTIONS
    // -------------------------------------------- //
    event DebugUint8(string _smg, uint8 _m);
    /**
     * @notice Registers a new epoch.
     * @dev Only callable by the registry. Emits an event when successful.
     * @param _c The new epoch data to be registered.
     * @param nextEpochId (this SHOULD be equal to -> st.current_epoch_id + 1)
     * @return success True if the operation succeeds.
     */
    function register_next_epoch(
        Epoch calldata _c,
        uint8 nextEpochId
    ) external onlyRegistry nonReentrant returns (bool success) {
        LibEpochSt.EPOCH_ST storage st = LibEpochSt._storage();

        uint8 current_epoch = st.current_epoch_id; 

        emit DebugUint8('CurrentEpoch',current_epoch);
        if(current_epoch == 255 ) revert MAX_EPOCH_ID_REACHED();
        // Ensure the epoch ID is valid and sequential
        uint8 expectedNextEpochId = current_epoch + 1;
        
        if (nextEpochId != expectedNextEpochId) revert INVALID_EPOCH_ID();
        st.id_to_epoch_info[current_epoch].finished=true;
        Epoch memory _prev = st.id_to_epoch_info[current_epoch];
        emit EpochFinalized(current_epoch,_prev.start_timestamp,_prev.finish_timestamp,_prev.merkle_root);

        // Store the new epoch
        st.id_to_epoch_info[nextEpochId] = _c;

        // Increment the current epoch ID
        st.current_epoch_id = nextEpochId;

        // Emit an event for the new epoch registration
        emit EpochRegistered(nextEpochId, _c.start_timestamp, _c.finish_timestamp, _c.merkle_root);

        return true;
    }


    // -------------------------------------------- //
    //               EXTERNAL FUNCTIONS
    // -------------------------------------------- //

    function getEpochInfo(uint8 _id) external view returns(Epoch memory){
      return LibEpochSt._storage().id_to_epoch_info[_id];
    }

    /**
     * @notice Claims tokens for the current epoch based on Merkle proofs.
     * @param proof The Merkle proof for the claim.
     * @param leaf The leaf node (packed data of epoch_id, amount, and address).
     * @param amount_to_claim The amount to claim, verified using the proof.
     * @return success True if the claim is successful.
     */
    function claim_current_epoch(
        bytes32[] memory proof,
        bytes32 leaf,
        uint80 amount_to_claim
    ) external nonReentrant returns (bool success) {
        LibEpochSt.EPOCH_ST storage st = LibEpochSt._storage();
        uint8 currentEpochId = st.current_epoch_id;

        // Verify the Merkle proof
        Epoch memory epoch = st.id_to_epoch_info[currentEpochId];
        require(MerkleProof.verify(proof, epoch.merkle_root, leaf), "INVALID_PROOF");

        // Verify the leaf data matches msg.sender and amount_to_claim
        bytes32 computedLeaf = keccak256(abi.encodePacked(currentEpochId, amount_to_claim, msg.sender));
        require(computedLeaf == leaf, "INVALID_LEAF");

        // Check if the sender has already claimed using the BitMap
        uint256 userKey = uint256(uint160(msg.sender)); // First 20 bytes are the address
        require(!BitMaps.get(st.bit_map, userKey), "ALREADY_CLAIMED");

        // Mark as claimed in the BitMap
        BitMaps.set(st.bit_map, userKey);

        // Transfer the tokens to the sender
        // Assuming the token address is stored in LibLoopSt
        address token = LibLoopSt._storage().basic_loop_info.distToken;
        require(IERC20(token).transfer(msg.sender, amount_to_claim), "TOKEN_TRANSFER_FAILED");

        // Emit an event for the successful claim
        emit TokensClaimed(currentEpochId, msg.sender, amount_to_claim);

        return true;
    }
}

