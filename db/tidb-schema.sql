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
