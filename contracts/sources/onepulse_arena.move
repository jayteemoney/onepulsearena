/// OnePulse Arena - Core game module for real-time multiplayer GameFi
/// Handles player profiles, pulse actions, and score tracking with yield mechanics
module onepulse::onepulse_arena {
    use sui::object::UID;
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};

    // ======== Constants ========
    const PULSE_VALUE: u64 = 100;
    const PULSE_COOLDOWN_MS: u64 = 1000; // 1 second cooldown
    const YIELD_RATE: u64 = 100; // 1% per pulse (basis points)

    // ======== Errors ========
    const ENotOwner: u64 = 0;
    const EPulseCooldown: u64 = 1;
    const EInsufficientYield: u64 = 2;

    // ======== Structs ========

    /// Admin capability for game management
    public struct GameAdmin has key, store {
        id: UID,
    }

    /// Player profile with score and yield tracking
    public struct PlayerProfile has key, store {
        id: UID,
        player: address,
        score: u64,
        total_pulses: u64,
        yield_accrued: u64,
        last_pulse_timestamp: u64,
        created_at: u64,
    }

    /// Shared game state for global tracking
    public struct GameState has key {
        id: UID,
        total_players: u64,
        total_pulses: u64,
        total_yield_distributed: u64,
        vault: Balance<SUI>,
    }

    // ======== Events ========

    /// Emitted when a player performs a pulse action
    public struct PulseAction has copy, drop {
        player: address,
        profile_id: ID,
        action_type: vector<u8>,
        value: u64,
        new_score: u64,
        yield_earned: u64,
        timestamp: u64,
    }

    /// Emitted when a player claims yield
    public struct YieldClaimed has copy, drop {
        player: address,
        profile_id: ID,
        amount: u64,
        timestamp: u64,
    }

    /// Emitted when a new player joins
    public struct PlayerJoined has copy, drop {
        player: address,
        profile_id: ID,
        timestamp: u64,
    }

    // ======== Initialize ========

    /// Initialize the game with admin capability and game state
    fun init(ctx: &mut TxContext) {
        use sui::object;
        use sui::tx_context;
        // Create admin capability
        let admin = GameAdmin {
            id: object::new(ctx),
        };

        // Create shared game state
        let game_state = GameState {
            id: object::new(ctx),
            total_players: 0,
            total_pulses: 0,
            total_yield_distributed: 0,
            vault: balance::zero(),
        };

        transfer::transfer(admin, tx_context::sender(ctx));
        transfer::share_object(game_state);
    }

    // ======== Public Entry Functions ========

    /// Create a new player profile
    public fun create_player_profile(
        game_state: &mut GameState,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        use sui::object;
        use sui::tx_context;
        let player = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        let profile = PlayerProfile {
            id: object::new(ctx),
            player,
            score: 0,
            total_pulses: 0,
            yield_accrued: 0,
            last_pulse_timestamp: 0,
            created_at: timestamp,
        };

        let profile_id = object::id(&profile);

        // Update game state
        game_state.total_players = game_state.total_players + 1;

        // Emit event
        event::emit(PlayerJoined {
            player,
            profile_id,
            timestamp,
        });

        transfer::transfer(profile, player);
    }

    /// Record a pulse action (main game interaction)
    public fun record_pulse(
        profile: &mut PlayerProfile,
        game_state: &mut GameState,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        use sui::object;
        use sui::tx_context;
        let player = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Verify ownership
        assert!(profile.player == player, ENotOwner);

        // Check cooldown
        assert!(
            timestamp >= profile.last_pulse_timestamp + PULSE_COOLDOWN_MS,
            EPulseCooldown
        );

        // Update scores
        profile.score = profile.score + PULSE_VALUE;
        profile.total_pulses = profile.total_pulses + 1;
        profile.last_pulse_timestamp = timestamp;

        // Calculate yield (basis points)
        let yield_earned = (PULSE_VALUE * YIELD_RATE) / 10000;
        profile.yield_accrued = profile.yield_accrued + yield_earned;

        // Update global state
        game_state.total_pulses = game_state.total_pulses + 1;

        // Emit event for real-time sync
        event::emit(PulseAction {
            player,
            profile_id: object::id(profile),
            action_type: b"PULSE",
            value: PULSE_VALUE,
            new_score: profile.score,
            yield_earned,
            timestamp,
        });
    }

    /// Claim accrued yield (mock implementation for testnet)
    public fun claim_yield(
        profile: &mut PlayerProfile,
        game_state: &mut GameState,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        use sui::object;
        use sui::tx_context;
        let player = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        assert!(profile.player == player, ENotOwner);
        assert!(profile.yield_accrued > 0, EInsufficientYield);

        let amount = profile.yield_accrued;
        profile.yield_accrued = 0;

        // Update global tracking
        game_state.total_yield_distributed = game_state.total_yield_distributed + amount;

        event::emit(YieldClaimed {
            player,
            profile_id: object::id(profile),
            amount,
            timestamp,
        });

        // Note: In production, this would transfer actual tokens from vault
        // For MVP, we just track the yield amount
    }

    /// Fund the game vault (admin function for yield distribution)
    public fun fund_vault(
        _admin: &GameAdmin,
        game_state: &mut GameState,
        payment: Coin<SUI>,
    ) {
        let amount = coin::into_balance(payment);
        balance::join(&mut game_state.vault, amount);
    }

    // ======== View Functions ========

    /// Get player score
    public fun get_player_score(profile: &PlayerProfile): u64 {
        profile.score
    }

    /// Get player total pulses
    public fun get_player_pulses(profile: &PlayerProfile): u64 {
        profile.total_pulses
    }

    /// Get player accrued yield
    public fun get_player_yield(profile: &PlayerProfile): u64 {
        profile.yield_accrued
    }

    /// Get player address
    public fun get_player_address(profile: &PlayerProfile): address {
        profile.player
    }

    /// Get game statistics
    public fun get_game_stats(game_state: &GameState): (u64, u64, u64) {
        (
            game_state.total_players,
            game_state.total_pulses,
            game_state.total_yield_distributed
        )
    }

    // ======== Test Functions ========

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
