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
    Loop,Function,Epoch,
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

    bytes32 constant SEED =keccak256(abi.encodePacked('SEED FOR TESTING'));
    bytes32[] packedFns;
    mapping(uint8 => Epoch) id_epoch;

    function _randBytesHelper(uint8 _am) internal view returns(bytes32[] memory){
        bytes32[] memory _h = new bytes32[](_am);
        for(uint i =0;i<_am;i++){
           _h[i] = keccak256(abi.encodePacked(SEED,i)); 
        }
        return _h;
    }

    function _resetSetup() internal {
        impl_v0 = new WLoop_Implemplementation_V0();

        loopRegistry= address(new DummyContract()); 
        system = address(new DummyContract()); 
        dist = address(new DummyContract()); 
        loopData.distToken = dist;
        bytes32[] memory _s = _randBytesHelper(4);
        if(packedFns.length==0){
          for(uint i = 0; i<4;i++){
           packedFns.push(_s[i]);
          }
        } 

        vm.expectEmit(address(impl_v0));
        emit Loop_Initializer_V0.LoopInitialized();
        impl_v0.initialize_loop(packedFns, loopData, sender, loopRegistry, system);
    }
    function setUp() public {
      _resetSetup();
    }
    function _genEpoch(uint8 _id, uint32 _deltaTime) internal returns(Epoch memory) {
     bytes32 _mRoot = keccak256(abi.encodePacked(_id,_deltaTime,SEED));
     Epoch memory _e = Epoch({
       finished:false,
       start_timestamp: uint64(block.timestamp),
       finish_timestamp:uint64(block.timestamp + _deltaTime),
       amount_of_users: type(uint16).max,
       amount_to_distribute:type(uint88).max,
       merkle_root:_mRoot
     }); 
     id_epoch[_id]=_e;
     return _e;
    }
    modifier reset() virtual {
      _resetSetup();
      _;
    }
    modifier loopRegistryPrank() virtual {
      vm.startPrank(loopRegistry);
      _;
      vm.stopPrank();
    }
    event EpochFinalized(uint8 epochId, uint64 startTimestamp, uint64 finishTimestamp, bytes32 merkleRoot);
    event EpochRegistered(uint8 epochId, uint64 startTimestamp, uint64 finishTimestamp, bytes32 merkleRoot);
 }

contract Loop_ImplV0_EpochFns_Test is LoopImplV0_BaseTest {
    
    function testRevertWhenUnauthSender() public{
        Epoch memory epoch = _genEpoch(2, 1 days);
        vm.expectRevert(Loop_Implementation_V0.UNAUTHED_SENDER.selector);
        impl_v0.register_next_epoch(epoch, 2);
    }

    function testRevertWhenEpochIdIsInvalid() public reset loopRegistryPrank  {
        Epoch memory epoch = _genEpoch(2, 1 days);
        vm.expectRevert(Loop_Implementation_V0.INVALID_EPOCH_ID.selector);
        impl_v0.register_next_epoch(epoch, 2);
    }

    function testRegisterNextEpochSuccessfully() public reset loopRegistryPrank {
        Epoch memory epoch1 = _genEpoch(1, 1 days);
        vm.expectEmit(true, true, true, true);
        emit Loop_Implementation_V0.EpochFinalized(0,0,0,0x00);
        vm.expectEmit(true, true, true, true);
        emit Loop_Implementation_V0.EpochRegistered(1, epoch1.start_timestamp, epoch1.finish_timestamp, epoch1.merkle_root);
        impl_v0.register_next_epoch(epoch1, 1);
        
        assertEq(
          keccak256(abi.encode(epoch1)),
          keccak256(abi.encode(impl_v0.getEpochInfo(1))),
          'SMTH went wrong(1)'
        );
    }

    function testFinalizeCurrentEpochAndRegisterNext() public reset loopRegistryPrank {
        Epoch memory epoch1 = _genEpoch(1, 1 days);
        Epoch memory epoch2 = _genEpoch(2, 2 days);

        impl_v0.register_next_epoch(epoch1, 1);
        
        vm.expectEmit(true, true, true, true);
        emit EpochFinalized(1, epoch1.start_timestamp, epoch1.finish_timestamp, epoch1.merkle_root);
        
        vm.expectEmit(true, true, true, true);
        emit EpochRegistered(2, epoch2.start_timestamp, epoch2.finish_timestamp, epoch2.merkle_root);
        
        impl_v0.register_next_epoch(epoch2, 2);
        epoch1.finished = true;
        assertEq(
          keccak256(abi.encode(epoch1)),
          keccak256(abi.encode(impl_v0.getEpochInfo(1))),
          'SMTH went wrong(1)'
        );
        assertEq(
          keccak256(abi.encode(epoch2)),
          keccak256(abi.encode(impl_v0.getEpochInfo(2))),
          'SMTH went wrong(3)'
        );
    }

    function testRevertWhenMaxEpochIdReached() public reset loopRegistryPrank {
        for (uint8 i = 1; i<255 ; i++) {
            Epoch memory epoch = _genEpoch(i, 1 days);
            impl_v0.register_next_epoch(epoch, i);
            assertTrue(impl_v0.getEpochInfo(i-1).finished);
        }

        Epoch memory epochOverflow = _genEpoch(255, 1 days);
        impl_v0.register_next_epoch(epochOverflow, 255);
        vm.expectRevert(Loop_Implementation_V0.MAX_EPOCH_ID_REACHED.selector);
        impl_v0.register_next_epoch(epochOverflow, 255);
    }
}
