// Layout pentru toate paginile /learn — adaugă manifest PWA + viewport mobile
export const metadata = {
  manifest: '/manifest-learn.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Olla Learn',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#14276B',
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
}

export default function LearnLayout({ children }) {
  return (
    <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {children}
    </div>
  )
}
