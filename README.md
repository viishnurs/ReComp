# ReComp v5 — Motivational iPhone redesign

**What visibly changed:** The Home tab now begins with a blue gradient motivational hero, daily momentum ring, 7-day activity strip, and prominent calorie/protein progress cards. There are prominent **Log a meal** and **Ask AI Coach** shortcuts. The momentum indicator is a simple 5-action encouragement metric, **not** a measure of health or success; it does not reward eating less.

**Seeing the new design:** Open the **Home** tab after installing. This is a new design, not only a backend change. Version 5 uses a new service-worker cache name; on your iPhone, close/reopen the Home Screen app with internet access after deploying, and refresh it if necessary. If an old version persists, use Safari to visit the deployed site and refresh. Avoid clearing website data without exporting a backup first.

**Compatibility:** No data migration. Existing `recomp-log-v1` data, ReComp v3 features, and the v4 AI backend are retained. Keep the same GitHub Pages URL and back up your data before deploying.

**Security:** Cloudflare Worker still holds the Gemini API key; do not expose it in client-side source. Chat uses internet and optional opt-in tracking data.

# ReComp v4 — AI Coach (Windows + iPhone)

Your v3 ReComp fitness PWA, with a working AI Coach integration. **AI does not work until you deploy the backend and configure two private secrets.** No API key is inside the public files.

## Before upgrading

1. Open your current ReComp app and **export a JSON backup**. Save it somewhere safe.
2. Keep using the **same GitHub Pages site URL** when you update to v4. Existing `recomp-log-v1` records should remain on that same origin/browser storage. If changing origins, import your backup.
3. The AI chat history is separate (`recomp-ai-chat-v1`). No changes to the main data format.

## 1. Free accounts and tools

* GitHub (public Pages hosting): https://github.com
* Cloudflare Workers Free: https://dash.cloudflare.com
* Google AI Studio for Gemini API key: https://aistudio.google.com/apikey
* Node.js LTS (Windows): https://nodejs.org

Google Gemini has a free tier for selected models, subject to rate limits, region and model availability. Free-tier prompts/data may be used by Google to improve products. Do not enable billing if you want to remain strictly free. Cloudflare Workers Free also has usage limits.

## 2. Deploy the backend on Windows

1. Open PowerShell in the **backend** folder.
2. Run `npx wrangler login` and authorize your Cloudflare account.
3. Edit `backend/wrangler.toml`: replace `YOUR_USERNAME` with your actual GitHub username, so `ALLOWED_ORIGIN` is `https://YOUR_USERNAME.github.io` (NO trailing slash and NO repo path). If testing from Windows localhost, optionally add `DEV_ORIGIN = "http://localhost:8000"` below `ALLOWED_ORIGIN`.
4. Run `npx wrangler secret put GEMINI_API_KEY`, then paste your key from Google AI Studio (not into your HTML).
5. Generate a long random token. For example in PowerShell:
   `[Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))`
   Save the resulting 48-character token in your own password manager.
6. Run `npx wrangler secret put COACH_ACCESS_TOKEN` and enter that generated token.
7. Run `npx wrangler deploy`. Copy the Worker URL printed in the terminal (e.g. `https://recomp-ai-coach.username.workers.dev`).

The backend accepts only requests from your configured origin and requires the private token. This protects the API key from appearing in the client, but the token is a shared secret: don't share it. If exposed, rotate it using `npx wrangler secret put COACH_ACCESS_TOKEN`. Origin checks alone are not sufficient authentication. Do not put either secret in GitHub.

## 3. Deploy the ReComp PWA on GitHub Pages

Upload the **contents** of this package EXCEPT the `backend/` directory if preferred (backend files contain no secrets, but are unnecessary for hosting the PWA) to your existing GitHub Pages repository at the root. Keep `index.html`, `ai-coach.js`, `ai-coach.css`, `enhancements.js`, `enhancements.css`, `sw.js`, `manifest.webmanifest` and `icons/` together. Enable Pages: Settings → Pages → deploy from `main` / `root`.

It is okay to include the backend source in your repository; NEVER upload `.dev.vars`, API keys, or access tokens. Avoid opening `index.html` from a Windows file path. To test locally run `py -m http.server 8000` in the PWA folder, then visit http://localhost:8000 (if DEV_ORIGIN is configured).

## 4. Configure AI inside ReComp

1. Open your hosted ReComp, go to the **AI Coach** tab in the bottom navigation.
2. Enter your Worker URL and your private access token. The URL is remembered on your device; the token is kept only in memory until the page is reloaded.
3. Ask: `Make a six-day gym workout plan with legs Monday and a recovery day.`
4. To include your tracker data, tick **Include a compact summary of my ReComp logs** before asking. It sends ONLY the last seven days of aggregated calories, protein, steps, water, session counts, optional recorded weight, and the targets. It does **not** send individual meals, notes, photos, or measurements.
5. Chat text is stored locally on the device with a Clear Chat button. Messages are transmitted to Google through the Worker whenever you send a question.

## 5. Add to iPhone

On the iPhone, open the published GitHub Pages link in **Safari** → Share → Add to Home Screen → Add. The main tracker works offline after initial cache, but **AI needs internet**. If old screens remain, close/reopen the PWA or refresh Safari and allow the updated service worker to activate.

## Limits & privacy

* Google free-tier availability, rate limits and data-use terms can change. This build defaults to `gemini-2.5-flash-lite`, but you may change `MODEL` in wrangler.toml to an available free-tier text model and redeploy.
* No direct Apple HealthKit access from a PWA. Existing manual Health import remains as before.
* Chat responses can be wrong, particularly calorie counts, health advice or exercise technique. This is not medical advice.
* Existing Claude-specific features elsewhere in the original ReComp (e.g. some AI meal-planner buttons) are **not** automatically connected to this new backend; the **AI Coach chat** is the working cloud AI feature.
* Free hosting is not private hosting: GitHub Pages source is public, while personal data and AI token remain in your own browser. Google/Cloudflare process data sent to the Worker.

## Smoke testing

- Existing food logs / saved meals / workouts still display after upgrading on the same origin.
- Coach endpoint missing → visible configuration message.
- Wrong token → 401 error, not exposed Gemini key.
- Correct token and active free-tier key → AI reply.
- Opt-in unchecked → request contains NO tracker summary.
- Opt-in checked → only bounded aggregated metrics sent.
- Turn internet off → existing tracker available from cache; AI correctly reports no connection.
