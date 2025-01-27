// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
  Here will be implementing :
  1. Claim
  2. Register
  And the logic behind being registered automatically once you claim
*/
/*
 * @title Epoch Struct
 * @dev Represents a single epoch in a looped distribution system.
 *
 * Each epoch encapsulates information about the distribution state, including timing,
 * number of users, and the amount to distribute. The `merkle_root` is used to verify
 * user-specific data for the epoch.
 *
 * ### Fields:
 * - `finished`: Indicates whether the epoch has ended (`true`) or is still active (`false`).
 * - `start_timestamp`: UNIX timestamp marking the start of the epoch.
 *   Example: `1700000000` (corresponding to 14 November 2023, 23:33:20 UTC).
 * - `finish_timestamp`: UNIX timestamp marking the end of the epoch.
 *   Example: `1700864000` (corresponding to 25 November 2023, 00:00:00 UTC).
 * - `amount_of_users`: The total number of unique users participating in this epoch.
 *   Example: `10,000` users.
 *   Maximum value: `16,777,215` users.
 * - `amount_to_distribute`: The total amount of tokens (without considering decimals) to distribute in this epoch.
 *   **Important:** This field does not include token decimals. To calculate the exact amount, 
 *   a call to the token contract (stored in another library) is required to determine the 
 *   correct decimal-adjusted value.
 *   Example:
 *      - `amount_to_distribute = 1_000_000` tokens.
 *      - Token decimals = `18`.
 *      - Exact amount = `1_000_000 * 10^18 = 1_000_000_000_000_000_000_000_000`.
 * - `merkle_root`: A `bytes32` value representing the Merkle root for this epoch.
 *   Used for efficient verification of user claims.
 *   Example: `0xabc123...` (hashed tree root of user distributions).
 *
 * ### Example Usage:
 *
 * Epoch exampleEpoch = Epoch({
 *   finished: false,
 *   start_timestamp: 1700000000,
 *   finish_timestamp: 1700864000,
 *   amount_of_users: 10000,
 *   amount_to_distribute: 1000000, // Without decimals
 *   merkle_root: 0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1
 * });
 *
 * ### Token Decimal Adjustment:
 * When distributing tokens, you **must** calculate the precise amount by adjusting for the token's decimals:
 *
 * ```solidity
 * uint8 decimals = IERC20(tokenAddress).decimals();
 * uint exactAmount = amount_to_distribute * (10 ** decimals);
 * ```
 *
 * ### Suggested Mapping:
 * - Consider maintaining a mapping to store all epochs by ID:
 *
 * ```solidity
 * mapping(uint256 => Epoch) public epochs;
 * ```
 * This allows efficient lookup of epochs using their unique ID.
 *
 * ### Additional Notes:
 * - Ensure proper validation of user claims against the Merkle root for integrity.
 * - Validate timestamps to ensure the start is earlier than the finish.
 * - The token address should be stored in a separate library or contract for modularity an
 **/

struct Epoch {
    bool finished;               // [1/32] Indicates whether the epoch has concluded
    uint64 start_timestamp;      // [9/32] Start time of the epoch (in UNIX timestamp)
    uint64 finish_timestamp;     // [17/32] End time of the epoch (in UNIX timestamp)
    uint24 amount_of_users;      // [20/32] Total number of users in this epoch (MAX 16,777,215)
    uint96 amount_to_distribute; // [32/32] Net amount of tokens to distribute during this epoch (without decimals)
    bytes32 merkle_root;         // [32/32] Merkle root for the distribution, used to verify claims
}

import {BitMaps} from '@oz/utils/structs/BitMaps.sol';

library LibEpochSt {
    /// @title EPOCH_ST
    /// @dev Storage structure to manage epoch data and associated metadata.
    /// This structure is optimized for efficient storage and verification using BitMaps and Merkle proofs.
    struct EPOCH_ST {
        /// @notice The ID of the current epoch.
        /// @dev Limited to 256 (`uint8`) because BitMaps can only handle up to 256 values.
        /// Each epoch ID must be unique within this range. The limitation aligns with the design choice
        /// to minimize storage while maintaining a direct relationship between epochs and the BitMap.
        uint8 current_epoch_id;

        /// @notice Mapping from an epoch ID to its associated `Epoch` data.
        /// @dev `_epochId` serves as the key, which must fall within the range of 0 to 255 (due to `uint8` current_epoch_id).
        /// The `Epoch` struct contains all relevant information for a specific epoch, such as its Merkle root,
        /// start and finish timestamps, and distribution amounts.
        mapping(uint _epochId => Epoch) id_to_epoch_info;

        /// @notice A BitMap used for efficiently tracking user participation or state within an epoch.
        /// @dev The key of the BitMap (`uint`) is designed to use **only the first 20 bytes** to represent an Ethereum address.
        /// The remaining 12 bytes in the `uint` key are unused, allowing for future extensions if necessary.
        ///
        /// The BitMap's value (`uint`) represents a compressed set of 256 bits, where each bit corresponds to a specific state or
        /// flag for the address within the context of an epoch. This design minimizes the amount of storage required while enabling
        /// fast lookups and updates.
        ///
        /// ### Usage:
        /// - The combination of the BitMap and Merkle proofs allows us to store minimal data on-chain while enforcing correctness.
        /// - By relying on Merkle proofs for verification, we reduce the need to store extensive user-specific data directly in the contract.
        BitMaps.BitMap bit_map;
   }

   /// @custom:storage-location erc7201:epoch_impl.diamond
   /// @dev Storage identifier for the main data structure.
   /// The slot is calculated as:
   /// keccak256(abi.encode(uint256(keccak256("epoch_impl.diamond")) - 1)) & ~bytes32(uint256(0xff))
   /// Reference: EIP-7201 -> "https://eips.ethereum.org/EIPS/eip-7201"
   bytes32 constant EPOCH_STORAGE_SLOT = 0x3ab749254a7fb055d5682eb6d940c65ef1b74d64f7e1d59b61cc853d1cba9100;
   
   /// @notice Provides a reference to the storage layout defined by `EPOCH_STORAGE_SLOT`.
   /// @dev This function accesses the storage slot for the main data structure.
   /// @return st A reference to the `EPOCH_ST` storage layout.
   function _storage() internal pure returns (EPOCH_ST storage st) {
       assembly {
           st.slot := EPOCH_STORAGE_SLOT
       }
   }

}
