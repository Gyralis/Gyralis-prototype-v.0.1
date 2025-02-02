# Tareas (V0)

 ## **1. Configuración del Diamante (`registry`)**

 ### 1.1 Preparar el entorno para el despliegue del diamante
 - [ ] Armar un script que levante un contrato diamante para el _regisrty_.
    - [x] Diamante base
    - [-] Implementar el _registry_facet_
    - [-] Implementar el _initializer_
 - [ ] Configurar los parámetros iniciales para el diamante:
 - [ ] Crear el `initializer` que envíe la configuración inicial al contrato.
 - [ ] Configurar el uso de `address(this)` para referencias internas.
 - [ ] Incluir verificaciones para garantizar que la configuración inicial sea válida.

 ### 1.2 Implementación del diamante
 - [ ] Configurar las facetas iniciales:
 - [x] `Loop` Facet.
 - [x] `Cut` Facet.
 - [ ] `Registry` Facet.
 - [ ] Crear una librería que maneje los datos y la lógica de cada loop.
 - [ ] Incluir soporte para registrar versiones de las facetas:
 - [ ] Implementar almacenamiento histórico de cambios en las facetas.
 - [ ] Habilitar comparación de versiones entre actualizaciones.

 ---

 ## **2. Construcción de la Faceta `LoopRegistry`**

 ### 2.1 Crear nuevos loops (`createLoop`)
 - [ ] Implementar la funcionalidad para crear loops:
 - [ ] Verificar parámetros antes de la creación.
    - params: (auto_update , org_name ,sybil ,dist_token ,dist_startegy,authed_addresses)
 - [ ] Asignar almacenamiento inicial al loop.
 - [ ] Registrar el loop en el contrato de registro.

 ### 2.2 Actualizar loops directamente
 - [ ] Implementar una función para actualizar datos o lógica en loops existentes:
 - [ ] Permitir segmentación por selector para mantener claridad.
 - [ ] Registrar cambios en almacenamiento histórico.

 ### 2.3 Instalar nuevas facetas en un loop
 - [ ] Implementar la funcionalidad para agregar nuevas facetas:
 - [ ] Validar las nuevas facetas disponibles en el registro.
 - [ ] Actualizar el almacenamiento del loop con la nueva lógica.
 - [ ] Registrar los cambios realizados en el loop.

 ---

 ## **3. Validaciones y Pruebas**

 ### 3.1 Validar integridad del sistema
 - [ ] Asegurar que todas las facetas iniciales estén correctamente configuradas.
 - [ ] Validar que los loops creados sean accesibles y funcionales.

 ### 3.2 Implementar pruebas unitarias
 - [ ] Crear pruebas para el despliegue del diamante.
 - [ ] Probar la funcionalidad de creación de loops.
 - [ ] Verificar la instalación de nuevas facetas en loops.
