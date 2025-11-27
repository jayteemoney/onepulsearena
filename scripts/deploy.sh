#!/bin/bash

# OnePulse Arena - Deployment Script for OneChain Testnet
# Make sure Sui CLI is installed and configured

set -e

echo "🎮 OnePulse Arena - Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo -e "${RED}❌ Sui CLI not found. Please install it first.${NC}"
    echo "Visit: https://docs.sui.io/build/install"
    exit 1
fi

echo -e "${GREEN}✅ Sui CLI found${NC}"

# Check if we're in the right directory
if [ ! -d "contracts" ]; then
    echo -e "${RED}❌ contracts/ directory not found. Run this from project root.${NC}"
    exit 1
fi

# Build the Move package
echo ""
echo "📦 Building Move package..."
cd contracts

sui move build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Run tests
echo ""
echo "🧪 Running tests..."
sui move test

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Some tests failed, but continuing...${NC}"
fi

# Deploy to testnet
echo ""
echo "🚀 Deploying to OneChain testnet..."
echo -e "${YELLOW}Note: Make sure you have testnet SUI tokens in your wallet${NC}"
echo -e "${YELLOW}Get testnet tokens: https://discord.gg/sui${NC}"
echo ""

# Deploy with gas budget
DEPLOY_OUTPUT=$(sui client publish --gas-budget 100000000 --json 2>&1)

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Deployment successful!${NC}"

# Parse deployment output
PACKAGE_ID=$(echo "$DEPLOY_OUTPUT" | jq -r '.objectChanges[] | select(.type == "published") | .packageId')

echo ""
echo "📝 Deployment Details:"
echo "======================"
echo -e "Package ID: ${GREEN}${PACKAGE_ID}${NC}"

# Extract shared object IDs
GAME_STATE_ID=$(echo "$DEPLOY_OUTPUT" | jq -r '.objectChanges[] | select(.objectType | contains("::onepulse_arena::GameState")) | .objectId')
GLOBAL_LEADERBOARD_ID=$(echo "$DEPLOY_OUTPUT" | jq -r '.objectChanges[] | select(.objectType | contains("::leaderboard::GlobalLeaderboard")) | .objectId')
DAILY_LEADERBOARD_ID=$(echo "$DEPLOY_OUTPUT" | jq -r '.objectChanges[] | select(.objectType | contains("::leaderboard::DailyLeaderboard")) | .objectId')

echo -e "GameState ID: ${GREEN}${GAME_STATE_ID}${NC}"
echo -e "Global Leaderboard ID: ${GREEN}${GLOBAL_LEADERBOARD_ID}${NC}"
echo -e "Daily Leaderboard ID: ${GREEN}${DAILY_LEADERBOARD_ID}${NC}"

# Save to .env file
cd ..
if [ -f ".env" ]; then
    # Update existing .env
    sed -i.bak "s/VITE_PACKAGE_ID=.*/VITE_PACKAGE_ID=${PACKAGE_ID}/" .env
    sed -i.bak "s/VITE_GAME_STATE_ID=.*/VITE_GAME_STATE_ID=${GAME_STATE_ID}/" .env
    sed -i.bak "s/VITE_GLOBAL_LEADERBOARD_ID=.*/VITE_GLOBAL_LEADERBOARD_ID=${GLOBAL_LEADERBOARD_ID}/" .env
    sed -i.bak "s/VITE_DAILY_LEADERBOARD_ID=.*/VITE_DAILY_LEADERBOARD_ID=${DAILY_LEADERBOARD_ID}/" .env
    rm -f .env.bak*
else
    # Create new .env from example
    cp .env.example .env
    sed -i.bak "s/VITE_PACKAGE_ID=.*/VITE_PACKAGE_ID=${PACKAGE_ID}/" .env
    sed -i.bak "s/VITE_GAME_STATE_ID=.*/VITE_GAME_STATE_ID=${GAME_STATE_ID}/" .env
    sed -i.bak "s/VITE_GLOBAL_LEADERBOARD_ID=.*/VITE_GLOBAL_LEADERBOARD_ID=${GLOBAL_LEADERBOARD_ID}/" .env
    sed -i.bak "s/VITE_DAILY_LEADERBOARD_ID=.*/VITE_DAILY_LEADERBOARD_ID=${DAILY_LEADERBOARD_ID}/" .env
    rm -f .env.bak*
fi

echo -e "${GREEN}✅ All IDs saved to .env${NC}"

# Extract object IDs
echo ""
echo "📋 Created Objects:"
echo "==================="
echo "$DEPLOY_OUTPUT" | jq -r '.objectChanges[] | select(.objectType) | "\(.objectType): \(.objectId)"'

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Start the frontend: npm run dev"
echo "2. Connect your OneWallet"
echo "3. Start playing OnePulse Arena!"
echo ""
echo "📚 View on Sui Explorer:"
echo "https://suiexplorer.com/object/${PACKAGE_ID}?network=testnet"
