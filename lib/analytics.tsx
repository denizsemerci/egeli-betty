'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  gaId: string
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

// Helper function to track page views
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    })
  }
}

// Helper function to track events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

