use dotenv::dotenv;

pub mod utils;
use ethers::core::types::Signature;
use ethers::utils::hash_message;
use utils::setup_env::Env;

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
    println!(" Env listo para usarse: {:?}", env);
    if let Some(org_contract) =env.org_contract {
        let loop_receipt = Env::create_loop(&env, Some(org_contract), 120).await?
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
