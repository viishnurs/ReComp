# ReComp v11 — AI Food Logging

## What changed
In Nutrition → Log food, type a food and quantity, select the meal, and tap **Calculate with AI**. A complete editable nutrition table appears. Nothing is saved until **Confirm & Log Food** is pressed. Values use your existing fields (kcal/protein/carbs/fat/fiber and micronutrients), preserving ReComp's `recomp-log-v1` format. Existing entries and manual food logging remain intact.

## Important: update BOTH parts
**GitHub Pages (front-end):** Upload/replace `index.html`, `sw.js` and add `ai-food.css`, `ai-food.js` in the root of https://github.com/viishnurs/ReComp . Keep the other existing files. Commit and wait for Pages deployment. Refresh the installed PWA in Safari (new version v11).

**Cloudflare (backend):** Your previously deployed Worker **must** be updated too. On Windows, open the extracted `backend` folder in PowerShell. In `wrangler.toml`, set `ALLOWED_ORIGIN = "https://viishnurs.github.io"` and use the exact name of your already-deployed Worker. Then run `npx wrangler deploy`. Do not re-create or reveal your `GEMINI_API_KEY` or `COACH_ACCESS_TOKEN` secrets; they stay on the Worker if you deploy over the same Worker. If you have never configured the Worker, follow the full AI setup first.

**On iPhone:** In ReComp → AI Coach, enter the Worker HTTPS endpoint and private access token. The Worker URL is remembered but the token is intentionally not permanently stored. Then navigate to Nutrition → Log food. Food-name/quantity input is sent to your Worker and Gemini **only when you tap Calculate with AI**. Optional ReComp tracker-summary sharing for Coach chat is unrelated to this lookup; food estimates never send your complete diary.

## Test checklist
1. Input `2 idli` and `150 ml sambar`, choose Breakfast; calculate.
2. Confirm nutrition table displays calories, protein, carbs, fats, fibre, and micronutrients.
3. Edit calories (e.g. +1) and tap Confirm & Log Food. Verify the updated amount appears in the daily Nutrition log.
4. Check that the entry remains after reloading the PWA. Test Discard does not save.
5. Verify manual packaged-food entry still works.
6. If you see `Not found` from your Worker, it has not yet been updated to the `/food` endpoint. If you see `Enter your private access token`, return to AI Coach and enter it.

**Privacy and precision:** Indian recipes vary a lot by oil, ingredients, and portion; numbers are estimates. Always review before logging. Free Gemini tiers may have rate limits and may use submitted prompts for product improvement. Do not put secrets in public GitHub Pages files.

**Validation:** JavaScript syntax and archive integrity can be checked locally. Actual Gemini calls and iPhone Safari behavior require your credentials and on-device testing.
