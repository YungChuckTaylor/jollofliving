-- ============================================================
--  JOLLOF LIVING — MySQL schema
--  Target: MySQL 5.7+ / MariaDB 10.3+ (HostGator shared hosting)
--  Import via cPanel → phpMyAdmin → Import, or run install/install.php
-- ============================================================
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------- settings
CREATE TABLE IF NOT EXISTS settings (
  skey        VARCHAR(64)  NOT NULL PRIMARY KEY,
  svalue      TEXT         NULL,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- users
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL,
  phone         VARCHAR(40)  NULL,
  password_hash VARCHAR(255) NULL,
  role          ENUM('guest','host','corporate','admin') NOT NULL DEFAULT 'guest',
  is_host       TINYINT(1)   NOT NULL DEFAULT 0,
  tier          VARCHAR(20)  NOT NULL DEFAULT 'bronze',
  points        INT          NOT NULL DEFAULT 0,
  avatar        VARCHAR(255) NULL,
  city          VARCHAR(80)  NULL,
  status        VARCHAR(60)  NOT NULL DEFAULT 'Verified',
  status_level  ENUM('ok','warn','bad') NOT NULL DEFAULT 'ok',
  kyc_verified  TINYINT(1)   NOT NULL DEFAULT 0,
  referral_code VARCHAR(40)  NULL,
  last_login_at DATETIME     NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- properties
CREATE TABLE IF NOT EXISTS properties (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(80)  NOT NULL,
  name          VARCHAR(160) NOT NULL,
  area          VARCHAR(80)  NOT NULL,
  city          VARCHAR(60)  NOT NULL,
  img           VARCHAR(120) NOT NULL DEFAULT 'p1',
  price         INT          NOT NULL DEFAULT 0,
  old_price     INT          NULL,
  rating        DECIMAL(3,2) NOT NULL DEFAULT 0,
  reviews_count INT          NOT NULL DEFAULT 0,
  beds          DECIMAL(3,1) NOT NULL DEFAULT 1,
  baths         DECIMAL(3,1) NOT NULL DEFAULT 1,
  guests        INT          NOT NULL DEFAULT 2,
  ptype         VARCHAR(60)  NOT NULL DEFAULT 'Apartment',
  badge         VARCHAR(60)  NULL,
  badge_gold    TINYINT(1)   NOT NULL DEFAULT 0,
  instant       TINYINT(1)   NOT NULL DEFAULT 1,
  policy        VARCHAR(20)  NOT NULL DEFAULT 'moderate',
  map_x         DECIMAL(5,3) NOT NULL DEFAULT 0.5,
  map_y         DECIMAL(5,3) NOT NULL DEFAULT 0.5,
  featured      TINYINT(1)   NOT NULL DEFAULT 0,
  is_new        TINYINT(1)   NOT NULL DEFAULT 0,
  tour          TINYINT(1)   NOT NULL DEFAULT 0,
  floor_label   VARCHAR(80)  NULL,
  sold_out      VARCHAR(60)  NULL,
  description   TEXT         NULL,
  ai_summary    TEXT         NULL,
  host_id       INT UNSIGNED NULL,
  status        ENUM('draft','pending','live','paused','rejected') NOT NULL DEFAULT 'live',
  sort_order    INT          NOT NULL DEFAULT 0,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_prop_slug (slug),
  KEY idx_prop_status (status),
  KEY idx_prop_city (city),
  KEY idx_prop_host (host_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS property_amenities (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  property_id INT UNSIGNED NOT NULL,
  amenity     VARCHAR(120) NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  KEY idx_pa_prop (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS property_scores (
  property_id   INT UNSIGNED NOT NULL PRIMARY KEY,
  cleanliness   DECIMAL(3,2) NOT NULL DEFAULT 0,
  accuracy      DECIMAL(3,2) NOT NULL DEFAULT 0,
  communication DECIMAL(3,2) NOT NULL DEFAULT 0,
  location      DECIMAL(3,2) NOT NULL DEFAULT 0,
  checkin       DECIMAL(3,2) NOT NULL DEFAULT 0,
  value_score   DECIMAL(3,2) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS property_nearby (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  property_id INT UNSIGNED NOT NULL,
  place       VARCHAR(160) NOT NULL,
  distance    VARCHAR(40)  NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  KEY idx_pn_prop (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS property_images (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  property_id INT UNSIGNED NOT NULL,
  path        VARCHAR(255) NOT NULL,
  caption     VARCHAR(160) NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  KEY idx_pi_prop (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- reviews
CREATE TABLE IF NOT EXISTS reviews (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  property_id INT UNSIGNED NOT NULL,
  user_id     INT UNSIGNED NULL,
  booking_ref VARCHAR(40)  NULL,
  author      VARCHAR(120) NOT NULL,
  meta        VARCHAR(120) NULL,
  body        TEXT         NOT NULL,
  rating      DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  scores      TEXT         NULL,   -- JSON: cleanliness, accuracy, checkin, communication, location, value
  status      ENUM('published','pending','rejected') NOT NULL DEFAULT 'published',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_rev_prop (property_id),
  KEY idx_rev_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- collections
CREATE TABLE IF NOT EXISTS collections (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug       VARCHAR(80)  NOT NULL,
  name       VARCHAR(140) NOT NULL,
  sub        VARCHAR(160) NULL,
  img        VARCHAR(120) NOT NULL DEFAULT 'p1',
  wide       TINYINT(1) NOT NULL DEFAULT 0,
  tall       TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_col_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS collection_properties (
  collection_id INT UNSIGNED NOT NULL,
  property_id   INT UNSIGNED NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- neighborhoods
CREATE TABLE IF NOT EXISTS neighborhoods (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(80)  NOT NULL,
  name        VARCHAR(140) NOT NULL,
  tag         VARCHAR(180) NULL,
  img         VARCHAR(120) NOT NULL DEFAULT 'p1',
  avg_price   INT NOT NULL DEFAULT 0,
  stays_count INT NOT NULL DEFAULT 0,
  description TEXT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_nb_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS neighborhood_items (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  neighborhood_id INT UNSIGNED NOT NULL,
  kind            ENUM('dining','night','transport','safety','culture') NOT NULL,
  item            VARCHAR(200) NOT NULL,
  sort_order      INT NOT NULL DEFAULT 0,
  KEY idx_ni_nb (neighborhood_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- experiences
CREATE TABLE IF NOT EXISTS experiences (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(80)  NOT NULL,
  name        VARCHAR(160) NOT NULL,
  category    VARCHAR(60)  NULL,
  img         VARCHAR(120) NOT NULL DEFAULT 'p1',
  price       INT NOT NULL DEFAULT 0,
  duration    VARCHAR(60) NULL,
  description TEXT NULL,
  active      TINYINT(1) NOT NULL DEFAULT 1,
  sort_order  INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_exp_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS experience_bookings (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  experience_id INT UNSIGNED NOT NULL,
  user_id       INT UNSIGNED NULL,
  guest_name    VARCHAR(120) NULL,
  guest_email   VARCHAR(190) NULL,
  date_for      DATE NULL,
  guests        INT NOT NULL DEFAULT 1,
  notes         TEXT NULL,
  status        VARCHAR(30) NOT NULL DEFAULT 'requested',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_eb_exp (experience_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug       VARCHAR(120) NOT NULL,
  category   VARCHAR(60)  NULL,
  title      VARCHAR(220) NOT NULL,
  date_label VARCHAR(40)  NULL,
  read_time  VARCHAR(30)  NULL,
  img        VARCHAR(120) NOT NULL DEFAULT 'p1',
  excerpt    TEXT NULL,
  body       MEDIUMTEXT NULL,
  published  TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_blog_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- content bits
CREATE TABLE IF NOT EXISTS testimonials (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  author     VARCHAR(120) NOT NULL,
  meta       VARCHAR(160) NULL,
  quote      TEXT NOT NULL,
  active     TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faqs (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  question   VARCHAR(300) NOT NULL,
  answer     TEXT NOT NULL,
  category   VARCHAR(60) NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS help_categories (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug       VARCHAR(60) NOT NULL,
  name       VARCHAR(140) NOT NULL,
  article_count INT NOT NULL DEFAULT 0,
  icon       VARCHAR(40) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_help_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roadmap (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  phase       VARCHAR(20) NOT NULL DEFAULT 'soon',
  title       VARCHAR(180) NOT NULL,
  description TEXT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'soon',
  sort_order  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS page_meta (
  page_key    VARCHAR(60) NOT NULL PRIMARY KEY,
  title       VARCHAR(220) NOT NULL,
  description TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_blocks (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  block_key   VARCHAR(80) NOT NULL,
  title       VARCHAR(200) NOT NULL,
  body        MEDIUMTEXT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'Live',
  owner       VARCHAR(120) NULL,
  updated_label VARCHAR(40) NULL,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cms_key (block_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- pricing config
CREATE TABLE IF NOT EXISTS fx_rates (
  code      VARCHAR(3) NOT NULL PRIMARY KEY,
  symbol    VARCHAR(8) NOT NULL,
  rate      DECIMAL(18,10) NOT NULL DEFAULT 1,
  decimals  TINYINT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS addons (
  akey       VARCHAR(40) NOT NULL PRIMARY KEY,
  name       VARCHAR(160) NOT NULL,
  price      DECIMAL(12,4) NOT NULL DEFAULT 0,
  is_percent TINYINT(1) NOT NULL DEFAULT 0,
  icon       VARCHAR(40) NULL,
  note       VARCHAR(200) NULL,
  active     TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS promos (
  code       VARCHAR(40) NOT NULL PRIMARY KEY,
  label      VARCHAR(160) NOT NULL,
  off        DECIMAL(5,4) NOT NULL DEFAULT 0,
  flat       INT NOT NULL DEFAULT 0,
  active     TINYINT(1) NOT NULL DEFAULT 1,
  expires_at DATE NULL,
  uses       INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pay_methods (
  mkey       VARCHAR(40) NOT NULL PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  note       VARCHAR(160) NULL,
  icon       VARCHAR(40) NULL,
  active     TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- membership
CREATE TABLE IF NOT EXISTS tiers (
  tkey        VARCHAR(20) NOT NULL PRIMARY KEY,
  letter      VARCHAR(2) NOT NULL,
  name        VARCHAR(40) NOT NULL,
  requirement VARCHAR(60) NULL,
  points_label VARCHAR(20) NULL,
  min_points  INT NOT NULL DEFAULT 0,
  multiplier  INT NOT NULL DEFAULT 5,
  featured    TINYINT(1) NOT NULL DEFAULT 0,
  sort_order  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tier_perks (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tkey       VARCHAR(20) NOT NULL,
  perk       VARCHAR(200) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  KEY idx_tp_key (tkey)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS points_ledger (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  date_label  VARCHAR(40) NULL,
  description VARCHAR(220) NOT NULL,
  amount      INT NOT NULL DEFAULT 0,
  kind        ENUM('earn','redeem') NOT NULL DEFAULT 'earn',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_pl_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- bookings
CREATE TABLE IF NOT EXISTS bookings (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ref           VARCHAR(40)  NOT NULL,
  user_id       INT UNSIGNED NULL,
  property_id   INT UNSIGNED NOT NULL,
  guest_name    VARCHAR(120) NULL,
  guest_email   VARCHAR(190) NULL,
  guest_phone   VARCHAR(40)  NULL,
  checkin       DATE NULL,
  checkout      DATE NULL,
  nights        INT NOT NULL DEFAULT 1,
  guests        INT NOT NULL DEFAULT 1,
  policy        VARCHAR(20) NOT NULL DEFAULT 'moderate',
  pay_method    VARCHAR(40) NULL,
  addons        TEXT NULL,
  promo_code    VARCHAR(40) NULL,
  split_payment TINYINT(1) NOT NULL DEFAULT 0,
  is_request    TINYINT(1) NOT NULL DEFAULT 0,
  subtotal      INT NOT NULL DEFAULT 0,
  fees          INT NOT NULL DEFAULT 0,
  taxes         INT NOT NULL DEFAULT 0,
  discount      INT NOT NULL DEFAULT 0,
  total         INT NOT NULL DEFAULT 0,
  currency      VARCHAR(3) NOT NULL DEFAULT 'NGN',
  breakdown   TEXT NULL,   -- JSON snapshot of the quote at the time of booking
  points_earned INT NOT NULL DEFAULT 0,
  status        ENUM('pending','confirmed','active','completed','cancelled') NOT NULL DEFAULT 'pending',
  escrow_status ENUM('held','released','refunded','none') NOT NULL DEFAULT 'held',
  checkin_code  VARCHAR(12) NULL,
  notes         TEXT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_bk_ref (ref),
  KEY idx_bk_user (user_id),
  KEY idx_bk_prop (property_id),
  KEY idx_bk_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS booking_events (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NOT NULL,
  event      VARCHAR(60) NOT NULL,
  detail     TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_be_bk (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  booking_id  INT UNSIGNED NULL,
  user_id     INT UNSIGNED NULL,
  reference   VARCHAR(80) NOT NULL,
  gateway     VARCHAR(40) NOT NULL DEFAULT 'manual',
  amount      INT NOT NULL DEFAULT 0,
  currency    VARCHAR(3) NOT NULL DEFAULT 'NGN',
  status      ENUM('initiated','paid','failed','refunded') NOT NULL DEFAULT 'initiated',
  payload     TEXT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_pay_bk (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payouts (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  reference  VARCHAR(60) NOT NULL,
  amount     INT NOT NULL DEFAULT 0,
  currency   VARCHAR(3) NOT NULL DEFAULT 'NGN',
  bank       VARCHAR(120) NULL,
  status     VARCHAR(30) NOT NULL DEFAULT 'processing',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_po_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- wishlist / compare
CREATE TABLE IF NOT EXISTS wishlists (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  slug       VARCHAR(60) NOT NULL DEFAULT 'default',
  name       VARCHAR(120) NOT NULL DEFAULT 'My wishlist',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_wl (user_id, slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wishlist_items (
  wishlist_id INT UNSIGNED NOT NULL,
  property_id INT UNSIGNED NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (wishlist_id, property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS compare_items (
  user_id     INT UNSIGNED NOT NULL,
  property_id INT UNSIGNED NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS waitlist (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NULL,
  property_id INT UNSIGNED NOT NULL,
  email       VARCHAR(190) NULL,
  date_from   DATE NULL,
  date_to     DATE NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_wt_prop (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS recent_views (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NULL,
  session_key VARCHAR(64) NULL,
  property_id INT UNSIGNED NOT NULL,
  viewed_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_rv_user (user_id),
  KEY idx_rv_sess (session_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- comms
CREATE TABLE IF NOT EXISTS conversations (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NULL,
  ckey       VARCHAR(60) NOT NULL,
  kind       VARCHAR(30) NOT NULL DEFAULT 'support',  -- concierge | support | host
  host_id    INT UNSIGNED NULL,
  name       VARCHAR(140) NOT NULL,
  subtitle   VARCHAR(160) NULL,
  preview    VARCHAR(190) NULL,
  online     TINYINT(1) NOT NULL DEFAULT 1,
  last_message_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_cv_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS messages (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT UNSIGNED NOT NULL,
  sender          ENUM('me','bot','host','support') NOT NULL DEFAULT 'bot',
  body            TEXT NOT NULL,
  time_label      VARCHAR(30) NULL,
  read_flag       TINYINT(1) NOT NULL DEFAULT 0,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_msg_cv (conversation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NULL,
  icon       VARCHAR(40) NOT NULL DEFAULT 'check',
  title      VARCHAR(200) NOT NULL,
  body       TEXT NULL,
  time_label VARCHAR(40) NULL,
  read_flag  TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_nt_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subscribers (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(190) NOT NULL,
  source     VARCHAR(60) NULL,
  status     VARCHAR(20) NOT NULL DEFAULT 'active',
  ip         VARCHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_news_email (email),
  KEY idx_sub_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- per-user notification / communication preferences
CREATE TABLE IF NOT EXISTS user_prefs (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  pref_key   VARCHAR(60) NOT NULL,
  pref_value VARCHAR(190) NOT NULL DEFAULT '1',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_pref (user_id, pref_key),
  CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enquiries (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kind       VARCHAR(40) NOT NULL DEFAULT 'contact',
  user_id    INT UNSIGNED NULL,
  name       VARCHAR(120) NULL,
  email      VARCHAR(190) NULL,
  phone      VARCHAR(40) NULL,
  subject    VARCHAR(200) NULL,
  message    TEXT NULL,
  meta       TEXT NULL,
  status     VARCHAR(30) NOT NULL DEFAULT 'new',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- growth
CREATE TABLE IF NOT EXISTS gift_cards (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(40) NOT NULL,
  amount      INT NOT NULL DEFAULT 0,
  balance     INT NOT NULL DEFAULT 0,
  purchaser   VARCHAR(190) NULL,
  recipient   VARCHAR(190) NULL,
  message     TEXT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_gc_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS referrals (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  code        VARCHAR(40) NOT NULL,
  friend_email VARCHAR(190) NULL,
  status      VARCHAR(30) NOT NULL DEFAULT 'invited',
  credit      INT NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_rf_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS campaigns (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code         VARCHAR(60) NOT NULL,
  name         VARCHAR(180) NOT NULL,
  window_label VARCHAR(80) NULL,
  status       VARCHAR(30) NOT NULL DEFAULT 'Draft',
  revenue      VARCHAR(40) NULL,
  level        ENUM('ok','info','warn','bad') NOT NULL DEFAULT 'info',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_camp_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- trust & ops
CREATE TABLE IF NOT EXISTS moderation_queue (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  item        VARCHAR(200) NOT NULL,
  ref_slug    VARCHAR(80) NULL,
  item_type   VARCHAR(120) NULL,
  note        VARCHAR(200) NULL,
  level       ENUM('ok','info','warn','bad') NOT NULL DEFAULT 'info',
  status      VARCHAR(30) NOT NULL DEFAULT 'open',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS fraud_flags (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code       VARCHAR(40) NOT NULL,
  subject    VARCHAR(160) NOT NULL,
  reason     VARCHAR(200) NULL,
  score      INT NOT NULL DEFAULT 0,
  level      ENUM('ok','info','warn','bad') NOT NULL DEFAULT 'info',
  status      VARCHAR(30) NOT NULL DEFAULT 'open',
  resolved_at DATETIME NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_fraud_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_log (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  actor      VARCHAR(140) NOT NULL,
  action     VARCHAR(240) NOT NULL,
  level      ENUM('ok','info','warn','bad') NOT NULL DEFAULT 'info',
  ip         VARCHAR(64) NULL,
  time_label VARCHAR(40) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS login_attempts (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  identifier VARCHAR(190) NOT NULL,
  ip         VARCHAR(64) NULL,
  success    TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_la_id (identifier)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================================
--  Owner (host) workspace
--  Tables backing the property-owner dashboard. Everything an owner sees is
--  scoped by properties.host_id, so one owner can never read another's data.
-- ==========================================================================

-- Per-date price and availability overrides for the calendar tab.
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

-- Seasonal / rule-based pricing shown on the revenue tab.
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

-- Co-hosts and staff for the team tab.
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

-- Saved guest-message templates.
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

-- External channel connections (Airbnb, Booking.com, ...).
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

-- Payout destination + schedule per owner.
CREATE TABLE IF NOT EXISTS host_payout_settings (
  host_id      INT UNSIGNED NOT NULL PRIMARY KEY,
  schedule     VARCHAR(30) NOT NULL DEFAULT 'weekly',
  bank_name    VARCHAR(120) NULL,
  account_name VARCHAR(120) NULL,
  account_last VARCHAR(8) NULL,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI/ops suggestions surfaced on the AI tools tab.
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

SET FOREIGN_KEY_CHECKS = 1;
