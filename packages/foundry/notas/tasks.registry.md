Tareas (V0)

Setup del diamante (registry)

    Armar un script que levante un diamante para regisrty
    Armar una libreria para guardar la información de cada loop
    Incluir la implementacion del diamante sencilla alli (o usar address(this) capaz va mejor)
    Incluir las diferentes facetas con sus respectivas versiones (esto esta bueno para hacer un registro histórico y ver los cambios con el paso del tiempo)

Armar la faceta del LoopRegistry

    Esta debería poder : crearLoop
    Actualizar Loops directamente (capaz lo segmentamos por selector para mantener un orden)
    Instlarle nuevas facetas (que esten disponibles) al Loop (flow : Loop->Registry->Loop(actualizando storage))
