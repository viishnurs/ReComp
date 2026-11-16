ReComp v2 — Windows/iPhone PWA (personal tracker)

IMPROVEMENTS
- Preserves ReComp's original screens and tracking system.
- Settings explains local-only storage and iPhone installation.
- Warns when local storage cannot save changes.
- Checks basic backup data shapes before restoring.
- Improved focus outlines, touch behavior, and narrow-screen layout.
- Updated offline service worker; navigation checks for new app versions while online.
- Works on a free HTTPS hosting service; no Apple Developer membership needed.

WINDOWS TEST
1. Extract ZIP.
2. In this directory run: py -m http.server 8000
3. Open http://localhost:8000
4. Use a desktop browser's mobile simulator to inspect the layout.

IPHONE
1. Upload contents (not just ZIP) to a public GitHub repository.
2. Settings > Pages > deploy from branch main / root.
3. Open https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/ on iPhone Safari.
4. Share > Add to Home Screen > Add.
5. Open while online before testing offline mode.

DATA & PRIVACY
- Data is saved in the browser's localStorage. It is NOT automatically synced.
- Export JSON in Settings > Backup & restore and store it in Files/iCloud Drive.
- To transfer or recover records, use Restore from file.
- Clearing site data or deleting a Home Screen web app can destroy locally stored records.
- Health data import is manual, not HealthKit sync.
- Calorie and nutrition estimates are informational, not medical advice.
- Offline charts/fonts may depend on having loaded once online.

TEST STATUS
JavaScript syntax checked; iPhone Safari hardware testing not performed.
