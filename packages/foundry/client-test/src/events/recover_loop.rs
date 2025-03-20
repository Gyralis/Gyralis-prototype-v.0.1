use ethers::abi::{ParamType, Token};
use ethers::prelude::*;
use ethers::utils::keccak256;
use eyre::{Ok, Result};
use std::sync::Arc;
use tokio::time::{sleep, Duration};

use crate::utils::logged_wait;
use crate::utils::RPC_URL;
// Estructura para almacenar los datos del evento `LoopCreated`
#[derive(Debug)]
pub struct LoopCreatedEvent {
    pub loop_address: Address,
    pub token: Address,
    pub period_length: U256,
    pub percent_per_period: U256,
}
use crate::events::event_listener::event_listener;
use crate::get_provider;
// Función para buscar `LoopCreated` en una transacción
pub async fn find_loop_created_event(
    address: Address,
    tx_hash: H256,
) -> Result<Option<LoopCreatedEvent>> {
    logged_wait(11).await;
    // Obtener el receipt de la transacción
    let provider = get_provider(RPC_URL).await?;
    let receipt = provider
        .get_transaction_receipt(tx_hash)
        .await?
        .ok_or_else(|| eyre::eyre!("❌ No se encontró el receipt para esta transacción"))?;
    println!("receipt tx : {:?} ", receipt);

    // Obtener la firma del evento `LoopCreated(address, address, uint256, uint256)`
    let event_signature =
        H256::from_slice(keccak256("LoopCreated(address,address,uint256,uint256)").as_slice());
    let log = event_listener(address, event_signature, true).await?;
    if log.data.is_empty() {
        let decoded_data = ethers::abi::decode(
            &[
                ParamType::Address,   // loopAddress
                ParamType::Address,   // token
                ParamType::Uint(256), // periodLength
                ParamType::Uint(256), // percentPerPeriod
            ],
            &log.data,
        )?;

        // Extraer datos del evento asegurándonos de que la conversión sea segura
        let loop_address = decoded_data.get(0).and_then(|d| d.clone().into_address());
        let token = decoded_data.get(1).and_then(|d| d.clone().into_address());
        let period_length = decoded_data.get(2).and_then(|d| d.clone().into_uint());
        let percent_per_period = decoded_data.get(3).and_then(|d| d.clone().into_uint());

        // Validamos que todos los valores existen
        if let (Some(loop_address), Some(token), Some(period_length), Some(percent_per_period)) =
            (loop_address, token, period_length, percent_per_period)
        {
            let event_data = LoopCreatedEvent {
                loop_address,
                token,
                period_length,
                percent_per_period,
            };
            Ok(Some(event_data))
        } else {
            Err(eyre::eyre!("❌ Error al extraer los datos del evento"))
        }
    } else {
        Ok(None)
    }
    // Buscar el log correspondiente al evento `LoopCreated`
    // for log in &logs {
    //     if log.topics.get(0) == Some(&event_signature) {
    //         // Decodificar la data del evento
    //         let decoded_data = ethers::abi::decode(
    //             &[
    //                 ParamType::Address,   // loopAddress
    //                 ParamType::Address,   // token
    //                 ParamType::Uint(256), // periodLength
    //                 ParamType::Uint(256), // percentPerPeriod
    //             ],
    //             &log.data,
    //         )?;

    //         // Extraer valores del evento
    //         let loop_address = decoded_data[0].clone().into_address().unwrap();
    //         let token = decoded_data[1].clone().into_address().unwrap();
    //         let period_length = decoded_data[2].clone().into_uint().unwrap();
    //         let percent_per_period = decoded_data[3].clone().into_uint().unwrap();

    //         let event_data = LoopCreatedEvent {
    //             loop_address,
    //             token,
    //             period_length,
    //             percent_per_period,
    //         };

    //         return Ok(Some(event_data)); //  Devolvemos el evento encontrado
    //     }
    // }
}
