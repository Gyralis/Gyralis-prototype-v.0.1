use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
use tokio::{
    task,
    time::{sleep, Duration},
};

/// Función para mostrar una barra de espera en la consola.
async fn show_loading_spinner(stop_flag: Arc<AtomicBool>) {
    while !stop_flag.load(Ordering::Relaxed) {
        print!(".");
        std::io::Write::flush(&mut std::io::stdout()).unwrap(); // Forzar impresión inmediata
        sleep(Duration::from_secs(1)).await;
    }
}

/// Simulación de una tarea larga (por ejemplo, esperar confirmación de TX)
async fn long_running_task(time: u64) {
    sleep(Duration::from_secs(time)).await; // Simula una operación que toma 5 segundos
}

pub async fn logged_wait(time_in_secs: u64) {
    println!("Waiting for the tx hash to be in the network");
    let stop_flag = Arc::new(AtomicBool::new(false));
    let stop_flag_clone = stop_flag.clone();

    let spinner_task = task::spawn(async move {
        show_loading_spinner(stop_flag_clone).await;
    });

    // Ejecutar la tarea larga en paralelo
    long_running_task(time_in_secs).await;

    //  Detener la barra de espera
    stop_flag.store(true, Ordering::Relaxed);
    spinner_task.await.unwrap();
    println!("Tx hash SHOULD be confirmed");
}
