// SPDX-License-Identifier: MIT

pragma solidity >=0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
/**
    @custom:nota : A decidir
    Esta es la estructura basal de los loops.
    Lo que no me queda del todo claro es si esta info DEBERIA quedar guardada ene l contrato del registry o SOLO lo guardamos en cada LOOP
*/
struct Loop {
    bool autoUpdate;     // [1] Indica si el loop se actualiza automáticamente.
    bytes31 sybil;       // [31] Tipo de sybil.
    uint8 version;       // [1] Versión actual del loop (para seguimiento histórico).
    uint88 distStrategy; // [11] Estrategia de distribución (nombre o identificador).
    address distToken;   // [20] Dirección del token utilizado para distribución.
    string orgName;      // [...] Nombre de la organización asociada.
}
struct Funcitions{
  bytes4 selector;
  address facet;
}
library LibLoopRegistrySt {
    /// @title REGISTRY_ST
    /// @notice Estructura principal para el almacenamiento de información del registro de facetas y loops.
    /// @dev Esta estructura utiliza empaquetamiento de datos en `bytes32` para optimizar el uso de almacenamiento.
    /// Contiene un registro histórico de facetas y detalles específicos de loops.
    struct REGISTRY_ST {
        /// @notice Última versión global del registro.
        /// @dev Representa el número de versión más reciente en el registro.
        bytes4 initialize_selector;
        address loop_minimalImplementation;
        uint80 latest_version;

        /// @notice Lista de todos los `loop_selectors` registrados.
        /// @dev Este array se utiliza para auditar y recorrer los selectores existentes.
        bytes4[] loop_selectors;

        /// @notice Registro histórico de facetas.
        /// @dev El mapeo almacena información empaquetada en `bytes32`:
        /// - **[4 bytes] selector (desplazado 256-32):**
        ///   - Identificador único de la faceta (por ejemplo, `keccak256` de la firma de la función).
        /// - **[4 bytes] version (desplazado 256-64):**
        ///   - Versión de la faceta asociada.
        /// -> MAPPING
        /// - **[12 bytes] state (desplazado 256-96):**
        ///   - Estado opcional de la faceta (e.g., "active", "maintenance", "deprecated").
        /// - **[20 bytes] address:**
        ///   - Dirección de la faceta asociada.
        ///
        /// Ejemplo de mapeo:
        /// - `0xabcdef123456 | v1.0 | [OP] -> [STATUS] | 0x123...890`
        mapping(bytes32 => bytes32) historic_facet_registry;

        /// @notice Información detallada sobre loops.
        /// @dev Cada dirección de loop está asociada a un registro de tipo `Loop`.
        mapping(address => Loop) loop_info;

        mapping(address => mapping(bytes4 => bytes32)) loop_facets_info; // loop(address) -> selector -> packedData[ version + status + address ]
    }



    /// @custom:storage-location erc7201:loopregistry.main
    /// @dev Identificador de almacenamiento para la estructura de datos principal.
    /// Cálculo: keccak256(abi.encode(uint256(keccak256("loopregistry.main")) - 1)) & ~bytes32(uint256(0xff)).
    /// EIP7201 ref -> "https://eips.ethereum.org/EIPS/eip-7201"
    bytes32 constant LOOP_REGISTRY_ST = 0x3af4aa691645f3555b9a0145a2e601bfc759019fd4e39a30fe047dcf49501500;

    /// @notice Devuelve una referencia al almacenamiento de `REGISTRY_ST`.
    /// @return st Referencia al espacio de almacenamiento de la estructura principal.
    function _storage() internal pure returns (REGISTRY_ST storage st) {
        assembly {
            st.slot := LOOP_REGISTRY_ST
        }
    }
    /*
     * @notice Unpacks a packed `bytes32` value into its components: selector, version, and facet address.
     * @dev This function extracts the following components from the packed data:
     *      - **[4 bytes] Selector:** The function selector.
     *      - **[4 bytes] Version:** The version of the facet.
     *      - **[20 bytes] Address:** The address of the associated facet.
     * @param data The packed `bytes32` value containing the selector, version, and facet address.
     * @return selector The first 4 bytes of the packed data (function selector).
     * @return version The next 4 bytes of the packed data (facet version).
     * @return facetAddress The last 20 bytes of the packed data (facet address).
     * @example
     * // Input packed data
     * bytes32 packedData = 0xabcdef12000000010000000000000000000000123456789012345678901234567890;
     * 
     * // Unpack the data
     * (bytes4 sel, uint32 ver, address addr) = unpackFacetData(packedData);
     * 
     * // Output:
     * // sel -> 0xabcdef12 (Function selector)
     * // ver -> 1 (Version)
     * // addr -> 0x1234567890123456789012345678901234567890 (Facet address)
     **/
    function unpackFacetData(bytes32 data)
      internal
      pure
      returns (bytes4 selector, uint32 version, address facetAddress)
    {
        // Extract the first 4 bytes (function selector)
        selector = bytes4(data >> (256 - 32));
    
        // Extract the next 4 bytes (version)
        version = uint32(uint256(data >> (256 - 64)));
    
        // Extract the last 20 bytes (facet address)
        facetAddress = address(uint160(uint256(data)));
    }
    /*
     * @notice Packs the selector, version, and facet address into a single `bytes32`.
     * @dev The packed format is as follows:
     *      - **[4 bytes] Selector:** Unique function identifier.
     *      - **[4 bytes] Version:** Facet version.
     *      - **[20 bytes] Address:** Address of the facet.
     * @param selector The function selector (4 bytes).
     * @param version The version of the facet (4 bytes).
     * @param facetAddress The address of the associated facet (20 bytes).
     * @return bytes32 Packed data containing the selector, version, and facet address.
     **/
    function packFacetData(
        bytes4 selector,
        uint32 version,
        address facetAddress
    ) internal pure returns (bytes32) {
        require(facetAddress != address(0), "Facet address cannot be zero");

        // Pack the selector, version, and facet address into a single bytes32
        return (bytes32(selector) << (256 - 32)) | // Selector in the first 4 bytes
               (bytes32(uint256(version)) << (256 - 64)) | // Version in the next 4 bytes
               bytes32(uint256(uint160(facetAddress))); // Facet address in the last 20 bytes
    }
}

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
        Funcitions[] memory loopFunctions = new Funcitions[](_l);
        if(_l == 0) revert LOOP_INITIALIZATION_FAILED();
    
        for (uint256 i = 0; i <_l; i++) {
            bytes4 selector = st.loop_selectors[i];
            bytes32 packedFacet = st.historic_facet_registry[selector];
            (, , address facetAddress) = LibLoopRegistrySt.unpackFacetData(packedFacet);
    
            if (facetAddress == address(0)) revert INVALID_FACET_FOR_SELECTOR(selector);
    
            loopFunctions[i] = Funcitions({
                selector: selector,
                facet: facetAddress
            });
    
            // Map the loop to its facets
            st.loop_facets_info[loopAddress][selector] = packedFacet;
        }
    
        // Initialize the loop with facets
        (bool success, ) = loopAddress.call(
            abi.encodeWithSelector(st.initialize_selector, loopFunctions, newLoop)
        );
        if (!success) revert LOOP_INITIALIZATION_FAILED();
    
        // Save the loop to storage
        st.loop_info[loopAddress] = newLoop;
    
        emit LoopCreated(loopAddress, orgName, sybil, distStrategy, distToken, autoUpdate);
    }

}
