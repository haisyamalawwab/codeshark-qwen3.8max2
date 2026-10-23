-- Run explicitly using npm run db:settings:init. Public configuration only, never secrets.
CREATE TABLE IF NOT EXISTS cs_site_settings (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  settings_json JSON NOT NULL,
  revision BIGINT UNSIGNED NOT NULL DEFAULT 0,
  updated_by VARCHAR(191) NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE TABLE IF NOT EXISTS cs_site_settings_audit (
  revision BIGINT UNSIGNED NOT NULL PRIMARY KEY,
  actor_id VARCHAR(191) NOT NULL,
  settings_json JSON NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
