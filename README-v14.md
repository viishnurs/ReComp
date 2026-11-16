# ReComp v14 — AI Coach food-log awareness fix

This patch fixes what the AI Coach can **read** from your logs. In v13, opting in shared only aggregated totals, not actual food names. Now, when you turn on the share checkbox, Gemini receives 7-day daily totals and up to 8 of the most recent food entries in those 7 days. The entry snapshot includes food name, meal type, calories, protein and fibre. Photos, notes, and body measurements are not sent. The checkbox stays OFF by default.

**It does not automatically record meals from chat.** To add food, use Nutrition > Log food > Calculate with AI > review > Confirm & Log.

## Installation

1. Export a ReComp backup.
2. In https://github.com/viishnurs/ReComp replace root `ai-coach.js`, `index.html`, `sw.js` with the files in this ZIP; commit.
3. Confirm GitHub Actions Pages deployment succeeds.
4. Open https://viishnurs.github.io/ReComp/?v=14 in Safari, refresh; close and reopen your installed app.
5. Open AI Coach, enable **Share my 7-day nutrition summary and up to 8 recent food entries**, then ask **What foods have I logged today?**
6. If it says no meal details, confirm you have logged food for today under Nutrition and try again.

No Cloudflare backend changes are needed; the existing /chat endpoint accepts this optional tracker object. If you want entire history or specific dates, we can add explicit date selection separately. The Worker accepts up to 3000 characters of optional tracker JSON.

**Security:** The opt-in data is sent to the external Gemini service via your Cloudflare Worker. Your own saved browser log remains in local storage.
