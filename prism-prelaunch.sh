#!/usr/bin/env bash
set -euo pipefail

PACK_DIR="$HOME/minecraft/modpacks/Bio-Magic"
PORT=8080

cd "$PACK_DIR"
packwiz serve -p "$PORT" &
SERVE_PID=$!
trap 'kill "$SERVE_PID" 2>/dev/null || true' EXIT

for _ in {1..40}; do
  curl -sf "http://localhost:$PORT/pack.toml" -o /dev/null && break
  sleep 0.25
done

cd "$INST_MC_DIR"
"$INST_JAVA" -jar packwiz-installer-bootstrap.jar "http://localhost:$PORT/pack.toml"
