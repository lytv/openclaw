#!/bin/bash

# Define paths
PV_BOT_MEM="/Users/mac/clawd/projects/pv/pvbot/memory"
UV_BOT_MEM="/Users/mac/clawd/projects/pv/uvbot/memory"
UV_BOT_INT="/Users/mac/clawd/projects/pv/uvbot/interviews"

echo "🛑 Stopping OpenClaw Gateway..."
launchctl stop ai.openclaw.gateway
sleep 2

# Force kill to ensure handle release
echo "🔫 Ensuring process is dead..."
pkill -f "ai.openclaw.gateway" || true
sleep 2

echo "🧹 Cleaning Bot Memory..."
# Clean pvbot memory
if [ -d "$PV_BOT_MEM" ]; then
    rm -rf "$PV_BOT_MEM"/*
    echo "   - Cleared pvbot memory"
fi

# Clean uvbot memory
if [ -d "$UV_BOT_MEM" ]; then
    rm -rf "$UV_BOT_MEM"/*
    echo "   - Cleared uvbot memory"
fi

# Clean uvbot interviews (optional, based on user request to wipe everything)
if [ -d "$UV_BOT_INT" ]; then
    rm -rf "$UV_BOT_INT"/*
    echo "   - Cleared uvbot internal interviews"
fi

echo "🧹 Cleaning Global Sessions Database..."
AGENT_SESSIONS="/Users/mac/.openclaw/agents"
if [ -d "$AGENT_SESSIONS" ]; then
    # Wipe all session folders for all agents
    rm -rf "$AGENT_SESSIONS"/*/sessions
    echo "   - Cleared ~/.openclaw/agents/*/sessions"
fi

echo "🧹 Cleaning Global Memory..."
GLOBAL_MEM="/Users/mac/.openclaw/memory"
if [ -d "$GLOBAL_MEM" ]; then
    rm -rf "$GLOBAL_MEM"/*
    echo "   - Cleared ~/.openclaw/memory"
fi

echo "🧹 Cleaning Global Transcripts..."
GLOBAL_TRANS="/Users/mac/.openclaw/transcripts"
if [ -d "$GLOBAL_TRANS" ]; then
    rm -rf "$GLOBAL_TRANS"/*
    echo "   - Cleared ~/.openclaw/transcripts"
fi

echo "🧹 Cleaning Telegram Offsets..."
TELE_OFFSETS="/Users/mac/.openclaw/telegram"
if [ -d "$TELE_OFFSETS" ]; then
    rm -f "$TELE_OFFSETS"/*.json
    echo "   - Cleared Telegram offsets"
fi


# Also clean any potential temp files in root if needed
# rm -f /Users/mac/clawd/projects/pv/uvbot/*.md (Keep config files!)

echo "✅ Memory Wiped."

echo "🚀 Restarting OpenClaw Gateway..."
launchctl start ai.openclaw.gateway
sleep 2

echo "🎉 Done! System is fresh. Larry and Sarah are ready."
