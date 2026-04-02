import type { Metadata } from "next";
import AuthGate from "@/components/auth/AuthGate";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "MANGOS Tech Manual Chatbot",
  description: "Enterprise AI assistant for technical documentation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ErrorBoundary>
          <AuthGate>{children}</AuthGate>
        </ErrorBoundary>
      </body>
    </html>
  );
}
