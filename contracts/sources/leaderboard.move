/// Leaderboard Module - Global and daily leaderboard tracking
module onepulse::leaderboard {
    use sui::object::UID;
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};

    // ======== Constants ========
    const MAX_LEADERBOARD_SIZE: u64 = 100;
    const DAY_IN_MS: u64 = 86400000; // 24 hours in milliseconds

    // ======== Structs ========

    /// Leaderboard entry
    public struct LeaderboardEntry has store, copy, drop {
        player: address,
        profile_id: ID,
        score: u64,
        total_pulses: u64,
        last_updated: u64,
    }

    /// Global leaderboard (all-time)
    public struct GlobalLeaderboard has key {
        id: UID,
        entries: Table<address, LeaderboardEntry>,
        top_players: vector<address>,
        last_updated: u64,
    }

    /// Daily leaderboard (resets every 24h)
    public struct DailyLeaderboard has key {
        id: UID,
        day_start: u64,
        entries: Table<address, LeaderboardEntry>,
        top_players: vector<address>,
        last_reset: u64,
    }

    // ======== Events ========

    /// Emitted when leaderboard is updated
    public struct LeaderboardUpdated has copy, drop {
        player: address,
        score: u64,
        rank: u64,
        leaderboard_type: vector<u8>, // "GLOBAL" or "DAILY"
        timestamp: u64,
    }

    /// Emitted when daily leaderboard resets
    public struct DailyLeaderboardReset has copy, drop {
        previous_winner: address,
        previous_score: u64,
        timestamp: u64,
    }

    // ======== Initialize ========

    fun init(ctx: &mut TxContext) {
        use sui::object;
        // Create global leaderboard
        let global_lb = GlobalLeaderboard {
            id: object::new(ctx),
            entries: table::new(ctx),
            top_players: vector::empty(),
            last_updated: 0,
        };

        // Create daily leaderboard
        let daily_lb = DailyLeaderboard {
            id: object::new(ctx),
            day_start: 0,
            entries: table::new(ctx),
            top_players: vector::empty(),
            last_reset: 0,
        };

        transfer::share_object(global_lb);
        transfer::share_object(daily_lb);
    }

    // ======== Public Entry Functions ========

    /// Update player position on global leaderboard
    public fun update_global_leaderboard(
        leaderboard: &mut GlobalLeaderboard,
        player: address,
        profile_id: ID,
        score: u64,
        total_pulses: u64,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        let timestamp = clock::timestamp_ms(clock);

        let entry = LeaderboardEntry {
            player,
            profile_id,
            score,
            total_pulses,
            last_updated: timestamp,
        };

        // Update or insert entry
        if (table::contains(&leaderboard.entries, player)) {
            table::remove(&mut leaderboard.entries, player);
        };
        table::add(&mut leaderboard.entries, player, entry);

        // Update top players list (simple insertion, would optimize in production)
        update_top_players(&mut leaderboard.top_players, player, score);
        leaderboard.last_updated = timestamp;

        // Calculate rank
        let rank = get_player_rank(&leaderboard.top_players, player);

        event::emit(LeaderboardUpdated {
            player,
            score,
            rank,
            leaderboard_type: b"GLOBAL",
            timestamp,
        });
    }

    /// Update player position on daily leaderboard
    public fun update_daily_leaderboard(
        leaderboard: &mut DailyLeaderboard,
        player: address,
        profile_id: ID,
        score: u64,
        total_pulses: u64,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        let timestamp = clock::timestamp_ms(clock);

        // Check if daily leaderboard needs reset
        if (should_reset_daily(leaderboard, timestamp)) {
            reset_daily_leaderboard(leaderboard, timestamp);
        };

        let entry = LeaderboardEntry {
            player,
            profile_id,
            score,
            total_pulses,
            last_updated: timestamp,
        };

        // Update or insert entry
        if (table::contains(&leaderboard.entries, player)) {
            table::remove(&mut leaderboard.entries, player);
        };
        table::add(&mut leaderboard.entries, player, entry);

        // Update top players
        update_top_players(&mut leaderboard.top_players, player, score);

        let rank = get_player_rank(&leaderboard.top_players, player);

        event::emit(LeaderboardUpdated {
            player,
            score,
            rank,
            leaderboard_type: b"DAILY",
            timestamp,
        });
    }

    // ======== Internal Functions ========

    /// Check if daily leaderboard should reset
    fun should_reset_daily(leaderboard: &DailyLeaderboard, current_time: u64): bool {
        if (leaderboard.last_reset == 0) {
            true
        } else {
            current_time >= leaderboard.last_reset + DAY_IN_MS
        }
    }

    /// Reset daily leaderboard
    fun reset_daily_leaderboard(leaderboard: &mut DailyLeaderboard, timestamp: u64) {
        // Get previous winner if exists
        if (vector::length(&leaderboard.top_players) > 0) {
            let winner = *vector::borrow(&leaderboard.top_players, 0);
            let winner_entry = table::borrow(&leaderboard.entries, winner);

            event::emit(DailyLeaderboardReset {
                previous_winner: winner,
                previous_score: winner_entry.score,
                timestamp,
            });
        };

        // Clear entries (note: in production, would properly drop table)
        // For MVP, we keep the table structure and mark as reset
        leaderboard.top_players = vector::empty();
        leaderboard.last_reset = timestamp;
        leaderboard.day_start = timestamp;
    }

    /// Update top players vector (simplified ranking)
    fun update_top_players(top_players: &mut vector<address>, player: address, _score: u64) {
        // Remove player if already in list
        let (found, index) = vector::index_of(top_players, &player);
        if (found) {
            vector::remove(top_players, index);
        };

        // Insert player at appropriate position (simplified - O(n) insertion)
        vector::push_back(top_players, player);

        // Keep only top MAX_LEADERBOARD_SIZE
        if (vector::length(top_players) > MAX_LEADERBOARD_SIZE) {
            vector::pop_back(top_players);
        };
    }

    /// Get player rank in top players list
    fun get_player_rank(top_players: &vector<address>, player: address): u64 {
        let (found, index) = vector::index_of(top_players, &player);
        if (found) {
            index + 1
        } else {
            0
        }
    }

    // ======== View Functions ========

    /// Get top N players from global leaderboard
    public fun get_top_players_global(leaderboard: &GlobalLeaderboard, limit: u64): vector<address> {
        let mut result = vector::empty<address>();
        let len = vector::length(&leaderboard.top_players);
        let count = if (limit < len) { limit } else { len };

        let mut i = 0;
        while (i < count) {
            vector::push_back(&mut result, *vector::borrow(&leaderboard.top_players, i));
            i = i + 1;
        };

        result
    }

    /// Get top N players from daily leaderboard
    public fun get_top_players_daily(leaderboard: &DailyLeaderboard, limit: u64): vector<address> {
        let mut result = vector::empty<address>();
        let len = vector::length(&leaderboard.top_players);
        let count = if (limit < len) { limit } else { len };

        let mut i = 0;
        while (i < count) {
            vector::push_back(&mut result, *vector::borrow(&leaderboard.top_players, i));
            i = i + 1;
        };

        result
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
