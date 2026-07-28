/*
 * supabase-js (via realtime-js) requires a global `WebSocket` at client
 * construction. Node < 22 doesn't provide one, so server-side client creation
 * throws. Polyfill it with `ws` on the server (browsers already have WebSocket).
 * Importing this module for its side effect runs before any client is created.
 */
type G = typeof globalThis & { WebSocket?: unknown };

if (typeof window === "undefined" && typeof (globalThis as G).WebSocket === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- sync polyfill before client init
  (globalThis as G).WebSocket = require("ws");
}

export {};
