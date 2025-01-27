// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";

import { 
    unpackData,
    packData,
    PackedDataUtils,
    Loop_Initializer_V0,
    WLoop_Initializer_V0
} from './initializer.t.sol';
import {
    Loop_Implementation_V0,
    Loop,Function,
    LibLoopSt,
    LibEpochSt
 } from 'contracts/facets/loop-registry/loop/loop_impl_v0.sol';

contract WLoop_Implemplementation_V0 is WLoop_Initializer_V0,Loop_Implementation_V0 {}

contract DummyContract {}
contract LoopImplV0_BaseTest is Test {
    using {unpackData} for bytes32;

    WLoop_Implemplementation_V0 impl_v0;

    address sender = makeAddr('SENDER');
    address loopRegistry ;
    address system;
    address dist;
    // NOTE :
    // sybil : keccak256('BYTES_32->BYTES_31') << 8 [1 byte]
    // Dummy Loop data
    Loop loopData = Loop({
        autoUpdate: true,
        sybil:bytes31(keccak256('BYTES_32->BYTES_31')),
        version: 1,
        distStrategy:uint88(uint(keccak256('REWARDS'))),
        distToken: address(0xABC),
        orgName: "Test Organization"
    });

    bytes32[] packedFns;
    bytes32 constant SEED =keccak256(abi.encodePacked('SEED FOR TESTING'));

    function _randBytesHelper(uint8 _am) internal view returns(bytes32[] memory){
        bytes32[] memory _h = new bytes32[](_am);
        for(uint i =0;i<_am;i++){
           _h[i] = keccak256(abi.encodePacked(SEED,i)); 
        }
        return _h;
    }

    function setUp() public {
        impl_v0 = new WLoop_Implemplementation_V0();

        loopRegistry= address(new DummyContract()); 
        system = address(new DummyContract()); 
        dist = address(new DummyContract()); 
        loopData.distToken = dist;
        bytes32[] memory _s = _randBytesHelper(4);
        for(uint i = 0; i<4;i++){
         packedFns.push(_s[i]);
        }

        vm.expectEmit(address(impl_v0));
        emit Loop_Initializer_V0.LoopInitialized();
        impl_v0.initialize_loop(packedFns, loopData, sender, loopRegistry, system);

    }
 }

contract Loop_ImplV0_EpochFns_Test is LoopImplV0_BaseTest {



}
