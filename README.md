# ReComp v12 — Unified Gemini AI Integration

## Included AI features
- AI Coach: Gemini `/chat` for Indian diets, gym plans and questions. Conversation locally retained. Sharing 7 days of records is opt-in.
- Nutrition → Log food: Gemini `/food` estimates all macros, fibre and micronutrients with editable review; only **Confirm & Log Food** saves.
- Weekly Meal Planner: `Plan with AI` uses Gemini `/plan` to create a 7-day Indian meal plan. **Review, edit and confirm** before replacing the existing plan. IMPORTANT: internal plan slots are **Monday index 0 to Sunday index 6**; the UI displays Sunday first without altering the mapping.
- AI insights: top-bar `AI insights` action on Home, Nutrition, Training, Weekly Review, Digital Twin, Patterns, What-if, My Insights and Profile; optional *aggregated 28-day* tracker summary. Without checkbox, AI answers generally.
- Workout plan: Training → Workout plan creates a suggestion only; it does **not** automatically add workouts.
- Deterministic charts/calculations continue to use local records and do not become AI-generated values.

## Deploy on Windows — GitHub Pages
1. **Export your ReComp JSON backup** before replacing any files.
2. Extract this ZIP. In your existing `https://github.com/viishnurs/ReComp` repository, replace/update the PWA files in the root. `index.html`, `sw.js`, `ai-integrations.js`, and `ai-integrations.css` are new/modified in v12; maintain other files unchanged. Do not upload `backend` or secret keys to public website unless you understand the code is public; backend source itself contains no secrets.
3. Commit and confirm Pages success in repository Actions. Test `https://viishnurs.github.io/ReComp/?v=12` in Safari. If installed app still uses old scripts, open the website online in Safari and reload, then reopen Home Screen app.

## Deploy on Windows — Cloudflare Worker
1. Install Node.js LTS. Open **PowerShell inside this ZIP's `backend` folder**.
2. Make a free Cloudflare account and a Google AI Studio API key for a free-tier eligible Gemini model. Don't enable billing unless you deliberately choose paid usage. Free-tier usage/availability can change.
3. `npx wrangler login`
4. Inspect `wrangler.toml`; `ALLOWED_ORIGIN = "https://viishnurs.github.io"` (no `/ReComp/`) is preconfigured. Choose supported `MODEL`.
5. `npx wrangler deploy` (save the Worker HTTPS URL). If you already deployed a Worker, keep the exact existing `name` in wrangler.toml so its secrets are preserved.
6. `npx wrangler secret put GEMINI_API_KEY` (paste the Gemini key in the secure prompt).
7. Generate a random token with **PowerShell 7**: `[Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))`. On Windows PowerShell 5.1, use `[System.BitConverter]::ToString((1..24 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 })).Replace('-','')` only for a demo token; prefer a password-manager generated random token for production.
8. `npx wrangler secret put COACH_ACCESS_TOKEN` (paste securely). **Never place either secret in GitHub or chat.**
9. Optionally `npx wrangler deploy` again.
10. On your iPhone, open ReComp → AI Coach; paste Worker URL and private token. Token is intentionally not permanently stored, so re-enter after app restarts. Then test chat, food estimate, meal planner, and AI insights.

## Privacy and limitations
AI calls require internet, Worker and Gemini API availability, and valid secrets. All sharing of aggregated logs to AI Insights is **unchecked by default**. Chat uses its own independent opt-in tracker checkbox. Food sends only its food description/quantity; Meal Planner sends diet preference/goal and the existing kcal/protein/fibre targets. Generated estimates/plans require review and should not replace professional medical/dietetic care. This PWA cannot directly access Apple HealthKit. API free tiers may have usage quotas and providers may process content according to their terms.

## Quick checks
- Chrome DevTools Network: `/food`, `/chat`, `/plan`, `/analyze` should return 200 on valid requests.
- Nutrition: calculate, edit, discard, then confirm; verify only confirmed entry is saved.
- Meal Planner: generate then discard; verify prior plan stays intact. Generate and confirm; verify Sunday displays Sunday meal (internal index 6).
- Insights: run without sharing; then enable sharing and confirm summaries are opt-in.
- Offline: existing local tracking still works, AI buttons show connection errors while offline.

Syntax validated with Node.js. Live API requests and iPhone interaction require your API credentials and on-device testing.
