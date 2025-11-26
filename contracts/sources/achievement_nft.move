/// Achievement NFT Module - Soulbound achievements and tradeable collectibles
module onepulse::achievement_nft {
    use sui::object::UID;
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::event;
    use sui::url::{Self, Url};
    use std::string::String;

    // ======== Constants ========
    const MILESTONE_FIRST_PULSE: u64 = 1;
    const MILESTONE_100_PULSES: u64 = 100;
    const MILESTONE_1000_PULSES: u64 = 1000;

    // ======== Structs ========

    /// Soulbound achievement (non-transferable)
    public struct PulseAchievement has key {
        id: UID,
        name: String,
        description: String,
        image_url: Url,
        achievement_type: String,
        milestone_value: u64,
        earned_at: u64,
        is_soulbound: bool,
    }

    /// Tradeable yield card collectible
    public struct YieldCard has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: Url,
        rarity: String, // "Common", "Rare", "Epic", "Legendary"
        yield_boost: u64, // Percentage boost (e.g., 10 = 10%)
        created_at: u64,
    }

    /// Achievement minter capability
    public struct AchievementMinter has key {
        id: UID,
    }

    // ======== Events ========

    public struct AchievementMinted has copy, drop {
        achievement_id: ID,
        player: address,
        achievement_type: String,
        milestone_value: u64,
        timestamp: u64,
    }

    public struct YieldCardMinted has copy, drop {
        card_id: ID,
        player: address,
        rarity: String,
        yield_boost: u64,
        timestamp: u64,
    }

    // ======== Initialize ========

    fun init(ctx: &mut TxContext) {
        use sui::object;
        use sui::tx_context;
        let minter = AchievementMinter {
            id: object::new(ctx),
        };
        transfer::transfer(minter, tx_context::sender(ctx));
    }

    // ======== Public Entry Functions ========

    /// Mint a soulbound achievement
    public fun mint_achievement(
        _minter: &AchievementMinter,
        player: address,
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        achievement_type: vector<u8>,
        milestone_value: u64,
        timestamp: u64,
        ctx: &mut TxContext
    ) {
        use sui::object;
        use std::string;
        let achievement = PulseAchievement {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            image_url: url::new_unsafe_from_bytes(image_url),
            achievement_type: string::utf8(achievement_type),
            milestone_value,
            earned_at: timestamp,
            is_soulbound: true,
        };

        let achievement_id = object::id(&achievement);

        event::emit(AchievementMinted {
            achievement_id,
            player,
            achievement_type: string::utf8(achievement_type),
            milestone_value,
            timestamp,
        });

        // Transfer as soulbound (non-transferable in practice)
        transfer::transfer(achievement, player);
    }

    /// Mint a tradeable yield card
    public fun mint_yield_card(
        _minter: &AchievementMinter,
        player: address,
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        rarity: vector<u8>,
        yield_boost: u64,
        timestamp: u64,
        ctx: &mut TxContext
    ) {
        use sui::object;
        use std::string;
        let card = YieldCard {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            image_url: url::new_unsafe_from_bytes(image_url),
            rarity: string::utf8(rarity),
            yield_boost,
            created_at: timestamp,
        };

        let card_id = object::id(&card);

        event::emit(YieldCardMinted {
            card_id,
            player,
            rarity: string::utf8(rarity),
            yield_boost,
            timestamp,
        });

        // Transfer as tradeable object
        transfer::public_transfer(card, player);
    }

    /// Auto-mint achievement based on milestone
    public fun check_and_mint_milestone(
        minter: &AchievementMinter,
        player: address,
        total_pulses: u64,
        timestamp: u64,
        ctx: &mut TxContext
    ) {
        // Check for milestones and mint appropriate achievement
        if (total_pulses == MILESTONE_FIRST_PULSE) {
            mint_achievement(
                minter,
                player,
                b"First Pulse",
                b"Completed your first pulse action in OnePulse Arena!",
                b"https://onepulse.arena/nft/first-pulse.png",
                b"FIRST_PULSE",
                MILESTONE_FIRST_PULSE,
                timestamp,
                ctx
            );
        } else if (total_pulses == MILESTONE_100_PULSES) {
            mint_achievement(
                minter,
                player,
                b"Pulse Master",
                b"Reached 100 pulse actions! You're on fire!",
                b"https://onepulse.arena/nft/pulse-master.png",
                b"PULSE_MASTER",
                MILESTONE_100_PULSES,
                timestamp,
                ctx
            );
        } else if (total_pulses == MILESTONE_1000_PULSES) {
            mint_achievement(
                minter,
                player,
                b"Pulse Legend",
                b"An incredible 1000 pulses! You're a true legend!",
                b"https://onepulse.arena/nft/pulse-legend.png",
                b"PULSE_LEGEND",
                MILESTONE_1000_PULSES,
                timestamp,
                ctx
            );
        };
    }

    // ======== View Functions ========

    public fun get_achievement_name(achievement: &PulseAchievement): String {
        achievement.name
    }

    public fun get_achievement_type(achievement: &PulseAchievement): String {
        achievement.achievement_type
    }

    public fun get_card_rarity(card: &YieldCard): String {
        card.rarity
    }

    public fun get_card_boost(card: &YieldCard): u64 {
        card.yield_boost
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
