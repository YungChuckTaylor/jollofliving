# Deployable builds

## `jollof-update.zip` (139 KB) — updating a site you already have

Only the files that changed since the last upload. Extract it over your
existing `jollof` folder in cPanel File Manager and confirm the overwrite.

It does **not** touch `includes/config.php`, your database, or your uploads.

### How to download it

Open `jollof-update.zip` in this folder on GitHub and press the **Download**
button (or the ⋯ menu → *Download*). GitHub cannot preview a zip, so the page
just shows the file size and that button — that is expected.

### How to install it

1. cPanel → **File Manager** → open the `jollof` folder.
2. **Upload** `jollof-update.zip`, then right-click it → **Extract**.
3. Confirm overwriting the existing files.
4. **This build only:** cPanel → **phpMyAdmin** → your database → **SQL** tab →
   paste the contents of `database/migrate-owner-accounts.sql` (included in the
   zip) → **Go**. It only adds tables and is safe to run twice.
   Do *not* re-run `/install` — that is for fresh installs only.
5. **Hard-refresh** your browser: <kbd>Ctrl</kbd>+<kbd>F5</kbd>
   (<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> on a Mac). `site.js` is cached
   by the browser, and skipping this is the usual reason an update looks like
   it did not work.
6. Delete the zip from the server afterwards.

## Installing from scratch?

You want the full archive instead, which is not stored in the repository
because of its size. Build it locally with:

```bash
./tools/pack.sh        # writes jollofliving-hostgator.zip (4.3 MB)
```

Upload that to `public_html`, extract, then visit `/install`.

Full walkthrough: [../DEPLOYMENT.md](../DEPLOYMENT.md)
