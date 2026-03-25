/**
 * Azure Entra ID (MSAL) configuration.
 *
 * These values are populated from environment variables set in
 * Azure App Service Application Settings (or a local .env.local file).
 *
 * ── Integration steps (for later) ──────────────────────────────
 *
 * 1. Install MSAL packages:
 *      npm install @azure/msal-browser @azure/msal-react
 *
 * 2. Create a PublicClientApplication instance with this config
 *    and wrap the app in <MsalProvider> in layout.tsx or page.tsx.
 *
 * 3. Replace the AuthGate placeholder component with
 *    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
 *
 * 4. After login, acquire an access token using useMsal() or
 *    acquireTokenSilent, and pass it as a Bearer header in
 *    lib/api.ts (replacing the X-Debug-User-Id header).
 *
 * 5. Update loginRequest.scopes if your backend API requires
 *    a custom scope (e.g., "api://<client-id>/access_as_user").
 *
 * ── Note on env var prefix ─────────────────────────────────────
 *
 * These use the NEXT_PUBLIC_ prefix so Next.js exposes them to the
 * browser bundle automatically. No server-side injection is needed.
 *
 * Until Entra is wired, the app uses a debug user ID from localStorage
 * sent via X-Debug-User-Id header — see lib/api.ts and lib/utils.ts.
 */

export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? "",
    authority: process.env.NEXT_PUBLIC_AUTHORITY ?? "",
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI ?? "/",
  },
  cache: {
    cacheLocation: "sessionStorage" as const,
    storeAuthStateInCookie: false,
  },
};

/** Scopes requested during login */
export const loginRequest = {
  scopes: ["User.Read"],
};

/**
 * Returns true if Entra ID env vars are configured.
 * Use this to decide whether to enable real auth or fall back to debug mode.
 */
export function isEntraConfigured(): boolean {
  return Boolean(msalConfig.auth.clientId && msalConfig.auth.authority);
}
