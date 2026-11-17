# ReComp v17 — screenshot-targeted mobile fixes

Built from the v16 Complete PWA. No changes to tracking storage or Cloudflare AI endpoint.

## Problems addressed
- Training header previously allowed date/level text to collapse into a narrow column beside the AI action buttons. On iPhone the header now stacks as a full-width title/date row followed by wrapped actions.
- Progress Photos date and file fields use separate full-width rows, avoiding the oversized date input clipping outside its card.
- Workout form fields stack in one column on narrow devices.
- Bottom bar has six equal slots, fits the Home indicator safe area, and automatically hides when scrolling down (reappears when scrolling up or navigating). It also hides when a text field is focused.

## Update on GitHub Pages
1. Export a ReComp JSON backup.
2. Upload these **four** files to the root of your existing ReComp GitHub repository: `index.html`, `sw.js`, `mobile-ui-v17.css`, `mobile-ui-v17.js`. Replace index.html and sw.js.
3. Check the Pages workflow has completed.
4. In Safari open `https://viishnurs.github.io/ReComp/?v=17` and test Training and Statistics → Progress photos. Close/reopen the Home Screen app after refresh.
5. No Cloudflare backend redeployment required.

## Verification
Node.js syntax validation passed on the newly added JavaScript and service worker; full ZIP integrity check passed. Headless Chromium test was attempted but the environment blocked localhost. This update therefore requires on-device visual confirmation.
