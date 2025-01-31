// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

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
struct Function{
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
        address facet_registry;

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
}
