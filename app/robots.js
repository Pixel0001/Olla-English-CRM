import { SITE_URL } from '@/components/site/content'

// Site-ul public al școlii se indexează; CRM-ul (admin, profesori, login) nu.
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/teacher', '/login', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
