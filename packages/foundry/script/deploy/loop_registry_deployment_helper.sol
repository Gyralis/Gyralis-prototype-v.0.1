// SPDX-License-Identifier: MIT License
pragma solidity >=0.8.20;

import {console2} from "forge-std/console2.sol";
import { FacetHelper } from "test/facets/Facet.t.sol";
import { DiamondCutFacetHelper,DiamondCutFacet as DiamondCut} from "test/facets/cut/cut.t.sol";
import { DiamondLoupeFacetHelper ,DiamondLoupeFacet as DiamondLoupe} from "test/facets/loupe/loupe.t.sol";

import { Diamond , IDiamond } from "contracts/Diamond.sol";

import { Loop_Registry_InitializerV0,LoopRegistryFacet } from 'contracts/facets/loop-registry/index.sol';
import {AccessControlFacetHelper} from "test/facets/access-control/access-control.t.sol";
import {Loop_Implementation_V0, Loop_Initializer_V0,ILoop_Initializer_V0} from 'contracts/facets/loop-registry/loop/index.sol';

contract WLoopRegistryFacet is LoopRegistryFacet {}

/**
 * @title LoopRegistryDeploy_Base
 * @notice Base abstract contract for deploying the LoopRegistry diamond.
 * @dev This contract defines the essential external and internal variables required for the deployment
 * of a LoopRegistry diamond, and provides a `deploy` function that orchestrates the deployment process.
 *
 * @custom:external-vars
 * - `loop_registry_diamond_add`: The address of the deployed LoopRegistry diamond contract.
 *
 * @custom:internal-vars
 * - `loop_initializer_selector`: The function selector used for initializing the LoopRegistry.
 * - `loop_implementation`: The address of the Loop implementation contract.
 * - `loop_registry_implementation`: The address of the LoopRegistry implementation contract.
 * - `facet_registry`: The address of the facet registry contract used in the LoopRegistry.
 * - `admin`: The address of the administrator assigned to the LoopRegistry.
 * - `loopAddresses`: An array of addresses related to the Loop functions or implementations.
 * - `packedLoopFunctions`: An array of packed function data (bytes32) representing the loop functions.
 * - `loop_registry_initializer`: The instance of the LoopRegistry initializer contract.
 * - `facetHelpers`: An array of facet helper configurations used during the diamond deployment.
 */
abstract contract LoopRegistryDeploy_Base  {

    //@custom:external-vars
    address public loop_registry_diamond_add;
    //@custom:internal-vars
    bytes4 loop_initializer_selector;
    address loop_implementation;
    address loop_registry_implementation;

    address facet_registry;
    address admin;

    address [] loopAddresses;
    bytes32[] packedLoopFunctions;

    Loop_Registry_InitializerV0 loop_registry_initializer;
    IDiamond.FacetCut[] internal facetHelpers;
    /**
     * @notice Deploys the LoopRegistry diamond with the required facets and initialization parameters.
     * @dev The deployment process includes:
     * 1. Configuring facet helpers for diamond facets (e.g., DiamondCut, DiamondLoupe, AccessControl, and LoopRegistry facets).
     * 2. Setting up Loop-related variables (e.g., loop implementation address and initializer selector).
     * 3. Encoding the initializer data via `_encodeLoopRegistryInitializer()`.
     * 4. Deploying a new instance of the Diamond contract with the provided initialization parameters.
     *
     * @return _r The deployed Diamond contract representing the LoopRegistry.
     */
    function deploy() public virtual returns(Diamond){
        Diamond.InitParams memory _initParams;
       {
         facetHelpers.push(new DiamondCutFacetHelper().diamondFacet());
         facetHelpers.push(new DiamondLoupeFacetHelper().diamondFacet());
         facetHelpers.push(new AccessControlFacetHelper().diamondFacet());
         facetHelpers.push(_buildLoopRegistryFacets());
        }
        {
          // Loop related stuff
          loop_implementation = address(new Loop_Implementation_V0());
          loop_initializer_selector= ILoop_Initializer_V0.initialize_loop.selector;
        }
        {
          console2.log('Deployando diamante (LoopRegistry)...',true);
          (address _init,bytes memory _initData) = _encodeLoopRegistryInitializer();
          _initParams = Diamond.InitParams(
            facetHelpers,
            _init,
            _initData
          );
        }
        Diamond _r = new Diamond(_initParams);
        loop_registry_diamond_add = address(_r);
        return _r;
    }

    function getHelpers()external view virtual returns(IDiamond.FacetCut[] memory){
      return facetHelpers;
    }
   /**
    * @notice Builds the packed function data for LoopRegistry implementation V0.
    * @dev This internal virtual function constructs an array of packed loop function definitions.
    * It performs the following operations:
    *   - Defines the version identifier as a bytes8 value (in this case, 'V0').
    *   - Constructs a base value (_base) by combining a shifted value (derived from `dat`) and the facet address.
    *   - Registers the loop implementation address by adding it to the loopAddresses array.
    *   - Packs the function selectors for key LoopRegistry functions (such as
    *     `register_next_epoch`, `getEpochInfo`, and `claim_current_epoch`) with the version data.
    *   - Each packed function data is constructed by left-shifting the function selector by 224 bits and
    *     then OR-ing it with the base version value.
    *
    * The final result is an array of bytes32 values where each entry represents a loop function along with its
    * versioning and metadata information. The deployment script will utilize these packed function definitions
    * during the LoopRegistry initialization.
    *
    * @return An array of bytes32 values, each containing a packed loop function selector and associated metadata.
    */
    function _buildLoopFns() internal virtual returns (bytes32[] memory) {
        // IMPL_V0
        loop_registry_implementation = address(new WLoopRegistryFacet());
        bytes8 data = bytes8('V0-DEMO');
        // _base is constructed by combining a shifted value (from `dat`) with the facet address.
        // The following is a placeholder example of how _base might be computed:
        uint _base = uint256(uint64(data) << 160 | uint256(uint160(loop_registry_implementation)));

        loopAddresses.push(loop_implementation);
        packedLoopFunctions.push(
            bytes32((uint256(uint32(Loop_Implementation_V0.register_next_epoch.selector)) << 224) | _base)
        );
        packedLoopFunctions.push(
            bytes32((uint256(uint32(Loop_Implementation_V0.getEpochInfo.selector)) << 224) | _base)
        );
        packedLoopFunctions.push(
            bytes32((uint256(uint32(Loop_Implementation_V0.claim_current_epoch.selector)) << 224) | _base)
        );
        emit DebugPackedLoopFns('Adentro del buildLoop',packedLoopFunctions);
        return packedLoopFunctions;
    }
    event DebugPackedLoopFns(string _msg , bytes32[] _packed);
    /**
    * @notice Builds the facet configuration for the LoopRegistry.
    * @dev This internal function constructs and returns an array of facet configurations (IDiamond.FacetCut)
    * that are essential for the LoopRegistry's diamond-based architecture.
    * Currently, the function creates an array with a single facet configuration, but it can be extended to include
    * more facets as needed. The returned facet configurations will be used by the deployment script to install
    * the necessary facets into the LoopRegistry.
    *
    * @return An array of IDiamond.FacetCut structs containing the facet configuration for the LoopRegistry.
    */
    function _buildLoopRegistryFacets() internal returns (IDiamond.FacetCut memory) {

        loop_registry_implementation = address (new WLoopRegistryFacet());
        // Loop_registry_fns
        bytes4[] memory _selectors = new bytes4[](1);
        _selectors[0]= LoopRegistryFacet.createLoop.selector;

        return IDiamond.FacetCut(loop_registry_implementation,IDiamond.FacetCutAction.Add, _selectors);

    }

    /**
    * @notice Initializes the essential input variables for deploying the LoopRegistry and its implementation.
    * @dev This internal virtual function must be implemented to set the crucial parameters required for a successful deployment.
    * The function is responsible for setting:
    *  - `facet_registry`: The address of the facet registry contract.
    *  - `admin`: The address that will be assigned administrative privileges.
    *
    * The rest of the deployment and configuration process is handled by the base deployment script.
    *
    * @custom:params
    * - `facet_registry`: The address of the facet registry, which manages the facets for the LoopRegistry.
    * - `admin`: The address of the administrator, necessary for controlling access and permissions.
    */
    function _initializeLoopRegistryInputs() internal virtual;


    /**
    * @notice Encodes and prepares the initialization data for the LoopRegistry initializer.
    * @dev This internal virtual function performs the following steps:
    * 1. Deploys a new instance of the Loop_Registry_InitializerV0 contract.
    * 2. Calls `_initializeLoopRegistryInputs()` to set essential input variables (such as the facet registry and admin addresses)
    *    required for the deployment of the LoopRegistry and its implementation.
    * 3. Invokes `_buildLoopFns()` to build the packed loop function definitions.
    * 4. Encodes the initialization data payload using the selector of the `init_loop_registry` function from the deployed
    *    Loop_Registry_InitializerV0 contract. The encoded data includes the loop initializer selector, loop implementation
    *    address, facet registry address, admin address, and the array of packed loop functions.
    *
    * The resulting tuple consists of:
    * - `_init`: The address of the newly deployed LoopRegistry initializer contract.
    * - `_initData`: The ABI-encoded initialization payload to be used during the deployment process.
    *
    * @return _init The address of the deployed LoopRegistry initializer.
    * @return _initData The ABI-encoded data for initializing the LoopRegistry.
    */
    function _encodeLoopRegistryInitializer()internal  virtual returns (address _init,bytes memory _initData){
        loop_registry_initializer = new Loop_Registry_InitializerV0();
        _initializeLoopRegistryInputs();
        _buildLoopFns();
        _initData = abi.encodeWithSelector(Loop_Registry_InitializerV0.init_loop_registry.selector,loop_initializer_selector,loop_implementation,facet_registry,admin,packedLoopFunctions);
        return (address(loop_registry_initializer),_initData);
    }

}
