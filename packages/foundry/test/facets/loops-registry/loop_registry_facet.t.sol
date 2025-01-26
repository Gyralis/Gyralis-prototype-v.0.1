// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.20;

import { Test, console2 } from "forge-std/Test.sol";
import { IDiamond } from "contracts/IDiamond.sol";
import { 
  Loop,
  LoopRegistryFacet,
  LibLoopRegistrySt,
  Function,
  packData,
  unpackData
} from "contracts/facets/loop-registry/loop_registry.sol";
import { ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WERC20 is ERC20 {
  constructor(
    string memory name_,
    string memory symbol_
   )ERC20(name_,symbol_){}
}

// Dummy implementation for testing
contract DummyLoopImplementation {

  event LoopInitialized(string indexed _orgName);
  
  error BAD_PARAMS_INITIALIZATION_FAILED();

  function init_loop(
    Loop calldata _loopData,
    Function[] calldata _facets
  )external virtual {
    bytes32 _hashedData = keccak256(abi.encode(_loopData));
    if(_hashedData == 0x00 || _facets.length == 0x00) revert BAD_PARAMS_INITIALIZATION_FAILED();
    emit LoopInitialized(_loopData.orgName);
   }
}


contract WLoopRegistryFacet is LoopRegistryFacet {
    constructor(address _impl, bytes4 _initializeSelector) LoopRegistryFacet(_impl, _initializeSelector) {}

    /**
     * @notice Adds a mock selector and facet to the registry.
     * @param selector The function selector to add.
     * @param version The version number for the facet.
     * @param facetAddress The address of the facet associated with the selector.
     * @dev Updates the `loop_selectors` array and the `historic_facet_registry`.
     */
    function addSelectorAndFacet(
        bytes4 selector,
        bytes8 version,
        address facetAddress
    ) external {
        require(facetAddress != address(0), "Facet address cannot be zero");

        LibLoopRegistrySt.REGISTRY_ST storage st = LibLoopRegistrySt._storage();

        // Pack the facet data
        bytes32 packedData = packData(selector, version, facetAddress);

        // Add selector to the list of loop selectors
        st.loop_selectors.push(selector);

        // Update the registry with the packed data
        st.historic_facet_registry[selector] = packedData;

        emit SelectorAndFacetAdded(selector, uint32(bytes4(version)), facetAddress);
    }

    /// @notice Emitted when a new selector and facet are added to the registry.
    event SelectorAndFacetAdded(bytes4 indexed selector, uint32 version, address indexed facetAddress);

    function getLoopData(address _loop)external view returns(Loop memory){
      return LibLoopRegistrySt._storage().loop_info[_loop];
    }
    /// NOTA : tengo que agregar la jugada de las versiones aca
    function getSelectorVData(bytes4 selector, uint32 _version) external view returns(bytes32){
      return LibLoopRegistrySt._storage().historic_facet_registry[selector];
    }
}


contract LoopRegistry_BaseTest is Test {
    WLoopRegistryFacet facet;
    address loopImplementation;
    address _validToken;
    bytes4 _dummyInitSelector = DummyLoopImplementation.init_loop.selector;
    function setUp() public {
        _validToken = address(
          new WERC20('MOCKER TKN','mTKN'));
        // Deploy a dummy implementation for loops
        loopImplementation = address(new DummyLoopImplementation());
        facet = new WLoopRegistryFacet(loopImplementation,_dummyInitSelector);
    }
}

contract LoopRegistryFacet_createLoopTest is LoopRegistry_BaseTest {
    function test_badOrgName()public {
        // Arrange
        string memory _badName;
        bytes31 sybil = 0x00;
        uint88 distStrategy = 12345;
        address distToken = 0x1234567890123456789012345678901234567890;
        bool autoUpdate = true;

        // Act
        vm.expectRevert(LoopRegistryFacet.ORG_NAME_REQUIRED.selector);
        address loopAddress = facet.createLoop(_badName, sybil, distStrategy, distToken, autoUpdate);
    }
    function test_badDistToken_zeroAdd()public{
        // Arrange
        string memory orgName = "ExampleOrg";
        bytes31 sybil = bytes31("SybilType");
        uint88 distStrategy = 12345;
        address distToken = address(0);
        bool autoUpdate = true;

        // Act
        vm.expectRevert(LoopRegistryFacet.INVALID_DIST_TOKEN.selector);
        address loopAddress = facet.createLoop(orgName, sybil, distStrategy, distToken, autoUpdate);
    }
    function test_badDistToken_zeroCode()public{
        // Arrange
        string memory orgName = "ExampleOrg";
        bytes31 sybil = bytes31("SybilType");
        uint88 distStrategy = 12345;
        address distToken = 0x1234567890123456789012345678901234567890;
        bool autoUpdate = true;

        // Act
        vm.expectRevert(LoopRegistryFacet.INVALID_DIST_TOKEN.selector);
        address loopAddress = facet.createLoop(orgName, sybil, distStrategy, distToken, autoUpdate);
    }

    function test_badLoopInitialize_failsOnInitializer()public{

        // Arrange
        string memory orgName = "ExampleOrg";
        bytes31 sybil = bytes31("SybilType");
        uint88 distStrategy = 12345;
        address distToken = 0x1234567890123456789012345678901234567890;
        bool autoUpdate = true;

        // Act
        vm.expectRevert(LoopRegistryFacet.INVALID_DIST_TOKEN.selector);
        address loopAddress = facet.createLoop(orgName, sybil, distStrategy, distToken, autoUpdate);

    }
    function testCreateLoop_noLoopSelectors_reverts() public {
      // Arrange
      string memory orgName = "ExampleOrg";
      bytes31 sybil = bytes31("SybilType");
      uint88 distStrategy = 12345;
      address distToken = _validToken; 
      bool autoUpdate = true;
  
      // Act & Assert
      vm.expectRevert(abi.encodeWithSelector(LoopRegistryFacet.NO_LOOP_SELECTORS.selector));
      facet.createLoop(orgName, sybil, distStrategy, distToken, autoUpdate);
    }
    function testCreateLoop_success() public {
      // Arrange
      string memory orgName = "ExampleOrg";
      bytes31 sybil = bytes31("SybilType");
      uint88 distStrategy = 12345;
      bool autoUpdate = true;
      bytes8 bytes_version = bytes8(uint64(0x01) << 56);

      // Add mock selector and facet to the registry
      bytes4 selector = bytes4(keccak256("mockFunction()"));
      address facetAddress = address(0x4567890123456789012345678901234567890123);
      bytes32 packedData = packData(selector, bytes_version, facetAddress);
      
      facet.addSelectorAndFacet(selector, bytes_version, facetAddress);

      // Act
      //vm.expectEmit(address(facet));
      // NOTA : para verificar esto hay que computar primero el address (proxmimamente)
      // emit LoopRegistryFacet(loopAddress,orgName,sybil,distStrategy,_validToken,autoUpdate)
      address loopAddress = facet.createLoop(orgName, sybil, distStrategy, _validToken, autoUpdate);

      // Assert
      assertTrue(loopAddress != address(0), "Loop address should not be zero");
      Loop memory loop = facet.getLoopData(loopAddress);

      assertEq(loop.orgName, orgName, "Organization name mismatch");
      assertEq(loop.sybil, sybil, "Sybil type mismatch");
      assertEq(loop.distStrategy, distStrategy, "Distribution strategy mismatch");
      assertEq(loop.distToken, _validToken, "Distribution token mismatch");
      assertEq(loop.autoUpdate, autoUpdate, "Auto-update mismatch");

      bytes32 storedFacet = facet.getSelectorVData(selector,1);
      assertEq(storedFacet, packedData, "Facet data mismatch for selector");
    }
    


}
