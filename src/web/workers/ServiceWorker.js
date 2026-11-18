/**
 * CyberChef-faster Service Worker
 *
 * Uses Workbox InjectManifest to pre-cache all static build assets
 * (main.js, worker chunks, CSS, images, fonts) so that repeat visits
 * load entirely from the browser cache with no network round-trips.
 *
 * Cache strategy:
 *   - Precache (versioned):  all webpack output files — served from
 *     cache-first, updated atomically on every new deploy.
 *   - Runtime (CacheFirst):  Google Fonts and other CDN resources if
 *     ever added in the future.
 *
 * @license Apache-2.0
 */

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { CacheFirst } from "workbox-strategies";
import { registerRoute } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

// __WB_MANIFEST is replaced by InjectManifest with the full asset list.
precacheAndRoute(self.__WB_MANIFEST);

// Remove caches from previous SW versions automatically.
cleanupOutdatedCaches();

// Cache-first for fonts served from the same origin (already precached,
// but this covers any direct font requests that bypass precache routing).
registerRoute(
    ({ request }) => request.destination === "font",
    new CacheFirst({
        cacheName: "cyberchef-fonts",
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 365 }),
        ],
    })
);
