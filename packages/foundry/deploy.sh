#!/bin/bash

set -e  # Corta la ejecución si hay cualquier error de comando

echo "Choose a network:"
echo "(arbitrum is skipped due to broken faucets)"
options=("localhost" "gnosis" "arbitrum" "cancel")
select NETWORK in "${options[@]}"; do
    case $NETWORK in
        "localhost")
            RPC_URL="localhost"
            VERIFY=false
            # Override DEPLOYER_PK with Anvil default account #11
            # Index 11 = 0x59c6995e998f97a5a0044966f094538b292d5e28 (default in Anvil)
            export DEPLOYER_PK="0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82"
            # anvil [27] := 0x87BdCE72c06C21cd96219BD8521bDF1F42C78b5e
            # pk := 0xf3a6b71b94f5cd909fb2dbb287da47badaa6d8bcdc45d595e2884835d8749001
            export SYSTEM_ADDRESS="0x87BdCE72c06C21cd96219BD8521bDF1F42C78b5e"
            echo "Using Anvil deployer at index 11 (DEPLOYER_PK=${DEPLOYER_PK})"
            echo "Using Anvil at index 28 (SYSTEM_ADDRESS=${SYSTEM_ADDRESS})"
            break
            ;;
        "gnosis")
            RPC_URL="gnosis"
            VERIFY=true
            break
            ;;
        "arbitrum")
            RPC_URL=$RPC_URL_ARBITRUM
            VERIFY=true
            break
            ;;
        "cancel")
            echo "Cancelled."
            exit 0
            ;;
        *)
            echo "Invalid option $REPLY"
            ;;
    esac
done

echo "Select which components to deploy (space-separated):"
options=("facets" "diamond" "organization" "token" "loop" "all")
select SCRIPT_CHOICE in "${options[@]}"; do
    if [[ "$SCRIPT_CHOICE" == "all" ]]; then
        SCRIPTS=("facets" "diamond" "organization" "token" "loop")
        break
    elif [[ " ${options[@]} " =~ " $SCRIPT_CHOICE " ]]; then
        read -p "You can list multiple (e.g. facets diamond loop): " INPUT
        SCRIPTS=($INPUT)
        break
    else
        echo "Invalid choice"
    fi
done

echo ""
echo "Deploying on network: $NETWORK"
echo "Selected scripts: ${SCRIPTS[@]}"
echo ""

# Set base command
BASE_CMD="forge script"
BROADCAST_FLAGS="--broadcast --slow --rpc-url $RPC_URL"
[[ "$VERIFY" == true ]] && BROADCAST_FLAGS="$BROADCAST_FLAGS --verify"

# Run deploys one by one (exit if any fails)
for SCRIPT in "${SCRIPTS[@]}"; do
    SCRIPT_FILE=""
    case $SCRIPT in
        "facets") SCRIPT_FILE="DeployFacets.s.sol:DeployFacets" ;;
        "diamond") SCRIPT_FILE="DeployDiamond.s.sol:DeployDiamond" ;;
        "organization") SCRIPT_FILE="DeployOrganization.s.sol:DeployOrganization" ;;
        "token") SCRIPT_FILE="DeployToken.s.sol:DeployTestToken" ;;
        "loop") SCRIPT_FILE="DeployLoop.s.sol:DeployLoop" ;;
        *)
            echo "Unknown script: $SCRIPT"
            exit 1
            ;;
    esac

    echo "Running $SCRIPT_FILE ..."
    if ! $BASE_CMD script/deploy/$SCRIPT_FILE $BROADCAST_FLAGS; then
        echo "Error: $SCRIPT_FILE failed. Exiting."
        exit 1
    fi
    echo "Done with $SCRIPT"
    echo ""
done

echo "All selected deploys completed successfully."
