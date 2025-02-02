// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import { 
    Loop_Initializer_V0,
    LibLoopSt,
    Loop,
    Function,
    unpackData,
    packData,
    PackedDataUtils,
    Initializable
} from "contracts/facets/loop-registry/loop/loop_initializer.sol";

contract WLoop_Initializer_V0 is Loop_Initializer_V0 {
    function getLoopInfo() external view returns(Loop memory){
      return LibLoopSt._storage().basic_loop_info;
    }
    function getSelectorPackedData(bytes4 _sel) external view returns(bytes32){
      return LibLoopSt._storage().loop_facet_info[_sel];
    }
    function getExtraData() external view returns(address,address,address){
      LibLoopSt.LOOP_ST storage st = LibLoopSt._storage();
      return (st.authed,st.loop_registry,st.system);
    }
    function getSelectors()external view returns(bytes4[]memory){
      return LibLoopSt._storage().selectors;
    }

}

contract DummyContract {}

contract LoopInitializerV0Test is Test {

    using {unpackData} for bytes32;

    WLoop_Initializer_V0 initializer;

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

    function setUp() public {
        initializer = new WLoop_Initializer_V0();
        loopRegistry= address(new DummyContract()); 
        system = address(new DummyContract()); 
        dist = address(new DummyContract()); 
        loopData.distToken = dist;
        // Create packed function data
        for (uint256 i = 0; i < 3; i++) {
            bytes4 selector = bytes4(keccak256(abi.encodePacked("function", i)));
            bytes8 metadata = bytes8(keccak256(abi.encodePacked("metadata", i)));
            address funcAddress = address(uint160(uint256(keccak256(abi.encodePacked("funcAddress", i)))));
            packedFns.push(packData(selector, metadata, funcAddress));
        }
    }

    function testInitializeLoop_RevertWhenNoFunctions() public {
        bytes32[] memory emptyFns = new bytes32[](0);
        vm.expectRevert(abi.encodeWithSelector(Loop_Initializer_V0.MUST_SEND_FNs.selector));
        initializer.initialize_loop(emptyFns, loopData, sender, loopRegistry, system);
    }

    function testInitializeLoop_RevertWhenFunctionAlreadyExists() public {
        bytes32[] memory duplicated_indo= new bytes32[](2);
        duplicated_indo[0] = 0x2359f6e57b575f39a368acc452203654f5409b20c18cfdfa6c12474b40ad22ab;
        duplicated_indo[1] = 0x2359f6e57b575f39a368acc452203654f5409b20c18cfdfa6c12474b40ad22ab;

        vm.expectRevert(abi.encodeWithSelector(Loop_Initializer_V0.FN_ALREADY_USED.selector));
        initializer.initialize_loop(duplicated_indo, loopData, sender, loopRegistry, system);
    }

    function testInitializeLoop_RevertWhenReinitAttempt() public {
        bytes32[] memory duplicated_indo= new bytes32[](2);
        duplicated_indo[0] = 0x2359f6e57b575f39a368acc452203654f5409b20c18cfdfa6c12474b40ad22ab;
        duplicated_indo[1] = 0x549667fc46a91fbb84f4f4a73d71b074c7e5644d48b732f38629a58f715259c3;
        vm.expectEmit(address(initializer));
        emit Loop_Initializer_V0.LoopInitialized();
        initializer.initialize_loop(duplicated_indo, loopData, sender, loopRegistry, system);

        vm.expectRevert(abi.encodeWithSelector(Initializable.InvalidInitialization.selector));
        initializer.initialize_loop(duplicated_indo, loopData, sender, loopRegistry, system);
    }

    bytes32 constant SEED =keccak256(abi.encodePacked('SEED FOR TESTING'));

    function _randBytesHelper(uint8 _am) internal view returns(bytes32[] memory){
        bytes32[] memory _h = new bytes32[](_am);
        for(uint i =0;i<_am;i++){
           _h[i] = keccak256(abi.encodePacked(SEED,i)); 
        }
        return _h;
    }


    function testInitializeLoop_Success() public {
        initializer = new WLoop_Initializer_V0();
        
        // Add new functions with unique selectors
        bytes32[] memory newFns = _randBytesHelper(2);
        

        vm.expectEmit(address(initializer));
        emit Loop_Initializer_V0.LoopInitialized();
        initializer.initialize_loop(newFns, loopData, sender, loopRegistry, system);

        // Verify new selectors were stored
        bytes4[] memory _stSelectors = initializer.getSelectors(); 
        for (uint256 i = 0; i < newFns.length; i++) {
            bytes32 packedFn = newFns[i];
            (bytes4 selector,bytes8 _data ,address _ad ) = packedFn.unpackData();
            bytes32 storedFn = initializer.getSelectorPackedData(_stSelectors[i]);
            assertEq(_stSelectors[i], selector, 'Selector comparison failed');
            assertEq(storedFn, packData(bytes4(uint32(loopData.version)),PackedDataUtils.LIVE,_ad), 'Smth went wrong with the unpackeing');
        }
    }


}

