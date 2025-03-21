#!/bin/sh

# === Config ===
LOG_FILE=$1
OUTPUT_DIR="./deployments/facets"

# Check if log file exists
if [ ! -f "$LOG_FILE" ]; then
  echo "Usage: ./parse_facets.sh <log-file>"
  exit 1
fi

# Defaults
DEFAULT_CHAIN_ID="31137"
DEFAULT_BLOCK_ID="latest"

# Get chain ID and block number (fallback to defaults)
CHAIN_ID=$(cast chain-id 2>/dev/null)
if [ -z "$CHAIN_ID" ]; then
  CHAIN_ID="$DEFAULT_CHAIN_ID"
fi

BLOCK_NUMBER=$(cast block-number 2>/dev/null)
if [ -z "$BLOCK_NUMBER" ]; then
  BLOCK_NUMBER="$DEFAULT_BLOCK_ID"
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"
OUTPUT_FILE="$OUTPUT_DIR/${CHAIN_ID}_${BLOCK_NUMBER}.json"
LATEST_FILE="$OUTPUT_DIR/latest.json"

# Start JSON buffer
JSON_CONTENT="{"

# Extract FacetRegistry
REGISTRY_LINE=$(grep "FacetRegistry deployed at:" "$LOG_FILE")
if echo "$REGISTRY_LINE" | grep -qE '0x[a-fA-F0-9]{40}'; then
  ADDRESS=$(echo "$REGISTRY_LINE" | grep -oE '0x[a-fA-F0-9]{40}')
  JSON_CONTENT="$JSON_CONTENT\"FacetRegistry\": \"$ADDRESS\", "
fi

# Extract facets
for LINE in $(grep "Facet " "$LOG_FILE"); do
  echo "$LINE" >> /tmp/facet_lines.txt
done

while IFS= read -r line; do
  if echo "$line" | grep -qE "Facet [A-Za-z0-9]+ deployed at:"; then
    NAME=$(echo "$line" | awk '{print $2}')
    ADDRESS=$(echo "$line" | grep -oE '0x[a-fA-F0-9]{40}')
    JSON_CONTENT="$JSON_CONTENT\"$NAME\": \"$ADDRESS\", "
  fi
done < /tmp/facet_lines.txt

rm -f /tmp/facet_lines.txt

# Remove trailing comma and space
LAST_CHAR=$(echo "$JSON_CONTENT" | tail -c 3)
if [ "$LAST_CHAR" = ", " ]; then
  JSON_CONTENT=$(echo "$JSON_CONTENT" | sed 's/, $//')
fi

JSON_CONTENT="$JSON_CONTENT}"

# Write to files
echo "$JSON_CONTENT" > "$OUTPUT_FILE"
echo "$JSON_CONTENT" > "$LATEST_FILE"

echo "Saved to: $OUTPUT_FILE"
echo "Also saved to: $LATEST_FILE"
