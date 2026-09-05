-- ============================================================
--  JOLLOF LIVING — mobile app support
--  Safe to run more than once. Adds only what the Android app
--  needs on top of the existing website schema.
--  cPanel → phpMyAdmin → your database → SQL tab → paste → Go.
-- ============================================================

-- Bearer tokens. The website authenticates with a PHP session cookie,
-- which a packaged app on a different origin cannot use, so the app
-- exchanges a password for one of these long-lived tokens instead.
CREATE TABLE IF NOT EXISTS api_tokens (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  token_hash  CHAR(64)     NOT NULL,
  device      VARCHAR(120) NULL,
  platform    VARCHAR(40)  NOT NULL DEFAULT 'android',
  push_token  VARCHAR(255) NULL,
  last_used_at DATETIME    NULL,
  expires_at  DATETIME     NULL,
  revoked     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_token (token_hash),
  KEY idx_tok_user (user_id),
  KEY idx_tok_live (revoked, expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Idempotency for offline writes. The app queues actions taken with no
-- signal and replays them on reconnect; a retry must never create a
-- second booking, so each queued action carries a client-generated key
-- and the server returns the original response for a repeat.
CREATE TABLE IF NOT EXISTS sync_operations (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  client_key  VARCHAR(64)  NOT NULL,
  endpoint    VARCHAR(80)  NOT NULL,
  response    MEDIUMTEXT   NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'done',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_sync_key (user_id, client_key),
  KEY idx_sync_user (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
