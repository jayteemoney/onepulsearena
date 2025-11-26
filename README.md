# ⚡ OnePulse Arena

**Real-Time Multiplayer GameFi on OneChain (Sui/Move Edition)**

A cyberpunk-themed blockchain game featuring instant on-chain transactions, yield generation, and real-time multiplayer synchronization powered by Sui's Move language on OneChain.

![OnePulse Arena](https://img.shields.io/badge/OneHack-2025-blue) ![Sui](https://img.shields.io/badge/Sui-Move-6fbcf0) ![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎮 About

OnePulse Arena is a hackathon project built for **OneHack 2025**, showcasing OneChain's five core pillars:

- ⚡ **Speed**: ~100-200ms transaction confirmations
- 📈 **Scalability**: Sui's parallel execution for 1000+ concurrent players
- 🔒 **Security**: Move's resource-based ownership model
- 🌐 **Accessibility**: Gas abstraction & social wallet integration
- 💰 **Innovation**: GameFi mechanics with yield generation

### Features

✅ **Real-time multiplayer** game with Phaser 3 engine
✅ **Move smart contracts** for secure asset handling
✅ **OneWallet integration** via @mysten/dapp-kit
✅ **Live event streaming** using Sui's WebSocket subscriptions
✅ **Global & daily leaderboards** updated in real-time
✅ **Yield generation** from gameplay (mock USDO rewards)
✅ **Achievement NFTs** (soulbound + tradeable)
✅ **Cyberpunk aesthetic** with neon visuals

---

## 🏗️ Tech Stack

### Blockchain
- **Language**: Move (Sui framework)
- **Network**: OneChain Testnet (Sui-compatible)
- **Tools**: Sui CLI v1.x

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (cyberpunk theme)
- **Game Engine**: Phaser 3
- **State**: Zustand

### Integration
- **Wallet**: @mysten/dapp-kit (OneWallet support)
- **SDK**: @mysten/sui.js
- **Events**: Sui WebSocket subscriptions

---

## 📁 Project Structure

```
onepulse-arena/
├── contracts/                  # Move smart contracts
│   ├── sources/
│   │   ├── onepulse_arena.move    # Core game logic
│   │   ├── leaderboard.move       # Leaderboard tracking
│   │   └── achievement_nft.move   # NFT achievements
│   ├── tests/
│   │   └── onepulse_arena_tests.move
│   └── Move.toml
├── src/
│   ├── components/            # React components
│   │   ├── WalletConnect.tsx
│   │   ├── GameCanvas.tsx
│   │   ├── Leaderboard.tsx
│   │   └── LiveFeed.tsx
│   ├── hooks/                 # Custom hooks
│   │   ├── useOnePulseArena.ts   # Contract interactions
│   │   └── useSuiEventStream.ts  # Event subscriptions
│   ├── game/                  # Phaser game logic
│   │   └── OnePulseGame.ts
│   ├── stores/
│   │   └── gameStore.ts       # Zustand state
│   ├── config/
│   │   └── sui.ts             # Network config
│   ├── App.tsx
│   └── main.tsx
├── scripts/
│   └── deploy.sh              # Deployment script
├── package.json
├── Move.toml
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

1. **Node.js** v18+ and npm/yarn
2. **Sui CLI** installed ([guide](https://docs.sui.io/build/install))
3. **OneWallet** or Sui-compatible wallet
4. **Testnet SUI tokens** (get from [Discord](https://discord.gg/sui))

### Installation

```bash
# Clone the repository
git clone https://github.com/jayteemoney/onepulse-arena.git
cd onepulse-arena

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Configure OneChain Testnet

Contact OneChain team for testnet RPC endpoints:
🔗 Telegram: https://t.me/hello_onechain

Update `.env`:
```env
VITE_ONECHAIN_RPC_URL=https://testnet.onechain.example.com
VITE_ONECHAIN_WS_URL=wss://testnet.onechain.example.com
```

Or use default Sui testnet:
```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
```

### Deploy Smart Contracts

```bash
# Build and deploy Move contracts
npm run deploy:move

# This will:
# 1. Build contracts with sui move build
# 2. Run tests with sui move test
# 3. Deploy to testnet
# 4. Save PACKAGE_ID to .env
```

### Run Frontend

```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

---

## 🎯 How to Play

1. **Connect Wallet**: Click "Connect with OneWallet"
2. **Create Profile**: One-time transaction to mint PlayerProfile NFT
3. **Move**: Use **Arrow Keys** to navigate the cyberpunk arena
4. **Pulse**: Press **SPACE** to trigger pulse action
   - Scores +100 points
   - Generates yield (0.01% per pulse)
   - Submits transaction to OneChain
5. **Compete**: Watch live feed and climb the leaderboard!

---

## 🔧 Smart Contract Details

### OnePulseArena Module

**Key Functions**:
- `create_player_profile()`: Mints PlayerProfile NFT
- `record_pulse()`: Records pulse action (+100 score, yield accrual)
- `claim_yield()`: Claims accrued yield
- `get_player_score()`: View function for score

**Events**:
- `PulseAction`: Emitted on each pulse (real-time sync)
- `PlayerJoined`: New player registration
- `YieldClaimed`: Yield withdrawal

### Leaderboard Module

**Features**:
- Global leaderboard (all-time)
- Daily leaderboard (24h reset)
- Auto-ranking system
- Real-time event emissions

### Achievement NFT Module

**NFT Types**:
- **Soulbound**: "First Pulse", "Pulse Master", "Pulse Legend"
- **Tradeable**: Yield Cards with boost multipliers

---

## 🌐 Real-Time Architecture

```
Player Action (SPACE)
    ↓
Phaser Game Scene
    ↓
useOnePulseArena.recordPulse()
    ↓
Sui Transaction Block
    ↓
OneChain Validator (~100ms)
    ↓
Move Module: record_pulse()
    ↓
Emit PulseAction Event
    ↓
WebSocket Subscription
    ↓
useSuiEventStream hook
    ↓
Update All Clients (Live Feed + Leaderboard)
```

**Total Latency**: ~100-200ms player-to-player

---

## 🧪 Testing

### Move Contracts

```bash
cd contracts
sui move test

# Run specific test
sui move test test_record_pulse
```

### Frontend (Manual)

1. Open multiple browser tabs
2. Connect different wallets
3. Trigger pulses → observe live feed updates
4. Verify leaderboard synchronization

---

## 🛠️ Development

### Build Frontend

```bash
npm run build

# Preview production build
npm run preview
```

### Lint

```bash
npm run lint
```

### Environment Variables

See `.env.example` for all configuration options.

---

## 📊 GameFi Mechanics

### Yield Generation

- **Rate**: 0.0001% per pulse (configurable)
- **Accrual**: Stored in PlayerProfile resource
- **Claiming**: Gas-abstracted withdrawal (testnet)
- **Future**: Integration with OneChain's RWA/USDO yield vaults

### Leaderboard Rewards (Planned)

- Daily winner: Bonus yield multiplier
- Top 10: Exclusive yield card NFTs
- Milestones: Soulbound achievement badges

---

## 🎨 Cyberpunk Theme

Inspired by OneChain's finance-meets-tech branding:

- **Neon Blue** (#00F5FF): Primary actions, Sui branding
- **Neon Pink** (#FF006E): Pulse effects, highlights
- **Neon Purple** (#8B5CF6): Secondary UI, leaderboard
- **Neon Green** (#00FF41): Yield, success states
- **Cyber Dark** (#0A0E27): Background

---

## 🏆 Hackathon Submission

### OneHack 2025 Details

- **Category**: GameFi
- **Build Phase**: Nov 21-28, 2025
- **Submission**: Dec 4, 2025
- **Form**: https://forms.gle/mMdFhRbtDwLJRnQy7

### Eligibility

✅ Original code developed during hackathon period
✅ Uses Move on OneChain (Sui-compatible)
✅ Integrates OneWallet via dapp-kit
✅ Real-time gameplay with on-chain sync
✅ GameFi mechanics (yield generation)
✅ Open-source (MIT license)

### Demo Video Script (3 minutes)

**0:00-0:30** - Introduction
- Show title screen + OneChain branding
- Explain concept: "Real-time multiplayer GameFi"

**0:30-1:30** - Technical Walkthrough
- Show Move contracts in editor
- Highlight key functions: `record_pulse()`, events
- Demonstrate Sui CLI deployment

**1:30-2:30** - Live Gameplay
- Connect OneWallet
- Create player profile
- Play game: move, pulse, show live feed updates
- Demonstrate real-time leaderboard sync

**2:30-3:00** - GameFi Features
- Show yield accrual
- Claim yield transaction
- Display achievement NFTs
- Closing: GitHub repo + OneChain logo

---

## 🔗 Links

- **GitHub**: https://github.com/jayteemoney/onepulse-arena
- **OneChain Docs**: (via Telegram support)
- **Sui Docs**: https://docs.sui.io
- **Original NEONSYNC**: https://github.com/jayteemoney/neonsync
- **OneMatch Reference**: (hackathon repo shared by prompt)

---

## 📝 License

MIT License - see [LICENSE](LICENSE)

Built with ❤️ for OneHack 2025

---

## 🙏 Acknowledgments

- **OneChain Team**: For hackathon support and testnet access
- **Mysten Labs**: For Sui framework and dApp Kit
- **Phaser Community**: For game engine
- **NEONSYNC**: Original inspiration for real-time gameplay

---

## 🐛 Known Issues & Roadmap

### Current Limitations (MVP)

- Leaderboard uses simplified ranking (O(n) insertion)
- Yield is mock (no actual token distribution on testnet)
- No gas sponsorship integration yet
- Single-room multiplayer (no sharding)

### Future Enhancements

- [ ] zkLogin for social wallet onboarding
- [ ] Gas-abstracted transactions via relayer
- [ ] Multi-room support for 1000+ players
- [ ] Integration with OneDEX for yield swaps
- [ ] Persistent game state with Sui's dynamic fields
- [ ] Mobile-responsive design
- [ ] Spectator mode with real-time replay

---

## 📞 Support

For questions or issues:

1. Open an issue on [GitHub](https://github.com/jayteemoney/onepulse-arena/issues)
2. Contact OneChain support: https://t.me/hello_onechain
3. Sui Discord: https://discord.gg/sui

---

**Built for OneHack 2025 | Powered by OneChain + Sui Move**
