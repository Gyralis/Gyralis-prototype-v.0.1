use crate::get_provider;
use crate::utils::RPC_URL;
use ethers::providers::{Middleware, Provider, StreamExt, Ws};
use ethers::types::{Address, BlockNumber, Filter, Log, H256};
use eyre::Result;

/// Escucha eventos en un contrato. Si `lookback` es `true`, busca en retrospectiva.
pub async fn event_listener(add: Address, event_signature: H256, lookback: bool) -> Result<Log> {
    let provider = get_provider(RPC_URL).await?;
    let filter = Filter::new().address(add);

    if lookback {
        println!(" Buscando eventos pasados en el contrato {:?}...", add);

        // Filtrar eventos desde los últimos 1000 bloques
        // let filter = filter.from_block(BlockNumber::Latest.as_number - 1000);
        println!("Block::number {}", BlockNumber::Latest);
        let l_block = provider.get_block_number().await?;
        println!("Block::get_block {}", l_block);
        println!("Block::get_block -10% {}", l_block / 10);
        let b_from = l_block.clone() - l_block / 10;
        let filter = filter.from_block(b_from);
        let logs = provider.get_logs(&filter).await?;

        for log in logs {
            if let Some(topic) = log.topics.get(0) {
                if *topic == event_signature {
                    println!(" Evento encontrado en el pasado: {:?}", log);
                    return Ok(log);
                }
            }
        }

        return Err(eyre::eyre!("❌ No se encontró el evento en retrospectiva"));
    } else {
        println!(
            "Escuchando eventos en tiempo real para el contrato {:?}...",
            add
        );
        let mut stream = provider.subscribe_logs(&filter).await?;

        while let Some(log) = stream.next().await {
            println!("Nuevo evento recibido: {:?}", log);

            if let Some(topic) = log.topics.get(0) {
                if *topic == event_signature {
                    println!("Evento detectado en tiempo real: {:?}", log);
                    return Ok(log);
                }
            }
        }

        return Err(eyre::eyre!(
            "❌ No se encontró el evento esperado en tiempo real"
        ));
    }
}
