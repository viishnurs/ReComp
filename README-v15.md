# ReComp v15 — Mobile layout and AI privacy update

Based on ReComp v13 complete project with the v14 food-context fixes merged in. This release changes interface styling and AI chat session behavior, not the `recomp-log-v1` tracking schema.

## Changes

- Repaired six-button floating mobile navigation to use equal, centered touch areas above iPhone's bottom safe area.
- Responsive layouts for Home motivation, Statistics, Digital Twin, Training, advanced strength sets, body transformation, measurements, photos and Nutrition forms/micronutrient details.
- Removed the **Macro breakdown** card from the Nutrition interface; values remain in the nutrition data and elsewhere. The Micronutrients card in Statistics remains, now with responsive rows.
- ReComp AI Coach now defaults to **sharing last seven days of tracker summary and up to eight recent food entries** when you press Ask. This checkbox can be unchecked at any time. It does not transmit logs merely by opening the page.
- AI Coach messages are no longer saved to localStorage. Old saved chat history is deleted on first load of the updated script. Chat bubbles clear when you leave and reopen the Coach page; the app keeps only up to ten current-session messages as chat context while the page remains open.
- Existing AI endpoint and saved access token remain as-is. No backend redeployment is required for this update.

## Deploy to GitHub Pages

1. Back up your ReComp tracker data through its Export Backup feature.
2. Upload/rewrite these **four files** in the root of your existing GitHub repository: `index.html`, `ai-coach.js`, `phone-layout.css` (new), and `sw.js`.
3. Commit, then check GitHub Actions for a successful Pages deployment.
4. Test `https://viishnurs.github.io/ReComp/?v=15` in iPhone Safari. Reload; reopen Home Screen PWA after the new service worker activates.
5. Verify Home, Nutrition, Training (Strength session builder), Statistics, Digital Twin and Profile at your phone's screen width. Verify that the Coach checkbox is checked on opening, can be unchecked, and chat clears when leaving and returning.

## Limitations

JavaScript syntax/static integrity checks were performed. Full interactive rendering in a browser and on a physical iPhone could not be verified in this environment (local browser access was blocked). If any overlap remains on a particular device, provide a screenshot and device model to target that layout.

## Data and privacy

Tracking data stays local as before. Food log sharing is **ON by default as requested**: if you ask the AI a question, the request can include recent food names and the seven-day summary. Uncheck the share box before asking if you do not want that information sent. Prompts are transmitted to Google Gemini via your Worker. Browser-stored AI access token persists until forgotten; AI chat text does not persist.
