// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Test, console2 } from "forge-std/Test.sol";
import "@oz/utils/cryptography/MerkleProof.sol";
import "@oz/utils/Strings.sol";
import {MerkleTree} from 'test/mocks/merkle_helper.sol'; 

contract MerkleTree_helperLibTest is Test{
/// @notice Generates leaf nodes for testing purposes.
    /// @param _amLeafs Number of leaf nodes to generate.
    /// @return bytes32[] Array of leaf hashes.
    function _genLeafs(uint8 _amLeafs) internal view returns (bytes32[] memory) {
        bytes32[] memory _r = new bytes32[](_amLeafs);
        for (uint i = 0; i < _amLeafs; i++) {
            _r[i] = keccak256(abi.encodePacked("USER#", i));
        }
        return _r;
    }

    /// @notice Tests the computation of the Merkle root.
    /// Ensures that the root is not zero when valid leaves are provided.
    function testComputeMerkleRoot(uint8 _leafsAm) public {
        _leafsAm = uint8(bound(_leafsAm, 2, 222));
        bytes32[] memory leaves = _genLeafs(_leafsAm);
        bytes32 root = MerkleTree.computeMerkleRoot(leaves);
        assertNotEq(root, bytes32(0), "Merkle root should not be zero");
    }

    /// @notice Tests the generation and verification of a Merkle proof.
    /// Ensures that the proof correctly validates a leaf node within the tree.
    function testGenerateMerkleProof(uint8 _leafsAm) public {
        _leafsAm = uint8(bound(_leafsAm, 2, 222));
        bytes32[] memory leaves = _genLeafs(_leafsAm);

        bytes32 root = MerkleTree.computeMerkleRoot(leaves);
        bytes32[] memory proof = MerkleTree.generateMerkleProof(leaves, 1); // Proof for "User2"

        // Process proof using the updated MerkleTree library
        bytes32 computedHash = MerkleTree.processProof(proof, leaves[1]);
        bool valid = (computedHash == root);

        assertEq(valid, true, "Merkle proof should be valid");
    }

    /// @notice Tests if an empty tree returns zero as the root.
    function testEmptyMerkleTree() public {
        bytes32[] memory emptyLeaves = new bytes32[](0);
        vm.expectRevert("No leaves provided");
        bytes32 root = MerkleTree.computeMerkleRoot(emptyLeaves);
        assertEq(root, bytes32(0), "Merkle root of an empty tree should be zero");
    }

    /// @notice Tests if a single leaf correctly produces itself as the Merkle root.
    function testSingleLeafMerkleTree() public {
        bytes32[] memory singleLeaf = new bytes32[](1);
        singleLeaf[0] = keccak256(abi.encodePacked("SINGLE_LEAF"));
        bytes32 root = MerkleTree.computeMerkleRoot(singleLeaf);
        assertEq(root, singleLeaf[0], "Merkle root of a single leaf tree should be the leaf itself");
    }

    /// @notice Tests proof verification failure when using an invalid proof.
    function testInvalidMerkleProof() public {
        bytes32[] memory leaves = _genLeafs(5);
        bytes32 root = MerkleTree.computeMerkleRoot(leaves);
        bytes32[] memory invalidProof = new bytes32[](1);
        invalidProof[0] = keccak256(abi.encodePacked("INVALID_PROOF"));

        bytes32 computedHash = MerkleTree.processProof(invalidProof, leaves[1]);
        bool valid = (computedHash == root);

        assertEq(valid, false, "Merkle proof should be invalid");
    }
}


