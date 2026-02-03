#!/usr/bin/env bash
# Script: telegram-groups.sh
# Hiển thị các Telegram group IDs từ gateway logs

set -euo pipefail

LOG_DIR="${OPENCLAW_LOG_DIR:-$HOME/.openclaw/logs}"
TMP_LOG="/tmp/openclaw/openclaw-$(date +%Y-%m-%d).log"

echo "=== Telegram Group IDs ==="
echo ""

# Search across all log files including /tmp
found=0
declare -A seen_ids

for log_file in "$LOG_DIR"/gateway.log "$LOG_DIR"/node.log "$TMP_LOG"; do
  if [[ -f "$log_file" ]]; then
    # Extract group IDs from session keys like "telegram:group:-5013557662"
    while IFS= read -r id; do
      if [[ -n "$id" && -z "${seen_ids[$id]:-}" ]]; then
        seen_ids[$id]=1
        found=1
        echo "  $id"
      fi
    done < <(grep -oE "telegram:group:-[0-9]+" "$log_file" 2>/dev/null | sed 's/telegram:group://' | sort -u || true)

    # Also extract from chatId fields
    while IFS= read -r id; do
      if [[ -n "$id" && -z "${seen_ids[$id]:-}" ]]; then
        seen_ids[$id]=1
        found=1
        echo "  $id"
      fi
    done < <(grep -oE '"chatId":-[0-9]+' "$log_file" 2>/dev/null | sed 's/"chatId"://' | sort -u || true)
  fi
done

echo ""

if [[ $found -eq 0 ]]; then
  echo "No group IDs found in logs."
  echo "Send a message in a Telegram group first, then run this script again."
  exit 0
fi

echo "=== How to Configure ==="
echo ""
echo "1. Copy the group ID (e.g., -5013557662)"
echo ""
echo "2. Edit ~/.openclaw/openclaw.json and add under channels.telegram.groups:"
echo ""
cat << 'EXAMPLE'
   {
     "channels": {
       "telegram": {
         "groups": {
           "-5013557662": {
             "systemPrompt": "# Project: DomeApp\n\nYou are working on DomeApp project.\n\n## Context\n- Tech stack: ...\n- Current sprint: ..."
           }
         }
       }
     }
   }
EXAMPLE
echo ""
echo "3. Gateway will hot-reload config automatically (no restart needed)"
