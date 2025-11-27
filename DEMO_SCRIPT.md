# 🎬 OnePulse Arena - Demo Script (3 Minutes)

**Hackathon Submission**: OneHack 2025 - GameFi Category

---

## 📋 Overview

This script provides a timestamped walkthrough for demonstrating OnePulse Arena's key features to hackathon judges. Total duration: ~3 minutes.

---

## 🎥 Script Breakdown

### **0:00 - 0:30** | Introduction & Setup

**Visual**: Title screen with OneChain branding

**Narration**:
> "OnePulse Arena is a real-time multiplayer blockchain game built on OneChain using Sui Move. It showcases all five OneChain pillars: Speed, Scalability, Security, Accessibility, and Innovation."

**Actions**:
1. Show running app at `http://localhost:5173`
2. Highlight welcome screen with:
   - ⚡ Speed (~100-200ms latency)
   - 🔒 Security (Move resources)
   - 💰 GameFi (Yield generation)

**Terminal** (picture-in-picture):
```bash
# Show package deployed on testnet
echo "Package ID: 0x0f478db408b570e00a0231af1314a03710091b4f650db197d3da1579298f537f"
```

**Key Point**: "All contracts are deployed and verified on Sui testnet."

---

### **0:30 - 1:30** | Technical Walkthrough

**Visual**: VSCode split screen showing Move contracts

**Actions**:
1. Open `contracts/sources/onepulse_arena.move`
2. Highlight key functions (10 seconds each):
   ```move
   public struct PlayerProfile has key, store {
       score: u64,
       total_pulses: u64,
       yield_accrued: u64,  // GameFi innovation
   }
   
   public fun record_pulse(...) {
       // +100 score, 1% yield per pulse
   }
   ```

3. Show `achievement_nft.move`
   ```move
   public struct PulseAchievement has key { ... }
   // Soulbound NFTs for milestones
   ```

**Narration**:
> "We use Move's resource model for secure asset ownership. Each pulse action triggers an on-chain transaction that updates the player's score and accrues yield - true GameFi mechanics integrated into gameplay."

**Terminal Commands** (show output):
```bash
# Prove contracts compile and pass tests
cd contracts
sui move test

# Output shows:
# [ PASS ] test_create_profile
# [ PASS ] test_record_pulse  
# [ PASS ] test_pulse_cooldown
```

**Key Point**: "All Move contracts pass unit tests. Deployment cost: ~0.05 SUI."

---

### **1:30 - 2:30** | Live Gameplay Demo

**Visual**: Full-screen game interface

**Actions**:
1. **Connect Wallet** (0:05)
   - Click "Connect with OneWallet"
   - Approve in Sui Wallet extension
   - Show connected address

2. **Create Profile** (0:10)
   - Click "Create Profile" button
   - Show transaction in wallet
   - Approve (~0.05 SUI gas)
   - Toast notification: "Profile created successfully!"

3. **Play Game** (0:30)
   - Use arrow keys to move character
   - Press SPACE to pulse (3-4 times)
   - Each pulse shows:
     - Toast: "+100 points! ⚡"
     - Score updates immediately
     - Yield accrues (+1 per pulse)
   
4. **Live Feed Updates** (0:15)
   - Show Live Feed panel populating in real-time
   - Timestamp each action (<1 second delay)
   - Highlight "LIVE" indicator

**Narration**:
> "Notice the instant feedback - each pulse confirms on OneChain in under 200 milliseconds. The Live Feed shows all players' actions in real-time using Sui's event streaming."

**Key Point**: "This demonstrates OneChain's Speed and Scalability pillars."

---

### **2:30 - 3:00** | GameFi Features

**Visual**: Focus on bottom UI panels

**Actions**:
1. **Yield Claiming** (0:10)
   - Scroll to "Claim Yield" button
   - Hover to show tooltip: "Earn 1% yield per pulse • GameFi mechanics"
   - Click "Claim Yield (5)"
   - Approve transaction
   - Toast: "Yield claimed! 💰"
   - Yield counter resets to 0

2. **Achievement Milestones** (0:15)
   - Show Achievement panel
   - Highlight "First Pulse" milestone (1/1 pulses) ✓ Eligible
   - Click "Mint NFT" button
   - Approve transaction
   - Toast: "Achievement 'First Pulse' minted! 🏆"
   - Panel updates to show "✓ Owned"
   - Explain: "This NFT is now in your wallet - verifiable on-chain"

3. **Leaderboard** (0:05)
   - Show Global Leaderboard ranking
   - Highlight real-time position updates

**Narration**:
> "The GameFi features include yield generation from gameplay and NFT achievements tied to milestones - similar to RWA tokenization. These assets are true Move objects with provable ownership."

**Key Point**: "Innovation pillar: Yield + NFTs = GameFi aligned with OneChain's vision."

---

## 🎯 Closing (Optional +0:10)

**Visual**: GitHub repository README

**Actions**:
- Quick scroll through README.md
- Show badges (OneHack 2025, Sui, MIT License)
- Highlight project structure
- Point to submission form link

**Narration**:
> "Full source code, deployment scripts, and documentation are available on GitHub under MIT license. Built entirely during the OneHack hackathon period."

**Final Screen**:
```
OnePulse Arena
✅ Real-time multiplayer
✅ Sui Move contracts
✅ GameFi mechanics
✅ Open source (MIT)

GitHub: jayteemoney/onepulse-arena
```

---

## 📸 Screenshot Checklist

Capture these moments for README/submission:

- [ ] Welcome screen with OneChain pillars
- [ ] VSCode showing Move contracts
- [ ] Terminal with passing tests
- [ ] Wallet connection flow
- [ ] Game canvas with player
- [ ] Live Feed with real-time updates
- [ ] Claim Yield button + tooltip
- [ ] Achievement NFT minting
- [ ] Leaderboard rankings
- [ ] GitHub README

---

## 🛠️ Pre-Recording Setup

1. **Environment**:
   ```bash
   # Ensure dev server is running
   npm run dev
   
   # Open browser
   open http://localhost:5173
   ```

2. **Wallet**:
   - Sui Wallet installed and on testnet
   - At least 0.5 SUI for transactions
   - Fresh account (no prior profile)

3. **VSCode**:
   - Open `contracts/sources/` folder
   - Set color theme for visibility
   - Zoom level: 125%

4. **Recording Software**:
   - OBS Studio / QuickTime / Loom
   - Resolution: 1920x1080 @ 30fps
   - Audio: Clear microphone for narration

5. **Browser**:
   - Clear cache and localStorage
   - Close extra tabs
   - Full screen for game view

---

## ⏱️ Timing Notes

- **Total**: ~3:00 (max 3:30 acceptable)
- **Pacing**: Speak clearly, not rushed
- **Pauses**: Add 2-second pauses after transactions confirm
- **Cuts**: Can cut 0-10 seconds if over time (cut closing GitHub tour)

---

## 🎬 Recording Tips

1. **Practice Run First**: Do a full dress rehearsal to catch issues
2. **Narration**: Record audio separately if needed for clarity
3. **Mouse Highlights**: Use OBS cursor highlighting for visibility
4. **Transactions**: Have backup wallet in case tx fails
5. **Fallback**: If demo breaks, have screenshots ready

---

## 📤 Submission Checklist

- [ ] Video recorded (exactly 3 minutes)
- [ ] Video uploaded (YouTube/Loom unlisted link)
- [ ] GitHub repo public
- [ ] README updated with video embed
- [ ] Screenshots added to README
- [ ] Form submitted: https://forms.gle/mMdFhRbtDwLJRnQy7

---

**Ready to record? Good luck! 🚀**
