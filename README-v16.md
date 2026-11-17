# ReComp v16 — structural responsive layout update

This update targets mobile layout issues left by the v15 CSS-only patch.

## Update exactly these files in the root of your existing GitHub Pages ReComp repository
- `index.html` (loads the new layout stylesheet)
- `enhancements.js` (renders editable strength sets with field labels)
- `mobile-layout-v16.css` (new stylesheet; must be next to index.html)
- `sw.js` (updates the app shell cache and preloads the new stylesheet)

Do not upload the `backend` folder to GitHub Pages. Cloudflare AI backend does not change.

## Changes
- Strength sets display as labeled cards with a usable reps/weight input on narrow devices, instead of a squeezed 4-column table.
- Home dashboard's motivation ring/text stack on narrow widths.
- Existing nav slots have equal widths and shorter labels remain contained.
- Training, nutrition, Stats, Digital Twin, Transformation forms and record lists can grow vertically and wrap content instead of clipping it.
- More room for inputs, and content padding below fixed tab bar.
- No changes to fitness tracking records, saved token, or AI Coach behavior.

## Deployment
1. Export your ReComp backup first.
2. Upload and replace the four files above in https://github.com/viishnurs/ReComp at the root (main branch).
3. Check GitHub Actions for a successful GitHub Pages deployment.
4. Open https://viishnurs.github.io/ReComp/?v=16 in Safari, refresh, and reopen the installed PWA.
5. Test at least Dashboard, Training > Strength builder (add an exercise and sets), Statistics > Body transformation, Nutrition, Digital Twin, and Profile.

## Testing limitations
JavaScript syntax and package integrity were checked. Browser automation is blocked by this environment's navigation policy; this has not been visually validated on physical iPhones. If any layout still overlaps, a screenshot showing the specific overlapping area and your iPhone model will let us target the exact element without adding conflicting rules.
