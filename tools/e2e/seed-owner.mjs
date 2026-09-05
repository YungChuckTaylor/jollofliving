/**
 * Gives the seeded demo host (user 1, owner of the 12 demo properties) a known
 * password so the owner suite can exercise a fully-populated dashboard.
 * The installer deliberately clears seeded passwords, so this is opt-in.
 *
 *   node tools/e2e/seed-owner.mjs
 */
import { execFileSync } from 'node:child_process';

const PHP = process.env.PHP_BIN || '/tmp/phpw/node_modules/.bin/php-wasm-cli';
const code = `$_SERVER["SCRIPT_NAME"]="/x";
require_once "${process.cwd()}/public_html/includes/bootstrap.php";
DB::run("UPDATE users SET password_hash=? WHERE id=1",[password_hash("Password12345",PASSWORD_DEFAULT)]);
Auth::provisionHost(1);
echo "seeded host ready: ", DB::value("SELECT email FROM users WHERE id=1"), "\\n";`;

console.log(execFileSync(PHP, ['-r', code], { encoding: 'utf8' }));
