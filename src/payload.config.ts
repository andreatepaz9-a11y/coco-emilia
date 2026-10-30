import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { es } from '@payloadcms/translations/languages/es'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { Instagram } from './Instagram/config'
import { Inicio } from './Inicio/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// En tu computadora (npm run dev) se usa siempre el archivo local y public/media, aunque .env.local
// tenga las claves de la nube. Turso y Blob solo se usan en el sitio publicado (producción) o si
// pones USE_REMOTE_DATA=1 a propósito. Así editar en local nunca toca los datos reales.
const useRemoteData = process.env.NODE_ENV === 'production' || process.env.USE_REMOTE_DATA === '1'

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      graphics: {
        Logo: '@/components/AdminBranding/Logo',
        Icon: '@/components/AdminBranding/Icon',
      },
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | Coco Emilia',
      icons: [{ rel: 'icon', type: 'image/png', url: '/brand/logo.png' }],
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  i18n: {
    fallbackLanguage: 'es',
    supportedLanguages: { es },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: sqliteAdapter({
    client: {
      // En local: archivo SQLite (DATABASE_URL). En Vercel: Turso, que define estas dos variables.
      url: useRemoteData
        ? process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || ''
        : process.env.DATABASE_URL || '',
      authToken: useRemoteData
        ? process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN
        : undefined,
    },
  }),
  collections: [Pages, Posts, Products, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, Inicio, Instagram],
  plugins: [
    ...plugins,
    // En Vercel el disco es de solo lectura: las fotos se guardan en Vercel Blob.
    // Solo se activa si existe el token; en local siguen yendo a public/media.
    ...(useRemoteData && process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { [Media.slug]: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
