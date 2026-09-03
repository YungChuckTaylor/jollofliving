<?php
/**
 * Jollof Living — content repository.
 * Every read the front-end needs, shaped exactly like the objects the
 * original JavaScript expected, so the design layer is unchanged.
 */
declare(strict_types=1);

// Defence in depth: these files are libraries, never entry points.
// .htaccess blocks the folder as well, but a mis-configured host must not leak them.
if (!defined('JL_ROOT')) {
    http_response_code(404);
    exit;
}


final class Repo
{
    private static array $memo = [];

    private static function memo(string $key, callable $fn)
    {
        if (!array_key_exists($key, self::$memo)) {
            self::$memo[$key] = $fn();
        }
        return self::$memo[$key];
    }

    public static function flush(): void
    {
        self::$memo = [];
    }

    /* ==================================================== settings/config */

    public static function settings(): array
    {
        return self::memo('settings', static fn() => DB::pairs('SELECT skey, svalue FROM settings'));
    }

    public static function setting(string $key, $default = null)
    {
        $s = self::settings();
        return array_key_exists($key, $s) ? $s[$key] : $default;
    }

    public static function saveSetting(string $key, $value): void
    {
        $exists = DB::value('SELECT 1 FROM settings WHERE skey = ?', [$key]);
        if ($exists) {
            DB::update('settings', ['svalue' => (string) $value, 'updated_at' => date('Y-m-d H:i:s')], 'skey = :k', ['k' => $key]);
        } else {
            DB::insert('settings', ['skey' => $key, 'svalue' => (string) $value]);
        }
        unset(self::$memo['settings']);
    }

    /** Booking maths constants (cleaning, service, vat, discounts…). */
    public static function rates(): array
    {
        return self::memo('rates', static function () {
            $out = [];
            foreach (self::settings() as $k => $v) {
                if (strpos($k, 'rate_') === 0) {
                    $out[substr($k, 5)] = (float) $v;
                }
            }
            return $out + [
                'cleaning' => 15000.0, 'service' => 0.08, 'vat' => 0.075,
                'weeklyDisc' => 0.12, 'monthlyDisc' => 0.25,
                'deposit' => 0.20, 'insurance' => 0.03,
            ];
        });
    }

    public static function fxRates(): array
    {
        return self::memo('fx', static function () {
            $out = [];
            foreach (DB::all('SELECT * FROM fx_rates ORDER BY sort_order') as $r) {
                $out[$r['code']] = [
                    'symbol'   => $r['symbol'],
                    'rate'     => (float) $r['rate'],
                    'decimals' => (int) $r['decimals'],
                ];
            }
            return $out ?: ['NGN' => ['symbol' => '₦', 'rate' => 1.0, 'decimals' => 0]];
        });
    }

    public static function addons(): array
    {
        return self::memo('addons', static function () {
            $out = [];
            foreach (DB::all('SELECT * FROM addons WHERE active = 1 ORDER BY sort_order') as $a) {
                $out[$a['akey']] = [
                    'name'    => $a['name'],
                    'price'   => (float) $a['price'],
                    'percent' => (int) $a['is_percent'] === 1,
                    'ico'     => $a['icon'],
                    'note'    => $a['note'],
                ];
            }
            return $out;
        });
    }

    public static function promos(): array
    {
        return self::memo('promos', static function () {
            $out = [];
            foreach (DB::all('SELECT * FROM promos WHERE active = 1') as $p) {
                $out[$p['code']] = [
                    'off'   => (float) $p['off'],
                    'flat'  => (int) $p['flat'],
                    'label' => $p['label'],
                ];
            }
            return $out;
        });
    }

    public static function promo(string $code): ?array
    {
        $code = strtoupper(trim($code));
        $p = self::promos();
        return $p[$code] ?? null;
    }

    public static function payMethods(): array
    {
        return self::memo('paym', static fn() => array_map(static fn($m) => [
            'id'   => $m['mkey'],
            'name' => $m['name'],
            'note' => $m['note'],
            'ico'  => $m['icon'],
        ], DB::all('SELECT * FROM pay_methods WHERE active = 1 ORDER BY sort_order')));
    }

    /* ========================================================= properties */

    private static function hydrateProperty(array $p, bool $deep = false): array
    {
        $row = [
            'id'        => $p['slug'],
            'pid'       => (int) $p['id'],
            'name'      => $p['name'],
            'area'      => $p['area'],
            'city'      => $p['city'],
            'img'       => $p['img'],
            'price'     => (int) $p['price'],
            'oldPrice'  => $p['old_price'] !== null ? (int) $p['old_price'] : null,
            'rating'    => (float) $p['rating'],
            'reviews'   => (int) $p['reviews_count'],
            'beds'      => (float) $p['beds'],
            'baths'     => (float) $p['baths'],
            'guests'    => (int) $p['guests'],
            'type'      => $p['ptype'],
            'badge'     => $p['badge'],
            'badgeGold' => (int) $p['badge_gold'] === 1,
            'instant'   => (int) $p['instant'] === 1,
            'policy'    => $p['policy'],
            'acreage'   => $p['area'],
            'map'       => [(float) $p['map_x'], (float) $p['map_y']],
            'featured'  => (int) $p['featured'] === 1,
            'new'       => (int) $p['is_new'] === 1,
            'tour'      => (int) $p['tour'] === 1,
            'floor'     => $p['floor_label'],
            'soldOut'   => $p['sold_out'],
            'desc'      => $p['description'],
            'aiSummary' => $p['ai_summary'],
            'status'    => $p['status'],
        ];
        if (!$deep) {
            return $row;
        }
        $id = (int) $p['id'];
        $row['amens'] = array_column(
            DB::all('SELECT amenity FROM property_amenities WHERE property_id = ? ORDER BY sort_order', [$id]),
            'amenity'
        );
        $sc = DB::row('SELECT * FROM property_scores WHERE property_id = ?', [$id]);
        $row['scores'] = $sc ? [
            'c'   => (float) $sc['cleanliness'],
            'a'   => (float) $sc['accuracy'],
            'com' => (float) $sc['communication'],
            'loc' => (float) $sc['location'],
            'ci'  => (float) $sc['checkin'],
            'v'   => (float) $sc['value_score'],
        ] : null;
        $row['nearby'] = array_map(
            static fn($n) => [$n['place'], $n['distance']],
            DB::all('SELECT place, distance FROM property_nearby WHERE property_id = ? ORDER BY sort_order', [$id])
        );
        $row['reviewsList'] = array_map(
            static fn($r) => [$r['author'], $r['meta'], $r['body']],
            DB::all("SELECT author, meta, body FROM reviews WHERE property_id = ? AND status = 'published' ORDER BY id", [$id])
        );
        $row['gallery'] = array_column(
            DB::all('SELECT path FROM property_images WHERE property_id = ? ORDER BY sort_order', [$id]),
            'path'
        );
        return $row;
    }

    /** All live properties, hydrated for the listings grid. */
    public static function properties(bool $deep = false, bool $includeHidden = false): array
    {
        $key = 'props_' . ($deep ? 'd' : 's') . ($includeHidden ? '_all' : '');
        return self::memo($key, static function () use ($deep, $includeHidden) {
            $sql = 'SELECT * FROM properties' . ($includeHidden ? '' : " WHERE status = 'live'") . ' ORDER BY sort_order, id';
            return array_map(static fn($p) => self::hydrateProperty($p, $deep), DB::all($sql));
        });
    }

    /** Fully hydrated single property, by slug. */
    public static function property(string $slug): ?array
    {
        $p = DB::row('SELECT * FROM properties WHERE slug = ?', [$slug]);
        return $p ? self::hydrateProperty($p, true) : null;
    }

    public static function propertyById(int $id): ?array
    {
        $p = DB::row('SELECT * FROM properties WHERE id = ?', [$id]);
        return $p ? self::hydrateProperty($p, true) : null;
    }

    public static function propertyIdBySlug(string $slug): ?int
    {
        $v = DB::value('SELECT id FROM properties WHERE slug = ?', [$slug]);
        return $v === null ? null : (int) $v;
    }

    /** Slugs used to generate stay/booking routes. */
    public static function propertySlugs(): array
    {
        return array_column(DB::all("SELECT slug FROM properties WHERE status = 'live' ORDER BY sort_order"), 'slug');
    }

    /**
     * Filtered search used by stays.php and /api/properties.
     * $f: loc, guests, price (max, in thousands NGN), type, instant, flex, q, sort
     */
    public static function searchProperties(array $f = []): array
    {
        $all = self::properties(false);
        $loc = $f['loc'] ?? 'all';
        $guests = (int) ($f['guests'] ?? 1);
        $maxPrice = (int) ($f['price'] ?? 0);
        $type = $f['type'] ?? 'all';
        $instant = !empty($f['instant']);
        $flex = !empty($f['flex']);
        $q = strtolower(trim((string) ($f['q'] ?? '')));

        $rows = array_values(array_filter($all, static function ($p) use ($loc, $guests, $maxPrice, $type, $instant, $flex, $q) {
            if ($loc !== 'all' && $loc !== '' && $p['area'] !== $loc && $p['city'] !== $loc) {
                return false;
            }
            if ($guests > 0 && $p['guests'] < $guests) {
                return false;
            }
            if ($maxPrice > 0 && $p['price'] > $maxPrice * 1000) {
                return false;
            }
            if ($type !== 'all' && $type !== '' && $p['type'] !== $type) {
                return false;
            }
            if ($instant && !$p['instant']) {
                return false;
            }
            if ($flex && $p['policy'] !== 'flexible') {
                return false;
            }
            if ($q !== '') {
                $hay = strtolower($p['name'] . ' ' . $p['area'] . ' ' . $p['city'] . ' ' . $p['type']);
                if (strpos($hay, $q) === false) {
                    return false;
                }
            }
            return true;
        }));

        switch ($f['sort'] ?? '') {
            case 'price-asc':  usort($rows, static fn($a, $b) => $a['price'] <=> $b['price']); break;
            case 'price-desc': usort($rows, static fn($a, $b) => $b['price'] <=> $a['price']); break;
            case 'rating':     usort($rows, static fn($a, $b) => $b['rating'] <=> $a['rating']); break;
            case 'new':        usort($rows, static fn($a, $b) => ($b['new'] ? 1 : 0) <=> ($a['new'] ? 1 : 0)); break;
        }
        return $rows;
    }

    /** Distinct areas for the filter dropdown. */
    public static function areas(): array
    {
        return array_column(
            DB::all("SELECT DISTINCT area FROM properties WHERE status = 'live' ORDER BY area"),
            'area'
        );
    }

    public static function propertyTypes(): array
    {
        return array_column(
            DB::all("SELECT DISTINCT ptype FROM properties WHERE status = 'live' ORDER BY ptype"),
            'ptype'
        );
    }

    /* ======================================================== collections */

    public static function collections(): array
    {
        return self::memo('cols', static fn() => array_map(static fn($c) => [
            'id'   => $c['slug'],
            'cid'  => (int) $c['id'],
            'name' => $c['name'],
            'sub'  => $c['sub'],
            'img'  => $c['img'],
            'wide' => (int) $c['wide'] === 1,
            'tall' => (int) $c['tall'] === 1,
        ], DB::all('SELECT * FROM collections ORDER BY sort_order')));
    }

    /** slug => [property slugs] */
    public static function collectionMap(): array
    {
        return self::memo('colmap', static function () {
            $rows = DB::all(
                'SELECT c.slug AS cs, p.slug AS ps
                   FROM collection_properties cp
                   JOIN collections c ON c.id = cp.collection_id
                   JOIN properties  p ON p.id = cp.property_id
                  ORDER BY cp.sort_order'
            );
            $out = [];
            foreach ($rows as $r) {
                $out[$r['cs']][] = $r['ps'];
            }
            return $out;
        });
    }

    /* ===================================================== neighbourhoods */

    public static function neighborhoods(bool $deep = true): array
    {
        return self::memo('nb_' . ($deep ? 'd' : 's'), static function () use ($deep) {
            $rows = DB::all('SELECT * FROM neighborhoods ORDER BY sort_order');
            $items = [];
            if ($deep) {
                foreach (DB::all('SELECT * FROM neighborhood_items ORDER BY sort_order') as $i) {
                    $items[(int) $i['neighborhood_id']][$i['kind']][] = $i['item'];
                }
            }
            return array_map(static function ($n) use ($items, $deep) {
                $o = [
                    'id'    => $n['slug'],
                    'nid'   => (int) $n['id'],
                    'name'  => $n['name'],
                    'tag'   => $n['tag'],
                    'img'   => $n['img'],
                    'avg'   => (int) $n['avg_price'],
                    'stays' => (int) $n['stays_count'],
                    'desc'  => $n['description'],
                ];
                if ($deep) {
                    $x = $items[(int) $n['id']] ?? [];
                    foreach (['dining', 'night', 'transport', 'safety', 'culture'] as $k) {
                        $o[$k] = $x[$k] ?? [];
                    }
                }
                return $o;
            }, $rows);
        });
    }

    public static function neighborhood(string $slug): ?array
    {
        foreach (self::neighborhoods(true) as $n) {
            if ($n['id'] === $slug) {
                return $n;
            }
        }
        return null;
    }

    public static function neighborhoodSlugs(): array
    {
        return array_column(DB::all('SELECT slug FROM neighborhoods ORDER BY sort_order'), 'slug');
    }

    /* ========================================================= experiences */

    public static function experiences(): array
    {
        return self::memo('exps', static fn() => array_map(static fn($x) => [
            'id'    => $x['slug'],
            'xid'   => (int) $x['id'],
            'name'  => $x['name'],
            'cat'   => $x['category'],
            'img'   => $x['img'],
            'price' => (int) $x['price'],
            'dur'   => $x['duration'],
            'desc'  => $x['description'],
        ], DB::all('SELECT * FROM experiences WHERE active = 1 ORDER BY sort_order')));
    }

    public static function experience(string $slug): ?array
    {
        foreach (self::experiences() as $x) {
            if ($x['id'] === $slug) {
                return $x;
            }
        }
        return null;
    }

    /* ================================================================ blog */

    public static function blogPosts(): array
    {
        return self::memo('blog', static fn() => array_map(static function ($b) {
            $body = json_decode((string) $b['body'], true);
            return [
                'slug'    => $b['slug'],
                'bid'     => (int) $b['id'],
                'cat'     => $b['category'],
                'title'   => $b['title'],
                'date'    => $b['date_label'],
                'read'    => $b['read_time'],
                'img'     => $b['img'],
                'excerpt' => $b['excerpt'],
                'body'    => is_array($body) ? $body : array_filter(preg_split('~\n\s*\n~', (string) $b['body']) ?: []),
            ];
        }, DB::all('SELECT * FROM blog_posts WHERE published = 1 ORDER BY sort_order, id')));
    }

    public static function blogPost(string $slug): ?array
    {
        foreach (self::blogPosts() as $b) {
            if ($b['slug'] === $slug) {
                return $b;
            }
        }
        return null;
    }

    public static function blogSlugs(): array
    {
        return array_column(DB::all('SELECT slug FROM blog_posts WHERE published = 1 ORDER BY sort_order'), 'slug');
    }

    /* ======================================================= content bits */

    public static function testimonials(): array
    {
        return self::memo('tst', static fn() => array_map(
            static fn($t) => [$t['author'], $t['meta'], $t['quote']],
            DB::all('SELECT * FROM testimonials WHERE active = 1 ORDER BY sort_order')
        ));
    }

    public static function faqs(): array
    {
        return self::memo('faq', static fn() => array_map(
            static fn($f) => [$f['question'], $f['answer']],
            DB::all('SELECT * FROM faqs ORDER BY sort_order')
        ));
    }

    public static function helpCategories(): array
    {
        return self::memo('help', static fn() => array_map(static fn($h) => [
            'id'   => $h['slug'],
            'name' => $h['name'],
            'n'    => (int) $h['article_count'],
            'ico'  => $h['icon'],
        ], DB::all('SELECT * FROM help_categories ORDER BY sort_order')));
    }

    public static function roadmap(): array
    {
        return self::memo('road', static fn() => array_map(static fn($r) => [
            'ph'     => $r['phase'],
            'title'  => $r['title'],
            'desc'   => $r['description'],
            'status' => $r['status'],
        ], DB::all('SELECT * FROM roadmap ORDER BY sort_order')));
    }

    public static function tiers(): array
    {
        return self::memo('tiers', static function () {
            $perks = [];
            foreach (DB::all('SELECT * FROM tier_perks ORDER BY sort_order') as $p) {
                $perks[$p['tkey']][] = $p['perk'];
            }
            return array_map(static fn($t) => [
                'key'      => $t['tkey'],
                'letter'   => $t['letter'],
                'name'     => $t['name'],
                'req'      => $t['requirement'],
                'pts'      => $t['points_label'],
                'minPts'   => (int) $t['min_points'],
                'mult'     => (int) $t['multiplier'] . '×',
                'multi'    => (int) $t['multiplier'],
                'featured' => (int) $t['featured'] === 1,
                'perks'    => $perks[$t['tkey']] ?? [],
            ], DB::all('SELECT * FROM tiers ORDER BY sort_order'));
        });
    }

    public static function tier(string $key): array
    {
        foreach (self::tiers() as $t) {
            if ($t['key'] === $key) {
                return $t;
            }
        }
        $all = self::tiers();
        return $all[0] ?? ['key' => 'bronze', 'name' => 'Bronze', 'multi' => 5, 'mult' => '5×', 'letter' => 'B', 'perks' => [], 'req' => '', 'pts' => '0+', 'minPts' => 0, 'featured' => false];
    }

    /** A single user row. */
    public static function userRow(int $id): ?array
    {
        return DB::row('SELECT * FROM users WHERE id = ?', [$id]) ?: null;
    }

    public static function pointsLedger(int $userId): array
    {
        return array_map(static fn($r) => [
            $r['date_label'],
            $r['description'],
            ((int) $r['amount'] > 0 ? '+' : '−') . number_format(abs((int) $r['amount'])),
            $r['kind'],
        ], DB::all('SELECT * FROM points_ledger WHERE user_id = ? ORDER BY id DESC LIMIT 40', [$userId]));
    }

    public static function pageMeta(string $key): array
    {
        $rows = self::memo('meta', static fn() => DB::all('SELECT * FROM page_meta'));
        foreach ($rows as $r) {
            if ($r['page_key'] === $key) {
                return ['title' => $r['title'], 'desc' => (string) $r['description']];
            }
        }
        return [
            'title' => 'Jollof Living — Luxury Living, African Soul',
            'desc'  => 'Premium luxury apartments in Lagos & Abuja — exclusive short-term and long-term stays with concierge, escrow payments and AI.',
        ];
    }

    /* ============================================================ reviews */

    public static function latestReviews(int $limit = 12): array
    {
        return DB::all(
            "SELECT r.*, p.name AS property_name, p.slug AS property_slug, p.img
               FROM reviews r JOIN properties p ON p.id = r.property_id
              WHERE r.status = 'published'
              ORDER BY r.id DESC LIMIT " . max(1, $limit)
        );
    }

    public static function addReview(int $propertyId, array $data): int
    {
        $id = DB::insert('reviews', [
            'property_id' => $propertyId,
            'user_id'     => $data['user_id'] ?? null,
            'booking_ref' => $data['booking_ref'] ?? null,
            'author'      => $data['author'],
            'meta'        => $data['meta'] ?? null,
            'body'        => $data['body'],
            'rating'      => $data['rating'] ?? 5.0,
            'scores'      => isset($data['scores']) ? json_encode($data['scores']) : null,
            'status'      => $data['status'] ?? 'pending',
        ]);
        self::recalcRating($propertyId);
        return $id;
    }

    public static function recalcRating(int $propertyId): void
    {
        $row = DB::row(
            "SELECT COUNT(*) AS n, AVG(rating) AS avg_rating FROM reviews WHERE property_id = ? AND status = 'published'",
            [$propertyId]
        );
        if ($row && (int) $row['n'] > 0) {
            DB::update('properties', [
                'rating'        => round((float) $row['avg_rating'], 2),
                'reviews_count' => (int) $row['n'],
            ], 'id = :id', ['id' => $propertyId]);
        }
    }

    /* ========================================================= wishlists */

    public static function wishlistId(int $userId, string $slug = 'default'): int
    {
        $id = DB::value('SELECT id FROM wishlists WHERE user_id = ? AND slug = ?', [$userId, $slug]);
        if ($id) {
            return (int) $id;
        }
        return DB::insert('wishlists', [
            'user_id' => $userId,
            'slug'    => $slug,
            'name'    => $slug === 'default' ? 'My wishlist' : ucfirst(str_replace('-', ' ', $slug)),
        ]);
    }

    public static function wishlists(int $userId): array
    {
        $lists = DB::all('SELECT * FROM wishlists WHERE user_id = ? ORDER BY id', [$userId]);
        if (!$lists) {
            self::wishlistId($userId);
            $lists = DB::all('SELECT * FROM wishlists WHERE user_id = ? ORDER BY id', [$userId]);
        }
        foreach ($lists as &$l) {
            $l['items'] = array_column(
                DB::all(
                    'SELECT p.slug FROM wishlist_items wi JOIN properties p ON p.id = wi.property_id WHERE wi.wishlist_id = ?',
                    [(int) $l['id']]
                ),
                'slug'
            );
        }
        return $lists;
    }

    public static function wishlistSlugs(int $userId, string $listSlug = 'default'): array
    {
        $wid = self::wishlistId($userId, $listSlug);
        return array_column(
            DB::all('SELECT p.slug FROM wishlist_items wi JOIN properties p ON p.id = wi.property_id WHERE wi.wishlist_id = ?', [$wid]),
            'slug'
        );
    }

    /** Returns true when the property ends up saved. */
    public static function toggleWishlist(int $userId, int $propertyId, string $listSlug = 'default'): bool
    {
        $wid = self::wishlistId($userId, $listSlug);
        $has = DB::value('SELECT 1 FROM wishlist_items WHERE wishlist_id = ? AND property_id = ?', [$wid, $propertyId]);
        if ($has) {
            DB::delete('wishlist_items', 'wishlist_id = :w AND property_id = :p', ['w' => $wid, 'p' => $propertyId]);
            return false;
        }
        DB::insert('wishlist_items', ['wishlist_id' => $wid, 'property_id' => $propertyId]);
        return true;
    }

    /* ========================================================== compare */

    public static function compareSlugs(int $userId): array
    {
        return array_column(
            DB::all('SELECT p.slug FROM compare_items c JOIN properties p ON p.id = c.property_id WHERE c.user_id = ? ORDER BY c.created_at', [$userId]),
            'slug'
        );
    }

    public static function toggleCompare(int $userId, int $propertyId): array
    {
        $has = DB::value('SELECT 1 FROM compare_items WHERE user_id = ? AND property_id = ?', [$userId, $propertyId]);
        if ($has) {
            DB::delete('compare_items', 'user_id = :u AND property_id = :p', ['u' => $userId, 'p' => $propertyId]);
            return [true, 'Removed from compare'];
        }
        $n = (int) DB::value('SELECT COUNT(*) FROM compare_items WHERE user_id = ?', [$userId], 0);
        if ($n >= 3) {
            return [false, 'You can compare up to three residences'];
        }
        DB::insert('compare_items', ['user_id' => $userId, 'property_id' => $propertyId]);
        return [true, 'Added to compare'];
    }

    /* ==================================================== recently viewed */

    public static function recordView(int $propertyId): void
    {
        $uid = Auth::id();
        try {
            DB::run(
                'DELETE FROM recent_views WHERE property_id = ? AND ' . ($uid ? 'user_id = ?' : 'session_key = ?'),
                [$propertyId, $uid ?: Auth::sessionKey()]
            );
            DB::insert('recent_views', [
                'user_id'     => $uid,
                'session_key' => $uid ? null : Auth::sessionKey(),
                'property_id' => $propertyId,
            ]);
        } catch (Throwable $e) {
        }
    }

    public static function recentSlugs(int $limit = 8): array
    {
        $uid = Auth::id();
        $sql = 'SELECT p.slug FROM recent_views rv JOIN properties p ON p.id = rv.property_id WHERE '
            . ($uid ? 'rv.user_id = ?' : 'rv.session_key = ?')
            . ' ORDER BY rv.viewed_at DESC LIMIT ' . max(1, $limit);
        return array_column(DB::all($sql, [$uid ?: Auth::sessionKey()]), 'slug');
    }

    /* =========================================================== notices */

    public static function notifications(?int $userId): array
    {
        if (!$userId) {
            return [];
        }
        return array_map(static fn($n) => [
            'id'     => (int) $n['id'],
            'ico'    => $n['icon'],
            'title'  => $n['title'],
            'body'   => $n['body'],
            'time'   => $n['time_label'] ?: date('M j', strtotime((string) $n['created_at'])),
            'unread' => (int) $n['read_flag'] === 0,
        ], DB::all('SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 40', [$userId]));
    }

    public static function unreadNotifications(?int $userId): int
    {
        if (!$userId) {
            return 0;
        }
        return (int) DB::value('SELECT COUNT(*) FROM notifications WHERE user_id = ? AND read_flag = 0', [$userId], 0);
    }

    public static function notify(int $userId, string $title, string $body, string $icon = 'check'): int
    {
        return DB::insert('notifications', [
            'user_id'    => $userId,
            'icon'       => $icon,
            'title'      => $title,
            'body'       => $body,
            'time_label' => 'just now',
        ]);
    }

    /* ====================================================== conversations */

    public static function conversations(?int $userId): array
    {
        if (!$userId) {
            return [];
        }
        $rows = DB::all('SELECT * FROM conversations WHERE user_id = ? ORDER BY id', [$userId]);
        return array_map(static function ($c) {
            $c['msgs'] = array_map(static fn($m) => [
                'from' => $m['sender'] === 'me' ? 'me' : 'bot',
                'text' => $m['body'],
                't'    => $m['time_label'] ?: date('H:i', strtotime((string) $m['created_at'])),
                'read' => (int) $m['read_flag'] === 1,
            ], DB::all('SELECT * FROM messages WHERE conversation_id = ? ORDER BY id', [(int) $c['id']]));
            return [
                'id'     => $c['ckey'],
                'cid'    => (int) $c['id'],
                'name'   => $c['name'],
                'sub'    => $c['subtitle'],
                'online' => (int) $c['online'] === 1,
                'kind'   => $c['kind'] ?? 'support',
                'msgs'   => $c['msgs'],
            ];
        }, $rows);
    }

    public static function unreadMessages(?int $userId): int
    {
        if (!$userId) {
            return 0;
        }
        return (int) DB::value(
            "SELECT COUNT(*) FROM messages m JOIN conversations c ON c.id = m.conversation_id
              WHERE c.user_id = ? AND m.sender <> 'me' AND m.read_flag = 0",
            [$userId],
            0
        );
    }

    /** Make sure a new account has the default concierge/support threads. */
    public static function ensureConversations(int $userId): void
    {
        if (DB::value('SELECT 1 FROM conversations WHERE user_id = ?', [$userId])) {
            return;
        }
        $cid = DB::insert('conversations', [
            'user_id' => $userId, 'ckey' => 'concierge', 'kind' => 'concierge',
            'name' => 'Jollof Concierge', 'subtitle' => 'AI · online', 'online' => 1,
            'last_message_at' => date('Y-m-d H:i:s'),
        ]);
        DB::insert('messages', [
            'conversation_id' => $cid, 'sender' => 'bot',
            'body' => "Welcome! I'm <b>Jollof</b> ✨ — booking, transfers, chefs, anything.",
            'time_label' => date('H:i'),
        ]);
        $sid = DB::insert('conversations', [
            'user_id' => $userId, 'ckey' => 'support', 'kind' => 'support',
            'name' => 'Jollof Support', 'subtitle' => '24/7 · human team', 'online' => 1,
            'last_message_at' => date('Y-m-d H:i:s'),
        ]);
        DB::insert('messages', [
            'conversation_id' => $sid, 'sender' => 'bot',
            'body' => 'Hello! Our team is here around the clock — reply any time.',
            'time_label' => date('H:i'),
        ]);
    }

    /* ============================================================ admin */

    public static function adminState(): array
    {
        return [
            'users' => array_map(static fn($u) => [
                $u['name'],
                $u['email'],
                ucfirst((string) $u['role']) . ((int) $u['is_host'] === 1 && $u['role'] !== 'host' ? ' · Host' : ''),
                ucfirst((string) $u['tier']),
                date('M Y', strtotime((string) $u['created_at'])),
                $u['status'],
                $u['status_level'],
                (int) $u['id'],
            ], DB::all('SELECT * FROM users ORDER BY id LIMIT 200')),
            'moderation' => array_map(static fn($m) => [
                $m['item'], $m['ref_slug'] ?: '—', $m['item_type'], $m['note'], $m['level'], (int) $m['id'],
            ], DB::all("SELECT * FROM moderation_queue WHERE status = 'open' ORDER BY id")),
            'fraud' => array_map(static fn($f) => [
                $f['code'], $f['subject'], $f['reason'], (string) $f['score'], $f['level'], (int) $f['id'],
            ], DB::all("SELECT * FROM fraud_flags WHERE status = 'open' ORDER BY score DESC")),
            'campaigns' => array_map(static fn($c) => [
                $c['code'], $c['name'], $c['window_label'], $c['status'], $c['revenue'] ?: '—', $c['level'], (int) $c['id'],
            ], DB::all('SELECT * FROM campaigns ORDER BY id')),
            'audit' => array_map(static fn($a) => [
                $a['time_label'] ?: date('M j, H:i', strtotime((string) $a['created_at'])),
                $a['actor'], $a['action'], $a['level'],
            ], DB::all('SELECT * FROM audit_log ORDER BY id DESC LIMIT 60')),
            'cms' => array_map(static fn($c) => [
                $c['title'], $c['status'], $c['updated_label'] ?: date('M j', strtotime((string) $c['updated_at'])), $c['owner'], (int) $c['id'],
            ], DB::all('SELECT * FROM cms_blocks ORDER BY id')),
        ];
    }

    /** Headline numbers for the back office dashboard — all real queries. */
    public static function adminStats(): array
    {
        $since30 = date('Y-m-d H:i:s', strtotime('-30 days'));
        $gmv = (int) DB::value("SELECT COALESCE(SUM(total),0) FROM bookings WHERE status <> 'cancelled' AND created_at > ?", [$since30], 0);
        $gmvAll = (int) DB::value("SELECT COALESCE(SUM(total),0) FROM bookings WHERE status <> 'cancelled'", [], 0);
        return [
            'gmv30'        => $gmv,
            'gmvAll'       => $gmvAll,
            'bookings30'   => (int) DB::value('SELECT COUNT(*) FROM bookings WHERE created_at > ?', [$since30], 0),
            'bookingsAll'  => (int) DB::value('SELECT COUNT(*) FROM bookings', [], 0),
            'pending'      => (int) DB::value("SELECT COUNT(*) FROM bookings WHERE status = 'pending'", [], 0),
            'escrowHeld'   => (int) DB::value("SELECT COALESCE(SUM(total),0) FROM bookings WHERE escrow_status = 'held' AND status IN ('confirmed','active')", [], 0),
            'listings'     => (int) DB::value("SELECT COUNT(*) FROM properties WHERE status = 'live'", [], 0),
            'listingsPend' => (int) DB::value("SELECT COUNT(*) FROM properties WHERE status = 'pending'", [], 0),
            'users'        => (int) DB::value('SELECT COUNT(*) FROM users', [], 0),
            'hosts'        => (int) DB::value('SELECT COUNT(*) FROM users WHERE is_host = 1', [], 0),
            'reviews'      => (int) DB::value("SELECT COUNT(*) FROM reviews WHERE status = 'published'", [], 0),
            'reviewsPend'  => (int) DB::value("SELECT COUNT(*) FROM reviews WHERE status = 'pending'", [], 0),
            'subscribers'  => (int) DB::value('SELECT COUNT(*) FROM subscribers', [], 0),
            'enquiries'    => (int) DB::value("SELECT COUNT(*) FROM enquiries WHERE status = 'new'", [], 0),
            'moderation'   => (int) DB::value("SELECT COUNT(*) FROM moderation_queue WHERE status = 'open'", [], 0),
            'fraud'        => (int) DB::value("SELECT COUNT(*) FROM fraud_flags WHERE status = 'open'", [], 0),
            'avgRating'    => round((float) DB::value("SELECT COALESCE(AVG(rating),0) FROM reviews WHERE status='published'", [], 0), 2),
            'takeRate'     => (float) self::setting('host_take_rate', 0.12),
        ];
    }

    /** Monthly booking revenue for the last 12 months (chart data). */
    public static function revenueSeries(int $months = 12): array
    {
        $out = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $start = date('Y-m-01 00:00:00', strtotime("-$i months"));
            $end = date('Y-m-01 00:00:00', strtotime('-' . ($i - 1) . ' months'));
            $v = (int) DB::value(
                "SELECT COALESCE(SUM(total),0) FROM bookings WHERE status <> 'cancelled' AND created_at >= ? AND created_at < ?",
                [$start, $end],
                0
            );
            $out[] = ['l' => date('M', strtotime($start)), 'v' => (int) round($v / 1000000)];
        }
        return $out;
    }

    public static function revenueByCity(): array
    {
        return array_map(static fn($r) => [
            'l' => $r['city'],
            'v' => (int) round(((int) $r['total']) / 1000000),
        ], DB::all(
            "SELECT p.city, COALESCE(SUM(b.total),0) AS total
               FROM bookings b JOIN properties p ON p.id = b.property_id
              WHERE b.status <> 'cancelled'
              GROUP BY p.city ORDER BY total DESC"
        ));
    }
}
