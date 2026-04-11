import type { MetadataRoute } from 'next'
import { getIndex } from '@/lib/data'
import { CATEGORIES } from '@/lib/categories'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aandelenanalyse.nl'
  const { companies, laatste_update } = getIndex()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: laatste_update, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/analyses`, lastModified: laatste_update, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/methode`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/over`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/prijzen`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/disclaimer`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/markt/${cat.slug}`,
    lastModified: laatste_update,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const analysePages: MetadataRoute.Sitemap = companies.map((c) => ({
    url: `${baseUrl}/analyse/${c.ticker.toLowerCase()}`,
    lastModified: c.peildatum,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...categoryPages, ...analysePages]
}
