use ethers::providers::{Http, Provider};
use std::sync::Arc;
// use ethers::abi::{ParamType, Token};
use ethers::prelude::*;
use eyre::Result;
use serde_json::Value;

use crate::events::recover_loop::{find_loop_created_event, LoopCreatedEvent};

use crate::Env;

pub async fn create_loop(
    env: &Env,
    contract: Contract<Provider<Http>>,
    time: U256,
) -> Result<(H256, Option<LoopCreatedEvent>)> {
    let system_diamond: Address = env
        .deployemt_data
        .get("system_diamond")
        .and_then(Value::as_str)
        .ok_or_else(|| eyre::eyre!("❌ system_diamond no encontrado o inválido"))?
        .parse()?;

    let token: Address = env
        .deployemt_data
        .get("test_token_address")
        .and_then(Value::as_str)
        .ok_or_else(|| eyre::eyre!("❌ test_token_address no encontrado o inválido"))?
        .parse()?;

    let percent_per_period: U256 = U256::from(5);

    // match contract {
    // Some(c) => {
    let signer = env
        .trusted_signer
        .clone()
        .ok_or_else(|| eyre::eyre!("❌ No hay signer disponible"))?;
    let c_with_user = contract.clone().connect(signer);
    println!("contract(organization) : {:?}", c_with_user.address());
    // 1. Enviar la transacción y obtener el `tx_hash`
    let tx_hash_pending = c_with_user
        .method::<(Address, Address, U256, U256), Address>(
            "createNewLoop",
            (system_diamond, token, time, percent_per_period),
        )?
        .send()
        .await?
        .tx_hash();
    let tx_hash = tx_hash_pending.clone();

    println!(" Loop creado en TX [pending]: {:?}", tx_hash);
    let loop_event = find_loop_created_event(system_diamond, tx_hash).await?;
    Ok((tx_hash, loop_event))
}
