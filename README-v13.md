# ReComp v13 — Remember AI connection

## What changed
- AI Coach remembers the access token in this device’s `localStorage`. Enter it once and it is automatically reloaded after closing/reopening the installed PWA.
- Food AI estimates, weekly meal planning, and AI Insights use the same saved token.
- The **Forget saved token** control removes the local copy. Re-entering a token with at least 16 characters saves it again.
- Gemini API keys are **never** stored in frontend code: they stay in Cloudflare Worker secrets.
- Tracker logs and existing ReComp storage remain unchanged.

## Update existing GitHub Pages app
1. Export a ReComp backup before upgrading.
2. From the *ReComp-v13-Frontend-Update.zip*, replace `index.html`, `ai-coach.js`, `ai-coach.css`, `ai-food.js`, `ai-integrations.js`, and `sw.js` in the root of your `viishnurs/ReComp` GitHub repository.
3. Commit and wait for the Pages deployment to complete.
4. Open `https://viishnurs.github.io/ReComp/?v=13` in iPhone Safari and reload the Home Screen PWA.
5. Open AI Coach, paste your existing Cloudflare Worker URL and **rotated** private access token once. After entering it, you should see a saved message. Close and reopen the app to verify.

## Privacy and security
The access token is stored *unencrypted* in browser local storage, visible to JavaScript running on the same web origin and to anyone with access to the device's browser data. It is a convenience option, not the iOS Keychain. Use only on a trusted personal device and periodically rotate your token. Do not share it or commit it to GitHub. If the app’s browser data is deleted, the token must be entered again.

No Cloudflare Worker update is required for this change.
