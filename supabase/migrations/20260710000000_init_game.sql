-- 20260710000000_init_game.sql
-- Migration initialization for "Vòng Xoáy Giá Trị Thặng Dư"

-- Create Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Players Table
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    faction VARCHAR(20) CHECK (faction IN ('capitalist', 'worker', 'spectator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Game Sessions Table
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_code VARCHAR(10) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
    current_turn INT DEFAULT 0,
    phase VARCHAR(20) DEFAULT 'lobby' CHECK (phase IN ('lobby', 'pick', 'resolve', 'event', 'ending')),
    era_year INT DEFAULT 1811,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Session Players Table
CREATE TABLE IF NOT EXISTS session_players (
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('capitalist', 'worker')),
    PRIMARY KEY (session_id, player_id)
);

-- 4. Game Turns Table
CREATE TABLE IF NOT EXISTS game_turns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    turn_number INT NOT NULL,
    capital NUMERIC(15, 2) NOT NULL,
    constant_capital NUMERIC(15, 2) NOT NULL,
    variable_capital NUMERIC(15, 2) NOT NULL,
    organic_composition NUMERIC(10, 4) NOT NULL,
    surplus_value NUMERIC(15, 2) NOT NULL,
    worker_health INT NOT NULL,
    conflict_rate INT NOT NULL,
    union_fund NUMERIC(15, 2) NOT NULL,
    class_consciousness INT NOT NULL,
    market_share INT NOT NULL,
    reputation INT NOT NULL,
    aggregate_demand NUMERIC(15, 2) NOT NULL,
    social_value NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (session_id, turn_number)
);

-- 5. Historical Events Table
CREATE TABLE IF NOT EXISTS historical_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    era_year INT NOT NULL,
    description TEXT NOT NULL,
    choices_json JSONB DEFAULT '[]'::jsonb
);

-- 6. Event Logs Table
CREATE TABLE IF NOT EXISTS event_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    event_id UUID REFERENCES historical_events(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    choice_key VARCHAR(50) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Random Events Table
CREATE TABLE IF NOT EXISTS random_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    effect_json JSONB NOT NULL,
    weight INT DEFAULT 100,
    is_major_historical BOOLEAN DEFAULT FALSE,
    trigger_year INT
);

-- 8. Card Pool Table
CREATE TABLE IF NOT EXISTS card_pool (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faction VARCHAR(20) CHECK (faction IN ('capitalist', 'worker')),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    effects_json JSONB NOT NULL,
    weight INT DEFAULT 100,
    min_turn_unlock INT DEFAULT 0
);

-- 9. Player Build Table
CREATE TABLE IF NOT EXISTS player_build (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    card_id UUID REFERENCES card_pool(id) ON DELETE CASCADE,
    turn_picked INT NOT NULL
);

-- 10. Advisor Queries Table
CREATE TABLE IF NOT EXISTS advisor_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    state_snapshot_json JSONB NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_turns ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_build ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisor_queries ENABLE ROW LEVEL SECURITY;

-- Create Policies (Simple template allowing authenticated or anonymous reads/writes based on user session)
CREATE POLICY "Allow public read access to active sessions" 
    ON game_sessions FOR SELECT USING (status = 'active' OR status = 'waiting');

CREATE POLICY "Allow players to read own profile" 
    ON players FOR SELECT USING (true);

CREATE POLICY "Allow session players read access" 
    ON session_players FOR SELECT USING (true);

CREATE POLICY "Allow read access to game turns" 
    ON game_turns FOR SELECT USING (true);
