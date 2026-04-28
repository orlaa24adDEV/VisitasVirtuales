import { existsSync } from 'node:fs'
import assert from 'node:assert'
import { config as loadEnv } from 'dotenv'
import { expand as expandEnv } from 'dotenv-expand'
import { defineConfig } from 'drizzle-kit'
import { env } from './env.ts'

const envFile =
	env.APP_STAGE === 'prod'
		? '.env.prod'
		: env.APP_STAGE === 'dev' && existsSync('.env.dev')
			? '.env.dev'
			: '.env'
expandEnv(loadEnv({ path: envFile, quiet: true }))

assert(
	process.env.DATABASE_URL,
	`Error: DATABASE_URL no está definido en ${envFile}`,
)

export default defineConfig({
	schema: './src/db/schema.ts',
	out: './drizzle',
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
	dialect: 'postgresql',
	verbose: true,
	strict: true,
})
