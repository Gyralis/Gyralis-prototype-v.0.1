use ethers::abi::{Abi, AbiDecode, ParamType};
use ethers::contract::Contract;
use ethers::core::k256::ecdsa::SigningKey;
use ethers::middleware::SignerMiddleware;
use ethers::providers::{Http, Provider};
use ethers::signers::{LocalWallet, Signer};
use ethers::types::{Address, TransactionReceipt, H256, U256};
use eyre::{Ok, Result};
use serde_json::Value;
use std::env;
use std::fs;
use std::future::pending;
use std::result::Result::Ok as StdOk;
use std::sync::Arc;

#[derive(Debug, Clone)]
pub struct ContractStr {
    address: Address,
    abi: Abi,
}

#[derive(Debug, Clone)]
pub struct Env {
    pub rpc_url: String,
    pub bad_actor_pk: String,
    pub trusted_signer_pk: String,
    pub deployemt_data: Value,
    pub loop_contract: Option<Contract<Provider<Http>>>, // Instancia sin signer
    pub org_contract: Option<Contract<Provider<Http>>>,  // Instancia sin signer
    pub bad_signer: Option<Arc<SignerMiddleware<Provider<Http>, LocalWallet>>>,
    pub trusted_signer: Option<Arc<SignerMiddleware<Provider<Http>, LocalWallet>>>,
}

impl Env {
    pub const CHAIN_ID: u64 = 31337;
    fn default() -> Self {
        Self {
            rpc_url: String::new(),
            bad_actor_pk: String::new(),
            trusted_signer_pk: String::new(),
            deployemt_data: Value::default(),
            loop_contract: None,
            org_contract: None,
            bad_signer: None,
            trusted_signer: None,
        }
    }
    fn setup_providers(&mut self, loop_data: &ContractStr, org_data: &ContractStr) -> Result<()> {
        // Construcción de la estructura Env
        let provider = Provider::<Http>::try_from(&self.rpc_url)?;

        // 2️⃣ Crear wallets desde claves privadas
        let wallet1 = self
            .bad_actor_pk
            .parse::<LocalWallet>()?
            .with_chain_id(Self::CHAIN_ID);
        let wallet2 = self
            .trusted_signer_pk
            .parse::<LocalWallet>()?
            .with_chain_id(Self::CHAIN_ID);

        let bad_signer = Arc::new(SignerMiddleware::new(provider.clone(), wallet1));
        let trusted_signer = Arc::new(SignerMiddleware::new(provider.clone(), wallet2));

        let loop_contract = Contract::new(
            loop_data.address,
            loop_data.abi.clone(),
            Arc::new(provider.clone()),
        );
        let org_contract = Contract::new(
            org_data.address,
            org_data.abi.clone(),
            Arc::new(provider.clone()),
        );

        self.bad_signer = Some(bad_signer);
        self.trusted_signer = Some(trusted_signer);
        self.loop_contract = Some(loop_contract);
        self.org_contract = Some(org_contract);

        Ok(())
    }
    pub async fn setup() -> Result<Self> {
        // Cargar variables de entorno
        let rpc_url = env::var("RPC_URL")?;
        let bad_actor_pk = env::var("BAD_ACTOR_PK")?;
        let trusted_signer_pk = env::var("TRUSTED_SIGNER_PK")?;

        // Leer archivos JSON
        let data = fs::read_to_string("../deployments/31337.json")?;
        let org_facet_data =
            fs::read_to_string("../out/OrganizationFacet.sol/OrganizationFacet.json")?;
        let loop_facet_data = fs::read_to_string("../out/LoopFacet.sol/LoopFacet.json")?;

        // Parsear JSON
        let json: Value = serde_json::from_str(&data)?;
        let org_json: Value = serde_json::from_str(&org_facet_data)?;
        let loop_json: Value = serde_json::from_str(&loop_facet_data)?;

        // Extraer dirección del contrato "loop"
        let loop_address: Address = json["loop"]
            .as_str()
            .ok_or_else(|| eyre::eyre!("Loop address not found in JSON."))?
            .parse()?;

        println!(" Loop address: {:?}", loop_address);

        // Extraer dirección del contrato "org"
        let org_address: Address = json["organization"]
            .as_str()
            .ok_or_else(|| eyre::eyre!("Organization address not found in JSON."))?
            .parse()?;

        println!("Organization address: {:?}", org_address);

        // Extraer y parsear ABI del contrato
        let loop_contract_abi: Abi = serde_json::from_value(
            loop_json
                .get("abi")
                .ok_or_else(|| eyre::eyre!("ABI not found in loop JSON."))?
                .clone(),
        )?;

        let org_contract_abi: Abi = serde_json::from_value(
            org_json
                .get("abi")
                .ok_or_else(|| eyre::eyre!("ABI not found in organization JSON."))?
                .clone(),
        )?;
        let org_struct: ContractStr = ContractStr {
            address: loop_address,
            abi: loop_contract_abi,
        };
        let loop_struct: ContractStr = ContractStr {
            address: org_address,
            abi: org_contract_abi,
        };

        let mut env_struct = Env::default();
        env_struct.rpc_url = rpc_url;
        env_struct.bad_actor_pk = bad_actor_pk;
        env_struct.trusted_signer_pk = trusted_signer_pk;
        env_struct.deployemt_data = json;
        env_struct.setup_providers(&org_struct, &loop_struct)?;

        println!("Loop Contract ABI cargado correctamente.");
        println!("Organization Contract ABI cargado correctamente.");

        Ok(env_struct)
    }
}

impl Env {
    // pub async fn create_loop(
    //     env: &Env,
    //     contract: Option<Contract<Provider<Http>>>,
    //     time: U256,
    // ) -> Result<H256> {
    //     let system_diamond: Address = env
    //         .deployemt_data
    //         .get("system_diamond")
    //         .and_then(Value::as_str)
    //         .ok_or_else(|| eyre::eyre!("❌ system_diamond no encontrado o inválido"))?
    //         .parse()?;

    //     let token: Address = env
    //         .deployemt_data
    //         .get("test_token_address")
    //         .and_then(Value::as_str)
    //         .ok_or_else(|| eyre::eyre!("❌ test_token_address no encontrado o inválido"))?
    //         .parse()?;

    //     let percent_per_period: U256 = U256::from(5);

    //     match contract {
    //         Some(c) => {
    //             let signer = env
    //                 .trusted_signer
    //                 .clone()
    //                 .ok_or_else(|| eyre::eyre!("❌ No hay signer disponible"))?;
    //             let c_with_user = c.connect(signer);
    //             // Conectar el contrato con el signer
    //             // let org_contract_with_signer = c.clone().connect(signer);

    //             // Enviar la transacción

    //             // Enviar la transacción y obtener el objeto PendingTransaction
    //             let pending_tx = c_with_user
    //                 .method::<(Address, Address, U256, U256), Address>(
    //                     "createNewLoop",
    //                     (system_diamond, token, time, percent_per_period),
    //                 )?
    //                 .send()
    //                 .await?
    //                 .tx_hash();

    //             // let receipt = pending_tx
    //             //     .await?
    //             //     .ok_or_else(|| eyre::eyre!("❌ La transacción no se confirmó"))?;
    //             // // Extraer el valor de retorno desde los logs (si `createNewLoop` lo devuelve)
    //             // let new_loop_address = receipt
    //             //     .clone()
    //             //     .logs
    //             //     .iter()
    //             //     .find_map(|log| {
    //             //         log.topics.get(0).and_then(|topic| {
    //             //             if *topic == c.abi().event("LoopCreated").unwrap().signature() {
    //             //                 Some(
    //             //                     ethers::abi::decode(&[ParamType::Address], &log.data)
    //             //                         .ok()?
    //             //                         .remove(0),
    //             //                 )
    //             //             } else {
    //             //                 None
    //             //             }
    //             //         })
    //             //     })
    //             //     .ok_or_else(|| {
    //             //         eyre::eyre!("❌ No se pudo recuperar la dirección del nuevo Loop")
    //             //     })?;
    //             Ok(pending_tx)
    //             // println!("✅ Loop creado en la dirección: {:?}", new_loop_address);
    //         }
    //         // Ok((, new_loop_address.into_address().unwrap()))
    //         None => Ok(H256::default()),
    //     }
    // }
    pub async fn claim_and_register(env: &Env, signature: Vec<u8>) -> Result<H256> {
        match &env.loop_contract {
            Some(c) => {
                let tx_hash = c
                    .method::<Vec<u8>, H256>("claimAndRegister", signature)
                    .unwrap()
                    .send()
                    .await?
                    .tx_hash();

                Ok(tx_hash)
            }
            None => Ok(H256::zero()),
        }
    }

    pub async fn get_current_period(env: &Env) -> Result<U256> {
        match &env.loop_contract {
            Some(c) => {
                let period: U256 = c
                    .method::<(), U256>("getCurrentPeriod", ())
                    .unwrap()
                    .call()
                    .await?;
                Ok(period)
            }
            None => Ok(U256::default()),
        }
    }
}
