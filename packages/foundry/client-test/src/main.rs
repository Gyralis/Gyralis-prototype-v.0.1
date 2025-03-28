use dotenv::dotenv;

pub mod utils;
use ethers::types::{Filter, U256};

use utils::{get_provider, setup_env::Env};
pub mod functions;
pub use functions::create_loop::*;
pub mod events;

#[tokio::main]
async fn main() -> eyre::Result<()> {
    dotenv().ok(); // Carga variables de entorno
                   // using anvil

    // Cosas que tengo que hacer
    // 1) Setting up env
    //      - abrir el json del deployment
    //      - extraer el contrato de loop
    //      - traernos los signers del env
    let env = match Env::setup().await {
        Ok(env) => env,
        Err(e) => {
            println!("❌ Error en setup: {}", e);
            return Err(e);
        }
    };

    // println!(" Env listo para usarse: {:?}", env);
    if let Some(org_contract) = env.org_contract.clone() {
        let time: U256 = U256::from(120);
        let (tx_hash, loop_event) = create_loop(&env, org_contract, time).await?;
        println!("Tx_hash : {:?}", tx_hash);
        println!("loop_event : {:?}", loop_event)
    }

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
