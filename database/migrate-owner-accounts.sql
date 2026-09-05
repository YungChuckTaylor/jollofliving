-- ===========================================================================
--  Jollof Living — migration: customer / property-owner accounts
--  ---------------------------------------------------------------------------
--  Safe to run on a live database that already holds real data, and safe to
--  run more than once: every statement is CREATE TABLE IF NOT EXISTS, so
--  re-running it changes nothing.
--
--  Run it from cPanel -> phpMyAdmin -> your database -> SQL tab, or let
--  /install/upgrade.php do it for you.
--
--  Nothing here drops, renames or rewrites an existing table or column.
--  The users.role and users.is_host columns this feature needs already exist
--  in the original schema, so no ALTER TABLE is required.
-- ===========================================================================

CREATE TABLE IF NOT EXISTS property_calendar (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  property_id INT UNSIGNED NOT NULL,
  day         DATE NOT NULL,
  price       INT NULL,
  status      ENUM('open','blocked') NOT NULL DEFAULT 'open',
  note        VARCHAR(160) NULL,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cal_day (property_id, day),
  KEY idx_cal_prop (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pricing_rules (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  host_id     INT UNSIGNED NOT NULL,
  property_id INT UNSIGNED NULL,
  name        VARCHAR(140) NOT NULL,
  kind        ENUM('seasonal','weekend','lastminute','length','custom') NOT NULL DEFAULT 'seasonal',
  adjust_pct  DECIMAL(6,2) NOT NULL DEFAULT 0,
  starts_on   DATE NULL,
  ends_on     DATE NULL,
  active      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_pr_host (host_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS host_team (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  host_id     INT UNSIGNED NOT NULL,
  member_id   INT UNSIGNED NULL,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(190) NULL,
  team_role   VARCHAR(60) NOT NULL DEFAULT 'cohost',
  permissions VARCHAR(240) NOT NULL DEFAULT 'calendar,messages',
  status      ENUM('invited','active','revoked') NOT NULL DEFAULT 'invited',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_ht_host (host_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS host_templates (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  host_id    INT UNSIGNED NOT NULL,
  title      VARCHAR(140) NOT NULL,
  body       TEXT NOT NULL,
  trigger_on VARCHAR(60) NOT NULL DEFAULT 'manual',
  icon       VARCHAR(40) NOT NULL DEFAULT 'send',
  active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_htpl_host (host_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS host_channels (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  host_id      INT UNSIGNED NOT NULL,
  channel      VARCHAR(80) NOT NULL,
  status       ENUM('connected','disconnected','error') NOT NULL DEFAULT 'disconnected',
  last_sync_at DATETIME NULL,
  note         VARCHAR(160) NULL,
  UNIQUE KEY uq_hc (host_id, channel),
  KEY idx_hc_host (host_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS host_payout_settings (
  host_id      INT UNSIGNED NOT NULL PRIMARY KEY,
  schedule     VARCHAR(30) NOT NULL DEFAULT 'weekly',
  bank_name    VARCHAR(120) NULL,
  account_name VARCHAR(120) NULL,
  account_last VARCHAR(8) NULL,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS host_insights (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  host_id     INT UNSIGNED NOT NULL,
  property_id INT UNSIGNED NULL,
  kind        VARCHAR(40) NOT NULL DEFAULT 'listing',
  title       VARCHAR(190) NOT NULL,
  detail      VARCHAR(255) NULL,
  level       ENUM('ok','info','warn','bad') NOT NULL DEFAULT 'info',
  status      ENUM('open','applied','dismissed') NOT NULL DEFAULT 'open',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_hi_host (host_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
