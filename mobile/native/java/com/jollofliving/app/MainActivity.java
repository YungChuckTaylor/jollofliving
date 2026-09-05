package com.jollofliving.app;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.ViewGroup;
import android.view.Window;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Jollof Living — the phone app.
 *
 * The whole interface lives inside the APK under assets/public, so the app
 * opens with no network at all. It is served to the WebView over
 * https://localhost, the same origin a Capacitor build uses, which is what
 * the server's mobile API already allows in its CORS rules — and it means the
 * browser treats the app as a secure origin, so localStorage, ES modules and
 * fetch all behave normally.
 *
 * Everything else — homes, prices, trips, wishlists, points, listings,
 * payouts — is fetched from the website's own database through
 * api/mobile/*.php.
 */
public class MainActivity extends Activity {

    /** Where the bundled interface is served from. */
    private static final String SCHEME = "https";
    private static final String HOST = "localhost";
    private static final String START_URL = "https://localhost/index.html";

    /** Folder inside assets/ that holds the built bundle. */
    private static final String ASSET_ROOT = "public";

    private static final int BACKGROUND = Color.parseColor("#0B0F0C");

    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        window.setBackgroundDrawable(new ColorDrawable(BACKGROUND));
        window.setStatusBarColor(BACKGROUND);
        window.setNavigationBarColor(BACKGROUND);

        if (isDebuggable()) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        web = new WebView(this);
        web.setBackgroundColor(BACKGROUND);
        web.setOverScrollMode(WebView.OVER_SCROLL_NEVER);

        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setSupportMultipleWindows(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setLoadWithOverviewMode(false);
        settings.setUseWideViewPort(false);
        settings.setBuiltInZoomControls(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setUserAgentString(settings.getUserAgentString() + " JollofLiving/1.0.0");

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(web, true);

        web.setWebViewClient(new BundleClient());
        web.setWebChromeClient(new WebChromeClient());

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(BACKGROUND);
        root.setFitsSystemWindows(true);
        root.addView(web, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);

        if (savedInstanceState != null) {
            web.restoreState(savedInstanceState);
        } else {
            web.loadUrl(START_URL);
        }
    }

    private boolean isDebuggable() {
        return (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
    }

    /* ------------------------------------------------------------ serving */

    /**
     * Answers https://localhost/... out of the APK's assets. Anything else —
     * the API, images on the website — goes to the network untouched.
     */
    private final class BundleClient extends WebViewClient {

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri url = request.getUrl();
            if (url == null || !SCHEME.equals(url.getScheme()) || !HOST.equals(url.getHost())) {
                return null;
            }
            return serve(url.getPath());
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri url = request.getUrl();
            if (url == null) {
                return false;
            }
            if (SCHEME.equals(url.getScheme()) && HOST.equals(url.getHost())) {
                return false;
            }
            openOutside(url);
            return true;
        }
    }

    /** One bundled file, or index.html for any unknown in-app path. */
    private WebResourceResponse serve(String path) {
        if (path == null || path.isEmpty() || "/".equals(path)) {
            path = "/index.html";
        }
        String asset = ASSET_ROOT + path;

        InputStream stream = null;
        try {
            stream = getAssets().open(asset);
        } catch (IOException missing) {
            try {
                asset = ASSET_ROOT + "/index.html";
                stream = getAssets().open(asset);
            } catch (IOException fatal) {
                return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found",
                        noStore(), new ByteArrayInputStream(new byte[0]));
            }
        }

        String mime = mimeOf(asset);
        String charset = mime.startsWith("text/")
                || mime.equals("application/javascript")
                || mime.equals("text/javascript")
                || mime.equals("application/json")
                || mime.equals("image/svg+xml") ? "UTF-8" : null;

        return new WebResourceResponse(mime, charset, 200, "OK", noStore(), stream);
    }

    private Map<String, String> noStore() {
        Map<String, String> headers = new HashMap<String, String>();
        headers.put("Cache-Control", "no-cache");
        headers.put("Access-Control-Allow-Origin", "*");
        return headers;
    }

    private static String mimeOf(String name) {
        String lower = name.toLowerCase(Locale.US);
        if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html";
        if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "text/javascript";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".json") || lower.endsWith(".map")) return "application/json";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".ico")) return "image/x-icon";
        if (lower.endsWith(".woff2")) return "font/woff2";
        if (lower.endsWith(".woff")) return "font/woff";
        if (lower.endsWith(".ttf")) return "font/ttf";
        if (lower.endsWith(".txt")) return "text/plain";
        return "application/octet-stream";
    }

    /** Links to the website, maps, mail and phone leave the app. */
    private void openOutside(Uri url) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, url);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        } catch (ActivityNotFoundException nothingHandlesIt) {
            // Nothing to do: staying put is better than crashing.
        }
    }

    /* --------------------------------------------------------------- back */

    /**
     * The interface keeps its own screen stack and shows a back arrow (#navBack)
     * whenever there is somewhere to go back to. The hardware button presses
     * that same arrow, so both routes behave identically; with nothing left on
     * the stack the app closes, which is what Android users expect.
     */
    @Override
    public void onBackPressed() {
        if (web == null) {
            super.onBackPressed();
            return;
        }
        web.evaluateJavascript(
                "(function(){var b=document.getElementById('navBack');"
                        + "if(b){b.click();return true;}return false;})()",
                new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String handled) {
                        if ("true".equals(handled)) {
                            return;
                        }
                        if (web.canGoBack()) {
                            web.goBack();
                        } else {
                            finish();
                        }
                    }
                });
    }

    /* ------------------------------------------------------------ plumbing */

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (web != null) {
            web.saveState(outState);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) {
            web.onResume();
            web.resumeTimers();
        }
    }

    @Override
    protected void onPause() {
        if (web != null) {
            web.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            ViewGroup parent = (ViewGroup) web.getParent();
            if (parent != null) {
                parent.removeView(web);
            }
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }
}
