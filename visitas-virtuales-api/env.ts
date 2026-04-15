import { existsSync } from 'node:fs'
import { config as loadEnv } from 'dotenv'
import { expand as expandEnv } from 'dotenv-expand'
import { z } from 'zod'
import { en } from 'zod/v4/locales'

// Usar schema de zod para validar las variables de entorno de forma estricta, evitando
// que la app se ejecute con configuraciones incorrectas o faltantes.
const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']),
	APP_STAGE: z.enum(['dev', 'stage', 'prod']).default("dev"),
	APP_PORT: z.coerce.number().default(8000),
	POSTGRES_USER: z.string().min(1),
	POSTGRES_PASSWORD: z.string().min(32),
	POSTGRES_DB: z.string().min(1),
	DATABASE_URL: z.string().startsWith('postgres://'),
	JWT_SECRET: z.string().min(32),
	JWT_ACCESS_TOKEN_TTL: z.string().default('15m'),
	JWT_REFRESH_TOKEN_TTL: z.string().default('7d'),
	JWT_ISSUER: z.string().min(1),
	JWT_AUDIENCE: z.string().min(1),
	FRONTEND_URL: z.string().startsWith('http'),
})

// Garantizar que la variable de entorno APP_STAGE esté definida, dev por defecto
const validStageSchema = envSchema.pick({ APP_STAGE: true }).default({ APP_STAGE: 'dev' })
try {
	validStageSchema.parse({ APP_STAGE: process.env.APP_STAGE })
} catch (error) {
	console.error("APP_STAGE inválido o no definido. Debe ser 'dev', 'stage' o 'prod'.")
	process.exit(1)
}

// Aceptar .env o .env.dev para desarrollo
const envFile = existsSync('.env.dev') ? '.env.dev' : '.env'

// En producción, las variables de entorno son proporcionadas por Docker

// Cargar y expandir variables de entorno
if (process.env.APP_STAGE === 'dev' || !process.env.APP_STAGE) {
  console.log(`Modo desarrollo. Cargando variables desde ${envFile}`)
  const loaded = loadEnv({ path: envFile, quiet: true })
  expandEnv(loaded)
}

// Exportar objeto env con variables de entorno validadas y tipadas
export const env = (() => {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error("Error en variables de entorno:", error)
    process.exit(1)
  }
})()
