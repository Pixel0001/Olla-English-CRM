import { SITE_URL } from '@/components/site/content'

export default function sitemap() {
  return ['', '/team', '/test', '/termeni-si-conditii', '/politica-de-confidentialitate'].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.5,
  }))
}
