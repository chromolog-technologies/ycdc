import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { PAGE_PATHS } from './src/routes/pageRoutes.ts'

/**
 * Production SEO/analytics wiring driven by env (set in Vercel → Environment Variables):
 * - VITE_SITE_URL: public site origin, used for canonical/Open Graph URLs, robots.txt and sitemap.xml
 * - VITE_GA_ID:    Google Analytics 4 measurement ID; the tag is only added when it is set
 */
function siteMeta(siteUrl: string, gaId?: string): Plugin {
  const publicPaths = Object.entries(PAGE_PATHS)
    .filter(([page]) => page !== 'admin')
    .map(([, path]) => path)

  return {
    name: 'ycdc-site-meta',
    transformIndexHtml() {
      const tags: HtmlTagDescriptor[] = [
        { tag: 'link', attrs: { rel: 'canonical', href: `${siteUrl}/` } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'YCDC' } },
        { tag: 'meta', attrs: { property: 'og:title', content: 'YCDC | Yogiraj Centre for Dermatology & Cosmetology' } },
        { tag: 'meta', attrs: { property: 'og:description', content: 'Premium skin, hair and aesthetic care in Bengaluru and Thiruvananthapuram, led by Dr. K. Yogiraj with 45+ years of excellence.' } },
        { tag: 'meta', attrs: { property: 'og:url', content: `${siteUrl}/` } },
        { tag: 'meta', attrs: { property: 'og:image', content: `${siteUrl}/hero/hero-desktop.jpg` } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
      ]

      if (gaId) {
        tags.push(
          { tag: 'script', attrs: { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${gaId}` } },
          {
            tag: 'script',
            // Page views are sent manually on route changes (see App.tsx)
            children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});`,
          },
        )
      }

      return tags.map((t) => ({ ...t, injectTo: 'head' as const }))
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          publicPaths.map((path) => `  <url><loc>${siteUrl}${path === '/' ? '/' : path}</loc></url>`).join('\n') +
          '\n</urlset>\n',
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://ycdc-navy.vercel.app').replace(/\/+$/, '')

  return {
    plugins: [react(), siteMeta(siteUrl, env.VITE_GA_ID)],
  }
})
