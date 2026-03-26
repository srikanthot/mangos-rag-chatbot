/**
 * Azure Entra ID (MSAL) configuration.
 *
 * All values are populated from NEXT_PUBLIC_ environment variables so the
 * same codebase works for local dev (no auth), local Entra testing, and
 * Azure App Service deployment — controlled entirely by configuration.
 *
 * ── Environment variables ─────────────────────────────────────────
 *
 *  NEXT_PUBLIC_CLIENT_ID       — App Registration client/application ID
 *  NEXT_PUBLIC_AUTHORITY       — Entra authority URL, e.g.:
 *                                 Public cloud:  https://login.microsoftonline.com/<tenant-id>
 *                                 GCC High:      https://login.microsoftonline.us/<tenant-id>
 *  NEXT_PUBLIC_REDIRECT_URI    — Post-login redirect (default: "/")
 *  NEXT_PUBLIC_CLOUD_INSTANCE  — (Optional) Override cloud instance for sovereign clouds.
 *                                 Defaults to "" (auto-detected from authority).
 *  NEXT_PUBLIC_API_SCOPE       — (Optional) Backend API scope for token acquisition, e.g.:
 *                                 "api://<client-id>/access_as_user"
 *                                 If blank, only "User.Read" is requested.
 *  NEXT_PUBLIC_ALLOWED_GROUP   — (Optional) Entra security group Object ID.
 *                                 If set, only members of this group can access the app.
 *                                 Leave blank to allow all tenant users.
 *
 * When NEXT_PUBLIC_CLIENT_ID and NEXT_PUBLIC_AUTHORITY are both blank,
 * the app falls back to debug mode (X-Debug-User-Id headers).
 */

import type { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? "",
    authority: process.env.NEXT_PUBLIC_AUTHORITY ?? "",
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI ?? "/",
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

/**
 * Scopes requested during interactive login.
 * If NEXT_PUBLIC_API_SCOPE is set, include it so the token can
 * be used for backend API calls (future Bearer token flow).
 */
const apiScope = process.env.NEXT_PUBLIC_API_SCOPE ?? "";
export const loginRequest = {
  scopes: apiScope ? ["User.Read", apiScope] : ["User.Read"],
};

/**
 * Optional group-based access restriction.
 * When set, AuthGate checks the user's group membership.
 */
export const allowedGroupId = process.env.NEXT_PUBLIC_ALLOWED_GROUP ?? "";

/**
 * Returns true if Entra ID env vars are configured.
 * Use this to decide whether to enable real auth or fall back to debug mode.
 */
export function isEntraConfigured(): boolean {
  return Boolean(msalConfig.auth.clientId && msalConfig.auth.authority);
}
