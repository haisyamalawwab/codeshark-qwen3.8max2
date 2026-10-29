-- CodeShark / TiDB Cloud (MySQL protocol). Select the database before running.
-- Dedicated cs_ namespace: does not overwrite the legacy PostgreSQL schemas.
-- No TiDB-version-specific foreign keys: parent/child writes use one transaction.
-- All timestamps are UTC. Client timestamps are metadata, NOT score verification.

CREATE TABLE IF NOT EXISTS cs_schema_migrations (
  version VARCHAR(64) NOT NULL PRIMARY KEY,
  applied_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE IF NOT EXISTS cs_profiles (
  owner_id VARCHAR(191) NOT NULL PRIMARY KEY,
  device_id VARCHAR(191) NOT NULL,
  name VARCHAR(120) NOT NULL,
  age_group VARCHAR(16) NOT NULL DEFAULT 'teen',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE IF NOT EXISTS cs_saves (
  owner_id VARCHAR(191) NOT NULL PRIMARY KEY,
  xp BIGINT UNSIGNED NOT NULL DEFAULT 0,
  coins BIGINT UNSIGNED NOT NULL DEFAULT 0,
  modules JSON NOT NULL,
  stats JSON NOT NULL,
  save_data JSON NOT NULL,
  client_sent_at BIGINT UNSIGNED NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE IF NOT EXISTS cs_attempts (
  owner_id VARCHAR(191) NOT NULL,
  id VARCHAR(191) NOT NULL,
  device_id VARCHAR(191) NOT NULL,
  session_id VARCHAR(191) NOT NULL,
  won BOOLEAN NOT NULL,
  stars TINYINT UNSIGNED NOT NULL,
  score BIGINT UNSIGNED NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  wpm DECIMAL(10,2) NOT NULL,
  max_combo BIGINT UNSIGNED NOT NULL,
  xp_award BIGINT UNSIGNED NOT NULL,
  coins_award BIGINT UNSIGNED NOT NULL,
  passed BOOLEAN NOT NULL,
  played_at DATETIME(3) NOT NULL,
  received_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (owner_id, id),
  INDEX cs_attempts_owner_time (owner_id, played_at),
  INDEX cs_attempts_session_time (session_id, played_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

INSERT IGNORE INTO cs_schema_migrations (version) VALUES ('001_initial_tidb');

-- =====================================================================
-- 002_gamification_profile_membership
-- Tabel ternormalisasi untuk halaman Profil & Membership. cs_saves tetap
-- sumber kebenaran restore (blob); tabel-tabel ini diturunkan server dari
-- snapshot save + attempts pada transaksi sync yang sama, sehingga hasil
-- gamifikasi (XP/koin/rank/streak), badge, achievement, atensi harian,
-- dan membership dapat ditanyakan tanpa mem-parsing blob.
-- =====================================================================

CREATE TABLE IF NOT EXISTS cs_memberships (
  owner_id VARCHAR(191) NOT NULL PRIMARY KEY,
  plan VARCHAR(32) NOT NULL DEFAULT 'free',
  role VARCHAR(32) NOT NULL DEFAULT 'peserta',
  cohort_code VARCHAR(64) NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'active',
  started_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  expires_at TIMESTAMP(3) NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX cs_memberships_cohort (cohort_code),
  INDEX cs_memberships_plan (plan)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE IF NOT EXISTS cs_gamification (
  owner_id VARCHAR(191) NOT NULL PRIMARY KEY,
  xp BIGINT UNSIGNED NOT NULL DEFAULT 0,
  coins BIGINT UNSIGNED NOT NULL DEFAULT 0,
  rank_name VARCHAR(64) NOT NULL DEFAULT 'Kadet Baru',
  games BIGINT UNSIGNED NOT NULL DEFAULT 0,
  wins BIGINT UNSIGNED NOT NULL DEFAULT 0,
  best_wpm DECIMAL(10,2) NOT NULL DEFAULT 0,
  best_combo BIGINT UNSIGNED NOT NULL DEFAULT 0,
  keystrokes BIGINT UNSIGNED NOT NULL DEFAULT 0,
  correct_keys BIGINT UNSIGNED NOT NULL DEFAULT 0,
  lines_typed BIGINT UNSIGNED NOT NULL DEFAULT 0,
  streak_current INT UNSIGNED NOT NULL DEFAULT 0,
  streak_best INT UNSIGNED NOT NULL DEFAULT 0,
  login_streak_current INT UNSIGNED NOT NULL DEFAULT 0,
  login_streak_best INT UNSIGNED NOT NULL DEFAULT 0,
  streak_tier SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  streak_multiplier DECIMAL(4,2) NOT NULL DEFAULT 1.00,
  daily_completed INT UNSIGNED NOT NULL DEFAULT 0,
  achievements_claimed INT UNSIGNED NOT NULL DEFAULT 0,
  modules_completed INT UNSIGNED NOT NULL DEFAULT 0,
  last_active_date DATE NULL,
  client_sent_at BIGINT UNSIGNED NOT NULL DEFAULT 0,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX cs_gamification_xp (xp)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE IF NOT EXISTS cs_achievements (
  owner_id VARCHAR(191) NOT NULL,
  achievement_id VARCHAR(64) NOT NULL,
  progress BIGINT UNSIGNED NOT NULL DEFAULT 0,
  target BIGINT UNSIGNED NOT NULL DEFAULT 0,
  unlocked_at DATETIME(3) NULL,
  claimed_at DATETIME(3) NULL,
  reward_xp BIGINT UNSIGNED NOT NULL DEFAULT 0,
  reward_coins BIGINT UNSIGNED NOT NULL DEFAULT 0,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (owner_id, achievement_id),
  INDEX cs_achievements_claimed (owner_id, claimed_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE IF NOT EXISTS cs_badges (
  owner_id VARCHAR(191) NOT NULL,
  badge_id VARCHAR(96) NOT NULL,
  source VARCHAR(32) NOT NULL,
  tier VARCHAR(32) NOT NULL DEFAULT '',
  awarded_at DATETIME(3) NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (owner_id, badge_id),
  INDEX cs_badges_awarded (owner_id, awarded_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE IF NOT EXISTS cs_attention_days (
  owner_id VARCHAR(191) NOT NULL,
  activity_date DATE NOT NULL,
  attempts_count INT UNSIGNED NOT NULL DEFAULT 0,
  sessions_count INT UNSIGNED NOT NULL DEFAULT 0,
  xp_earned BIGINT UNSIGNED NOT NULL DEFAULT 0,
  coins_earned BIGINT UNSIGNED NOT NULL DEFAULT 0,
  first_at DATETIME(3) NULL,
  last_at DATETIME(3) NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (owner_id, activity_date)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

INSERT IGNORE INTO cs_schema_migrations (version) VALUES ('002_gamification_profile_membership');
