"use client";

import { isEntraConfigured } from "@/lib/auth-config";

interface AuthGateProps {
  children: React.ReactNode;
}

/**
 * Authentication gate component.
 *
 * Currently: passes through all children (no auth enforced).
 * In local dev, the app uses X-Debug-User-Id headers instead.
 *
 * ── Future Entra integration ──────────────────────────────────
 *
 * When ready to enable Azure Entra ID authentication:
 *
 * 1. Install MSAL:
 *      npm install @azure/msal-browser @azure/msal-react
 *
 * 2. Import the following in this file:
 *      import { PublicClientApplication } from "@azure/msal-browser";
 *      import { MsalProvider, MsalAuthenticationTemplate } from "@azure/msal-react";
 *      import { InteractionType } from "@azure/msal-browser";
 *      import { msalConfig, loginRequest } from "@/lib/auth-config";
 *
 * 3. Create the MSAL instance (outside the component):
 *      const msalInstance = new PublicClientApplication(msalConfig);
 *
 * 4. Replace the return block below with:
 *      return (
 *        <MsalProvider instance={msalInstance}>
 *          <MsalAuthenticationTemplate
 *            interactionType={InteractionType.Redirect}
 *            authenticationRequest={loginRequest}
 *            loadingComponent={AuthLoading}
 *            errorComponent={AuthError}
 *          >
 *            {children}
 *          </MsalAuthenticationTemplate>
 *        </MsalProvider>
 *      );
 *
 * 5. Create AuthLoading and AuthError components for UX during
 *    auth redirects and failures.
 *
 * 6. In lib/api.ts, replace the X-Debug-User-Id header with a
 *    Bearer token from useMsal().acquireTokenSilent().
 */
export default function AuthGate({ children }: AuthGateProps) {
  const entraReady = isEntraConfigured();

  if (!entraReady) {
    // Local dev mode — no auth required.
    // The app sends X-Debug-User-Id headers for user identity.
    return <>{children}</>;
  }

  // Entra IS configured but MSAL is not yet installed.
  // Once @azure/msal-react is added, replace this block with
  // MsalProvider + MsalAuthenticationTemplate (see steps above).
  return <>{children}</>;
}
