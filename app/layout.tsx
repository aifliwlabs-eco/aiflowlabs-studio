// app/layout.tsx
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "aiflowlabs.studio — Coming Soon",
  description: "AIFlow Labs Studio — AI agents, creative tools & apps. Launching soon.",
  metadataBase: new URL("https://aiflowlabs.studio"),
  openGraph: {
    type: "website",
    url: "https://aiflowlabs.studio/",
    title: "AIFlow Labs Studio — Coming Soon",
    description: "AI agents, creative tools & apps. Launching soon.",
    images: ["/assets/img/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIFlow Labs Studio — Coming Soon",
    description: "AI agents, creative tools & apps. Launching soon.",
    images: ["/assets/img/og-banner.png"],
  },
  icons: {
    icon: [
      { url: "/assets/img/favicon.ico" },
      { url: "/assets/img/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/img/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/img/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/img/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/assets/img/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        {/* 1) legacy, 2) Tailwind */}
        <link rel="stylesheet" href="/assets/css/tw.css?v=2" />
        <link rel="stylesheet" href="/assets/css/legacy.css?v=3" />
      </head>

      <body className="tw-min-h-dvh tw-bg-white tw-text-neutral-900 antialiased dark:tw-bg-neutral-950 dark:tw-text-neutral-100">
        {/* GTM */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function (w, d, s, l, i) {
              w[l] = w[l] || [];
              w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
              var f = d.getElementsByTagName(s)[0],
                  j = d.createElement(s),
                  dl = l != "dataLayer" ? "&l=" + l : "";
              j.async = true;
              j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
              f.parentNode.insertBefore(j, f);
            })(window, document, "script", "dataLayer", "GTM-MZ733KQK");
          `}
        </Script>

        {/* legacy site script, load after parse */}
        <Script
          src="/assets/site.js?v=8"
          type="module"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />



        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MZ733KQK"
            height="0"
            width="0"
            title="Google Tag Manager (noscript)"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeToggle />
          {children}
        </ThemeProvider>

        {/* Временный блок для #logo-pill можно удалить, если перенесёшь в legacy.css */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #logo-pill {
                display: inline-flex;
                gap: 0.6ch !important;
                align-items: center;
                padding: 0.55rem 0.9rem;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.06);
                font-weight: 600;
                letter-spacing: 0.4px;
                text-align: center;
                color: var(--text, rgba(255,255,255,0.92));
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
