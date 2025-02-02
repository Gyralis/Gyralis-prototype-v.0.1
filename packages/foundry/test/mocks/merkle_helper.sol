// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Merkle Tree Generator Library
/// @notice This library provides functions to build a Merkle Tree and generate Merkle Proofs on-chain.
/// @dev Typically, Merkle proofs are generated off-chain due to gas costs, but this can be used for testing or specialized use cases.
library MerkleTree {
    
    /// @notice Computes the Merkle root from an array of leaf nodes.
    /// @param leaves The array of hashed leaf nodes.
    /// @return bytes32 The computed Merkle root.
    function computeMerkleRoot(bytes32[] memory leaves) internal pure returns (bytes32) {
        require(leaves.length > 0, "No leaves provided");
        
        while (leaves.length > 1) {
            uint256 newLength = (leaves.length + 1) / 2;
            bytes32[] memory newLevel = new bytes32[](newLength);
            
            for (uint256 i = 0; i < leaves.length; i += 2) {
                bytes32 left = leaves[i];
                bytes32 right = (i + 1 < leaves.length) ? leaves[i + 1] : left;
                
                if (left > right) (left, right) = (right, left); // Ensure sorting
                newLevel[i / 2] = keccak256(abi.encodePacked(left, right));
            }
            leaves = newLevel;
        }
        
        return leaves[0]; // Final root
    }

    /// @notice Generates the Merkle Proof for a given leaf node.
    /// @param leaves The array of hashed leaf nodes.
    /// @param index The index of the target leaf.
    /// @return bytes32[] The Merkle proof (array of hashes needed for verification).
    function generateMerkleProof(bytes32[] memory leaves, uint256 index) internal pure returns (bytes32[] memory) {
        require(index < leaves.length, "Index out of bounds");
        require(leaves.length > 0, "No leaves provided");

        bytes32[] memory proof = new bytes32[](leaves.length - 1);
        uint256 proofIndex = 0;

        while (leaves.length > 1) {
            uint256 newLength = (leaves.length + 1) / 2;
            bytes32[] memory newLevel = new bytes32[](newLength);
            
            for (uint256 i = 0; i < leaves.length; i += 2) {
                bytes32 left = leaves[i];
                bytes32 right = (i + 1 < leaves.length) ? leaves[i + 1] : left;
                
                if (left > right) (left, right) = (right, left); // Ensure sorting
                newLevel[i / 2] = keccak256(abi.encodePacked(left, right));
                
                if (index == i) {
                    proof[proofIndex++] = right;
                } else if (index == i + 1) {
                    proof[proofIndex++] = left;
                }
            }
            
            index /= 2;
            leaves = newLevel;
        }

        bytes32[] memory finalProof = new bytes32[](proofIndex);
        for (uint256 j = 0; j < proofIndex; j++) {
            finalProof[j] = proof[j];
        }
        return finalProof;
    }

    /// @notice Processes a Merkle Proof to reconstruct the hash and compare with the root.
    /// @param proof The Merkle proof.
    /// @param leaf The leaf node to verify.
    /// @return bytes32 The final computed hash from the proof.
    function processProof(bytes32[] memory proof, bytes32 leaf) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            
            if (computedHash > proofElement) {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            } else {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            }
        }
        return computedHash;
    }
}

