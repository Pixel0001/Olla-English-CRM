import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Olla English",
    template: "%s | Olla English"
  },
  description: "CRM intern Olla English — gestiune elevi, grupe, orar, prezențe și plăți.",
  applicationName: "Olla English",
  authors: [{ name: "Olla English" }],
  creator: "Olla English",
  publisher: "Olla English",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Aplicație internă — nu vrem indexare nicăieri.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  category: "education",
};

// Viewport — disable user-zoom (stops iOS input auto-zoom on answer fields)
// and enable viewport-fit:cover so env(safe-area-inset-*) returns real values
// inside the iPhone PWA (notch / status bar / home indicator).
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#14276B',
  interactiveWidget: 'resizes-content',
};

// Script to apply theme before page renders to prevent flash
const themeScript = `
  (function() {
    try {
      const theme = localStorage.getItem('theme');
      if (theme === 'light') {
        document.documentElement.classList.add('light');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
          <Toaster
            position="top-right"
            containerStyle={{
              top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
              right: 'calc(env(safe-area-inset-right, 0px) + 12px)',
            }}
            toastOptions={{
              style: {
                fontSize: '14px',
                maxWidth: '92vw',
                background: '#15292e',
                color: '#ffffff',
                border: '1px solid #1e3d44',
                borderRadius: '14px',
                padding: '12px 16px',
              },
              success: { iconTheme: { primary: '#30919f', secondary: '#0c1a1d' } },
              error: { iconTheme: { primary: '#f8b316', secondary: '#0c1a1d' } },
            }}
          />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
