# 🚀 Quick Setup Guide

Step-by-step instructions to get OnePulse Arena running locally.

## ⏱️ Estimated Time: 15 minutes

---

## 1️⃣ Prerequisites Check

### Install Required Tools

```bash
# Check Node.js (need v18+)
node --version

# Check npm
npm --version

# Check Sui CLI
sui --version
```

If missing, install:
- **Node.js**: https://nodejs.org
- **Sui CLI**: https://docs.sui.io/b
uild/install

---

## 2️⃣ Install Dependencies

```bash
# Navigate to project
cd onepulsearena

# Install npm packages
npm install

# This installs:
# - React, TypeScript, Vite
# - @mysten/dapp-kit, @mysten/sui.js
# - Phaser 3, Zustand, Tailwind
# - Other dependencies
```

---

## 3️⃣ Configure Sui Wallet

### Create Sui Testnet Wallet

```bash
# Create new wallet
sui client new-address ed25519

# Switch to testnet
sui client switch --env testnet

# Check your address
sui client active-address
```

### Get Testnet Tokens

Option 1: **Discord Faucet**
```bash
# Join Sui Discord: https://discord.gg/sui
# Go to #testnet-faucet channel
# Type: !faucet <YOUR_ADDRESS>
```

Option 2: **CLI Faucet**
```bash
curl --location --request POST 'https://faucet.testnet.sui.io/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "<YOUR_ADDRESS>"
    }
}'
```

Verify balance:
```bash
sui client gas
```

---

## 4️⃣ Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your editor
nano .env  # or use VSCode
```

Update `.env`:
```env
# Use Sui testnet (default)
VITE_SUI_NETWORK=testnet
VITE_ONECHAIN_RPC_URL=https://fullnode.testnet.sui.io:443
VITE_ONECHAIN_WS_URL=wss://fullnode.testnet.sui.io:443

# Leave empty for now (filled after deployment)
VITE_PACKAGE_ID=

# Game config (optional changes)
VITE_PULSE_VALUE=100
VITE_PULSE_COOLDOWN_MS=1000
VITE_YIELD_RATE=0.0001
```

**Note**: For OneChain testnet RPC, contact their team on Telegram: https://t.me/hello_onechain

---

## 5️⃣ Deploy Smart Contracts

```bash
# Run deployment script
npm run deploy:move

# This will:
# ✓ Build Move contracts
# ✓ Run tests
# ✓ Deploy to testnet
# ✓ Save PACKAGE_ID to .env automatically
```

Expected output:
```
🎮 OnePulse Arena - Deployment Script
======================================
✅ Sui CLI found
📦 Building Move package...
✅ Build successful
🧪 Running tests...
🚀 Deploying to OneChain testnet...
✅ Deployment successful!

📝 Deployment Details:
======================
Package ID: 0xabcd1234...

✅ Package ID saved to .env
```

---

## 6️⃣ Start Frontend

```bash
# Start development server
npm run dev
```

Output:
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

Open browser: **http://localhost:5173**

---

## 7️⃣ Install Browser Wallet

### Sui Wallet Extension

1. Install Sui Wallet: https://chrome.google.com/webstore (search "Sui Wallet")
2. Create or import wallet
3. Switch to **Testnet** network in wallet settings
4. Fund with testnet tokens (use faucet)

### Alternative: OneWallet

Contact OneChain team for OneWallet installation instructions.

---

## 8️⃣ Play the Game!

### First Time Setup

1. **Connect Wallet**
   - Click "Connect with OneWallet" button
   - Approve connection in wallet popup

2. **Create Profile**
   - Click "Create Profile" button
   - Approve transaction (~0.05 SUI gas)
   - Wait for confirmation (~2 seconds)

3. **Start Playing**
   - Use **Arrow Keys** to move
   - Press **SPACE** to pulse
   - Each pulse costs gas (~0.001 SUI)

### Testing Multiplayer

1. Open **second browser tab** (or incognito)
2. Connect **different wallet**
3. Create profile
4. Watch **Live Feed** update across both tabs!

---

## 🐛 Troubleshooting

### Issue: "Sui CLI not found"

**Solution**:
```bash
# Install Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

Or download binaries: https://docs.sui.io/build/install

---

### Issue: "Insufficient gas"

**Solution**:
```bash
# Get more testnet tokens
sui client faucet

# Check balance
sui client gas
```

---

### Issue: "Package ID not found"

**Solution**:
```bash
# Re-run deployment
npm run deploy:move

# Manually add PACKAGE_ID to .env if needed
```

---

### Issue: "Cannot connect wallet"

**Solution**:
1. Refresh page
2. Check wallet is on **testnet** network
3. Try clearing browser cache
4. Use incognito mode

---

### Issue: "Live Feed not updating" or "Events not appearing"

**Symptoms**:
- Live Feed shows "Offline" status
- No pulse events appearing in the feed
- Error count increasing

**Root Cause**:
The app uses **polling mode** (fetches events every 3 seconds) instead of WebSocket for better reliability with public RPC endpoints.

**Solutions**:

1. **Verify RPC Configuration**:
   ```bash
   # Make sure .env has correct RPC URL
   VITE_ONECHAIN_RPC_URL=https://fullnode.testnet.sui.io

   # Clear cache and restart
   rm -rf node_modules/.vite dist
   npm run dev
   ```

2. **Check Package ID**:
   ```bash
   # Ensure PACKAGE_ID is set in .env
   cat .env | grep VITE_PACKAGE_ID

   # If empty, redeploy contracts
   npm run deploy:move
   ```

3. **Test Event Queries**:
   Open browser console and look for:
   - `🔄 Event polling started (interval: 3s)` - Polling is active
   - `🔧 Sui Configuration` - Shows your RPC URL and Package ID
   - No repeated error messages about event fetching

4. **For Production - Use Dedicated RPC** (Optional):

   For higher reliability and lower latency, consider using a dedicated RPC provider:
   - **Shinami**: https://www.shinami.com/ (Free tier available)
   - **BlockVision**: https://blockvision.org/
   - **Nodeinfra**: https://nodeinfra.com/

   Update `.env`:
   ```bash
   VITE_ONECHAIN_RPC_URL=https://your-dedicated-rpc-url
   ```

**Note**: The app uses **polling, NOT WebSocket** for reliability. Events update every 3 seconds automatically.

---

### Issue: "Transaction failed"

**Solution**:
- Check wallet has sufficient SUI (~0.1 SUI minimum)
- Verify PACKAGE_ID is correct in .env
- Check Sui Explorer for transaction details
- Wait 5 seconds and try again

---

## 🎯 Next Steps

### Development

- **Edit Smart Contracts**: `contracts/sources/`
- **Modify Frontend**: `src/components/`, `src/App.tsx`
- **Customize Game**: `src/game/OnePulseGame.ts`
- **Adjust Styling**: `src/index.css`, `tailwind.config.js`

### Testing

```bash
# Test Move contracts
npm run test:move

# Lint frontend
npm run lint

# Build for production
npm run build
```

### Deployment

- **Testnet**: Already deployed with setup
- **Mainnet**: Update .env to use mainnet RPC
- **Vercel/Netlify**: Use `npm run build`, deploy `dist/` folder

---

## 📚 Additional Resources

- **Full Documentation**: See [README.md](README.md)
- **Demo Script**: See [DEMO_SCRIPT.md](DEMO_SCRIPT.md)
- **Sui Docs**: https://docs.sui.io
- **OneChain Support**: https://t.me/hello_onechain

---

## ✅ Setup Checklist

Use this to track your progress:

- [ ] Node.js v18+ installed
- [ ] Sui CLI installed
- [ ] npm dependencies installed
- [ ] Sui wallet created
- [ ] Testnet SUI tokens acquired
- [ ] .env file configured
- [ ] Smart contracts deployed
- [ ] Frontend running at localhost:5173
- [ ] Browser wallet installed
- [ ] Wallet connected to app
- [ ] Player profile created
- [ ] Successfully triggered pulse action
- [ ] Multiplayer tested with 2 tabs

---

**Setup complete! You're ready to build on OnePulse Arena! 🎮⚡**

Need help? Open an issue on GitHub or contact OneChain support.
