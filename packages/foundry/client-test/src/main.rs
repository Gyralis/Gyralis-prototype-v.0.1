use dotenv::dotenv;
use ethers::abi::Abi;
use ethers::prelude::*;
use ethers::signers::{LocalWallet, Signer};
use serde_json::Value;
use std::env;
use std::fs;
use std::sync::Arc;

pub mod utils;
use utils::setup_env::Env;

#[tokio::main]
async fn main() -> eyre::Result<()> {
    dotenv().ok(); // Carga variables de entorno
                   // using anvil

    let env = match Env::setup().await {
        Ok(env) => env,
        Err(e) => {
            println!("❌ Error en setup: {}", e);
            return Err(e);
        }
    };
    println!(" Env listo para usarse: {:?}", env);

    // Cosas que tengo que hacer
    // 1) Setting up env
    //      - abrir el json del deployment
    //      - extraer el contrato de loop
    //      - traernos los signers del env
    //2) Interacciones
    //      - construir un loop
    //      - firmar con el trusted_signer para que bad_actor pueda reclamar varias veces
    //      - hacer una claimAndRegister
    //      - paralelizar los procesos y mandar muchas claimAndregister (10) asi me tarigo toda la teca de una

    // Configurar el cliente Ethereum
    // let provider = Provider::<Http>::try_from(rpc_url)?;
    // let wallet = private_key.parse::<LocalWallet>()?.with_chain_id(11155111); // Sepolia
    // let client = Arc::new(SignerMiddleware::new(provider, wallet));

    // println!("✅ Cliente configurado correctamente con contrato en {:?}", contract_address);

    Ok(())
}
