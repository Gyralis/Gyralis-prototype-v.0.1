use ethers::abi::{ParamType, Token};
use ethers::prelude::*;
use eyre::Result;
use std::sync::Arc;

// Estructura para almacenar los datos del evento `LoopCreated`
#[derive(Debug)]
pub struct LoopCreatedEvent {
    loop_address: Address,
    token: Address,
    period_length: U256,
    percent_per_period: U256,
}

// Función para buscar `LoopCreated` en una transacción
pub async fn find_loop_created_event(
    provider: Arc<Provider<Http>>,
    tx_hash: H256,
) -> Result<Option<LoopCreatedEvent>> {
    // Obtener el receipt de la transacción
    let receipt = provider
        .get_transaction_receipt(tx_hash)
        .await?
        .ok_or_else(|| eyre::eyre!("❌ No se encontró el receipt para esta transacción"))?;

    // Obtener la firma del evento `LoopCreated(address, address, uint256, uint256)`
    let event_signature =
        H256::from_slice(keccak256("LoopCreated(address,address,uint256,uint256)").as_slice());

    // Buscar el log correspondiente al evento `LoopCreated`
    for log in &receipt.logs {
        if log.topics.get(0) == Some(&event_signature) {
            // Decodificar la data del evento
            let decoded_data = ethers::abi::decode(
                &[
                    ParamType::Address,   // loopAddress
                    ParamType::Address,   // token
                    ParamType::Uint(256), // periodLength
                    ParamType::Uint(256), // percentPerPeriod
                ],
                &log.data,
            )?;

            // Extraer valores del evento
            let loop_address = decoded_data[0].clone().into_address().unwrap();
            let token = decoded_data[1].clone().into_address().unwrap();
            let period_length = decoded_data[2].clone().into_uint().unwrap();
            let percent_per_period = decoded_data[3].clone().into_uint().unwrap();

            let event_data = LoopCreatedEvent {
                loop_address,
                token,
                period_length,
                percent_per_period,
            };

            return Ok(Some(event_data)); //  Devolvemos el evento encontrado
        }
    }

    Ok(None) // ❌ Si no encontramos el evento, devolvemos `None`
}
