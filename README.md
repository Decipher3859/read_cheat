# Bionic Reading Browser Extension

Minimal scaffold for a browser extension based on Manifest V3.

## Structure

- `manifest.json`: Extension metadata and entry points.
- `src/background.js`: Initializes default settings.
- `src/content.js`: Applies a first bionic-reading transformation to page text.
- `popup/`: Small popup UI for enabling the extension and changing the emphasis ratio.
- `options/`: Placeholder for a larger settings page.
- `assets/icons/`: Reserved for extension icons.

## Load locally in Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Click `Load Temporary Add-on...`.
3. Select `coding/bionic_reading/manifest.json`.

Firefox loads temporary add-ons per session. After a restart, load the manifest again.

## Next steps

- Add real icons in `assets/icons/`.
- Inject CSS for better typography and safer styling.
- Add a toggle that reapplies or removes formatting on the active tab.
- Restrict the content script to readable article areas instead of the full document.
