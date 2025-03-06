use ethers::abi::Abi;
use ethers::types::Address;
use eyre::Result;
use serde_json::Value;
use std::env;
use std::fs;

#[derive(Debug, Clone)]
pub struct ContractStr {
    address: Address,
    abi: Abi,
}

#[derive(Debug, Clone)]
pub struct Env {
    rpc_url: String,
    bad_actor_pk: String,
    trusted_signer_pk: String,
    deployemt_data: Value,
    loop_contract: ContractStr,
    org_contract: ContractStr,
}

impl Env {
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

        println!("✅ Loop address: {:?}", loop_address);

        // Extraer dirección del contrato "org"
        let org_address: Address = json["organization"]
            .as_str()
            .ok_or_else(|| eyre::eyre!("Organization address not found in JSON."))?
            .parse()?;

        println!("✅ Organization address: {:?}", org_address);

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

        println!("✅ Loop Contract ABI cargado correctamente.");
        println!("✅ Organization Contract ABI cargado correctamente.");

        // Construcción de la estructura Env
        Ok(Env {
            rpc_url,
            bad_actor_pk,
            trusted_signer_pk,
            deployemt_data: json,
            loop_contract: ContractStr {
                address: loop_address,
                abi: loop_contract_abi,
            },
            org_contract: ContractStr {
                address: org_address,
                abi: org_contract_abi,
            },
        })
    }
}
