use ethers::providers::{Http, Provider, Ws};
use eyre::Result;
use std::sync::Arc;

/// Obtiene un `Provider<Http>` envuelto en `Arc`, a partir de una URL de RPC.
pub async fn get_provider(rpc_url: &str) -> Result<Arc<Provider<Ws>>> {
    let ws_url = if rpc_url.starts_with("http://") {
        rpc_url.replacen("http://", "ws://", 1)
    } else if rpc_url.starts_with("https://") {
        rpc_url.replacen("https://", "wss://", 1)
    } else {
        rpc_url.to_string()
    };

    let ws = Ws::connect(ws_url).await?;
    let provider = Arc::new(Provider::new(ws));
    Ok(provider)
}
