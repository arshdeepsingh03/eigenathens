Edit `talk-series.json` to update the Events page without editing HTML or JavaScript.

- `talk-series`: an array; add one object per talk series.
- Each talk has a unique, stable `id` (lowercase letters, numbers, hyphens), `title`, `description`, `poster` image path, and a `tz-regions` array.
- Each timezone region has an `id` unique within that talk, a short editable `name` displayed on its button, and its own `googleFormUrl` (Google Forms embed URL ending in `/viewform?embedded=true`).
- Region names are display labels, not timezone calculations. The existing five instances retain their separate forms and use Pacific labels with their city names so they remain distinguishable. Rename or replace them as needed.
- Current Google Form URLs are placeholders. Replace them with actual embed URLs.
- Keep valid JSON: double quotes, no comments, no trailing commas. An empty `talk-series` list displays a no-upcoming-talks message.

Example deep link: `/events/?talk=geometry-of-number&region=vancouver`.
Older `/events/?location=vancouver` links target the first talk.

The browser fetches the JSON with `cache: "no-store"` and a fresh query string on each page load. Publish the updated JSON to your host for changes to become available. Already open pages refresh their data when reloaded.
