# Que cosas quiero hacer aca ?

## Paso 0 : plan
1. [x] Revisar donde estamos parados?
  - Tenemos un diamante (`opinionarlo`)
  - Tenemos un setup inicial
  - Tenemos algunos tests (`muchos se rompen`)
```bash
Ran 8 test suites in 139.44ms (90.20ms CPU time): 8 tests passed, 13 failed, 0 skipped (21 total tests)
```
- Tenemos buenos ejemplos de varias cosas
  - Access control, para que se usa? Ok ya lo entendí, usa los operadores de bits para tener controlados los roles
  - Las faceta {`FacetCut`} **NO** tiene implementado accesos de control : **PROBLEMA**
  - Para que tenemos `DiamondLoupeStorage` y `DiamondCutStorage` en 2 instancias separadas ?
  - Para que hacemos la separación de `___Base.sol` y la implementación ?
  - El diamante tiene código redundante (en mi opinion) porque *debería* ir todo en facetas.
  - Que rol cumple el facet registry ??

2. [ ] Cambios propuestos :
  - [ ] `Slim-diamond` : un diamante que tenga **SOLO** inicializar && `delegate`
  - [ ] **Unificar** los storages de `DiamondLoupeStorage`, `DiamondCutStorage` -> `DiamondStorage`
  - [ ] **Simplificar** la estructura de las facetas sobre compleja : que ahora sea **SOLO** `storage` + `implementación`
    - `lib_st`
    - `modifers` (si aplica)
    - `implementación`
  - [ ] **SACAR** el _noise_ que hay
    - la carpeta `registry` para que sirve??
    - por que hay llamadas internas ??? cuando **pueden** ser lecturas del storage?
    - `Facet` no esta medio **OP** ? Creo que s epuede simplificar bastante ya que las cosas que hace son medias redundantes
  - [ ] **Ordenar** la estructura, los helpers **NO** pueden ir en la carpeta de tests si se van a usar como scripts
  - [ ]

### Plan propuesto :
#### Actions
```mermaid
gantt
    title Planificación del proyecto
    dateFormat  YYYY-MM-DD
    section Semana 1 - Cambios iniciales
    Slim-diamond: done, 2025-01-13, 2025-01-15
    Unificar storages: active, 2025-01-13, 2025-01-17
    Simplificar facetas: active, 2025-01-13, 2025-01-18
    Limpiar _noise_: active, 2025-01-15, 2025-01-18
    Ordenar estructura: active, 2025-01-15, 2025-01-19
    section Semana 2 - Inicio del Registry
    Analizar requerimientos de Registry: active, 2025-01-20, 2025-01-22
    Diseñar estructura base del Registry: 2025-01-22, 2025-01-25
    Implementar estructura inicial: 2025-01-25, 2025-01-27
    section Semana 3 - Finalización del Registry
    Testing del módulo Registry: 2025-01-28, 2025-01-30
    Refinar e integrar Registry con otros módulos: 2025-01-30, 2025-02-02
```
#### Diamante
- **Actual**
```mermaid
classDiagram
    class Diamond {
        +constructor(InitParams initDiamondCut)
        +_implementation() returns (address)
    }

    class Proxy {
        <<imported>>
        ...
    }

    class Initializable {
        <<imported>>
        ...
    }

    class DiamondCutBase {
        -_diamondCut(FacetCut[] facetCuts, address init, bytes initData)
        -_addFacet(address facet, bytes4[] selectors)
        -_replaceFacet(address facet, bytes4[] selectors)
        -_removeFacet(address facet, bytes4[] selectors)
    }

    class DiamondLoupeBase {
        -_facetSelectors(address facet) returns (bytes4[])
        -_facetAddresses() returns (address[])
        -_facetAddress(bytes4 selector) returns (address)
        -_facets() returns (Facet[])
    }

    class DiamondCutStorage {
        <<imported>>
        ...
    }

    class DiamondLoupeStorage {
        <<imported>>
        ...
    }

    class IDiamond {
        <<interface>>
        ...
    }

    class EnumerableSet {
        <<imported>>
        ...
    }

    Diamond --> Proxy
    Diamond --> Initializable
    Diamond --> DiamondCutBase
    Diamond --> DiamondLoupeBase
    DiamondCutBase --> DiamondCutStorage
    DiamondLoupeBase --> DiamondLoupeStorage
    DiamondCutBase --> IDiamond
    DiamondLoupeBase --> IDiamond
    DiamondCutBase --> EnumerableSet
    DiamondLoupeBase --> EnumerableSet
```
- **Propuesto**
```mermaid
classDiagram
    class Diamond {
        +constructor(InitParams initParams)
        +_implementation() returns (address)
    }

    class DiamondStorage {
        +facets : EnumerableSet
        +facetSelectors : mapping(address => EnumerableSet)
        +selectorToFacet : mapping(bytes4 => address)
        +supportedInterfaces : mapping(bytes4 => bool)
    }

    class Initializer {
        +initialize(InitParams initParams)
    }

    class Delegate {
        +delegateCall(bytes4 selector, bytes calldata data)
        +_diamondCut(FacetCut[] facetCuts, address init, bytes initData)
        +_addFacet(address facet, bytes4[] selectors)
        +_replaceFacet(address facet, bytes4[] selectors)
        +_removeFacet(address facet, bytes4[] selectors)
    }

    class EnumerableSet {
        <<imported>>
        ...
    }

    Diamond --> DiamondStorage
    Diamond --> Initializer
    Diamond --> Delegate
    DiamondStorage --> EnumerableSet
    Delegate --> DiamondStorage
```
## Paso 2
**Objetivos:**
- Implementar un módulo Registry que se integre con la estructura base del diamante.
- Configurar los métodos para agregar, eliminar y consultar datos de registro.
- Crear un LoopRegistry que permita instanciar múltiples diamantes mínimos con configuraciones específicas.
- Preparar el sistema para asociar diamantes a organizaciones en el próximo paso.
- Garantizar que el diseño sea extensible, eficiente y fácil de mantener.

**Tareas Detalladas**
1. Análisis de Requerimientos

- Definir los Datos del Registry:
 - Manejo de datos genéricos como usuarios, contratos, configuraciones y asociaciones.
 - Los datos estarán estructurados para soportar instancias múltiples (Loops).
- Interfaces Necesarias:
 - Métodos básicos para manejar entradas (agregar, eliminar, consultar).
 - Métodos avanzados para instanciar diamantes mínimos.
- Diseñar las Funciones:
 - addEntry: Agregar un nuevo elemento al registro.
 - removeEntry: Eliminar un elemento existente.
 - getEntry: Consultar un elemento en particular.
 - listEntries: Listar todos los elementos registrados.
- Loop Functions:
 - createLoop: Instanciar un nuevo diamante mínimo (Loop).
 - initializeLoop: Inicializar una instancia de Loop con datos específicos.
 - linkLoopToOrganization: Asignar un Loop a una organización
