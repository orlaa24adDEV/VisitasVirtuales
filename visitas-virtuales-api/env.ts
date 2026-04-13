import { existsSync } from 'node:fs'
import assert from 'node:assert'
import { config as loadEnv } from 'dotenv'
import { expand as expandEnv } from 'dotenv-expand'
import { z } from 'zod'

// Garantizar que la variable de entorno APP_STAGE esté definida y sea válida
assert(
	process.env.APP_STAGE && ['dev', 'prod'].includes(process.env.APP_STAGE),
	'La variable de entorno APP_STAGE es obligatoria y debe ser "dev" o "prod"',
)

// Aceptar .env o .env.dev para desarrollo
const envFile = existsSync('.env.dev') ? '.env.dev' : '.env'

// Cargar y expandir variables de entorno
if (process.env.APP_STAGE === 'dev') {
	console.log(`Modo desarrollo. Cargando variables desde ${envFile}`)
	const loaded = loadEnv({ path: envFile, quiet: true })
	expandEnv(loaded)
}

// En producción, las variables de entorno son proporcionadas por Docker

// Usar schema de zod para validar las variables de entorno de forma estricta, evitando
// que la app se ejecute con configuraciones incorrectas o faltantes.
const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']),
	APP_STAGE: z.enum(['dev', 'stage', 'prod']),
	APP_PORT: z.coerce.number().default(8000),
	POSTGRES_USER: z.string().min(1),
	POSTGRES_PASSWORD: z.string().min(32),
	POSTGRES_DB: z.string().min(1),
	DATABASE_URL: z.string().startsWith('postgres://'),
	PGADMIN_DEFAULT_EMAIL: z.email(),
	PGADMIN_DEFAULT_PASSWORD: z.string().min(32),
	JWT_SECRET: z.string().min(32),
	JWT_ACCESS_TOKEN_TTL: z.string().default('15m'),
	JWT_REFRESH_TOKEN_TTL: z.string().default('7d'),
	JWT_ISSUER: z.string().min(1),
	JWT_AUDIENCE: z.string().min(1),
	FRONTEND_URL: z.string().startsWith('http'),
})

// Exportar objeto env con variables de entorno validadas y tipadas
export const env = envSchema.parse(process.env)
