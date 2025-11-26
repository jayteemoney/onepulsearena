#[test_only]
module onepulse::onepulse_arena_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::clock::{Self, Clock};
    use onepulse::onepulse_arena::{Self, PlayerProfile, GameState, GameAdmin};

    const ADMIN: address = @0xAD;
    const PLAYER1: address = @0x1;
    const PLAYER2: address = @0x2;

    #[test]
    fun test_create_profile() {
        let mut scenario = ts::begin(ADMIN);

        // Initialize game
        {
            onepulse_arena::init_for_testing(ts::ctx(&mut scenario));
        };

        // Create clock
        ts::next_tx(&mut scenario, ADMIN);
        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::set_for_testing(&mut clock, 1000);

        // Create player profile
        ts::next_tx(&mut scenario, PLAYER1);
        {
            let mut game_state = ts::take_shared<GameState>(&scenario);
            onepulse_arena::create_player_profile(
                &mut game_state,
                &clock,
                ts::ctx(&mut scenario)
            );
            ts::return_shared(game_state);
        };

        // Verify profile created
        ts::next_tx(&mut scenario, PLAYER1);
        {
            let profile = ts::take_from_sender<PlayerProfile>(&scenario);
            assert!(onepulse_arena::get_player_score(&profile) == 0, 0);
            assert!(onepulse_arena::get_player_pulses(&profile) == 0, 1);
            ts::return_to_sender(&scenario, profile);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_record_pulse() {
        let mut scenario = ts::begin(ADMIN);

        // Initialize
        {
            onepulse_arena::init_for_testing(ts::ctx(&mut scenario));
        };

        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::set_for_testing(&mut clock, 1000);

        // Create profile
        ts::next_tx(&mut scenario, PLAYER1);
        {
            let mut game_state = ts::take_shared<GameState>(&scenario);
            onepulse_arena::create_player_profile(
                &mut game_state,
                &clock,
                ts::ctx(&mut scenario)
            );
            ts::return_shared(game_state);
        };

        // Record pulse
        clock::set_for_testing(&mut clock, 2000);
        ts::next_tx(&mut scenario, PLAYER1);
        {
            let mut profile = ts::take_from_sender<PlayerProfile>(&scenario);
            let mut game_state = ts::take_shared<GameState>(&scenario);

            onepulse_arena::record_pulse(
                &mut profile,
                &mut game_state,
                &clock,
                ts::ctx(&mut scenario)
            );

            assert!(onepulse_arena::get_player_score(&profile) == 100, 0);
            assert!(onepulse_arena::get_player_pulses(&profile) == 1, 1);
            assert!(onepulse_arena::get_player_yield(&profile) > 0, 2);

            ts::return_to_sender(&scenario, profile);
            ts::return_shared(game_state);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = onepulse_arena::EPulseCooldown)]
    fun test_pulse_cooldown() {
        let mut scenario = ts::begin(ADMIN);

        {
            onepulse_arena::init_for_testing(ts::ctx(&mut scenario));
        };

        let mut clock = clock::create_for_testing(ts::ctx(&mut scenario));
        clock::set_for_testing(&mut clock, 1000);

        ts::next_tx(&mut scenario, PLAYER1);
        {
            let mut game_state = ts::take_shared<GameState>(&scenario);
            onepulse_arena::create_player_profile(
                &mut game_state,
                &clock,
                ts::ctx(&mut scenario)
            );
            ts::return_shared(game_state);
        };

        // First pulse
        clock::set_for_testing(&mut clock, 2000);
        ts::next_tx(&mut scenario, PLAYER1);
        {
            let mut profile = ts::take_from_sender<PlayerProfile>(&scenario);
            let mut game_state = ts::take_shared<GameState>(&scenario);

            onepulse_arena::record_pulse(
                &mut profile,
                &mut game_state,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_to_sender(&scenario, profile);
            ts::return_shared(game_state);
        };

        // Second pulse too soon (should fail)
        clock::set_for_testing(&mut clock, 2500); // Only 500ms later
        ts::next_tx(&mut scenario, PLAYER1);
        {
            let mut profile = ts::take_from_sender<PlayerProfile>(&scenario);
            let mut game_state = ts::take_shared<GameState>(&scenario);

            onepulse_arena::record_pulse(
                &mut profile,
                &mut game_state,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_to_sender(&scenario, profile);
            ts::return_shared(game_state);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
}
