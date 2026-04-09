function toPort(value, fallback) {
	const parsed = Number(value)
	return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function hasPostgresCredentials(env) {
	return Boolean(env.POSTGRES_USER && env.POSTGRES_PASSWORD && env.POSTGRES_DB)
}

function getHostFallback(env) {
	return env.NODE_ENV === 'production' ? 'postgres_service' : 'localhost'
}

function isValidUrl(value) {
	if (!value) return false
	try {
		new URL(value)
		return true
	} catch {
		return false
	}
}

export function getNodePgPoolConfig(env = process.env) {
	if (isValidUrl(env.DATABASE_URL)) {
		return { connectionString: env.DATABASE_URL }
	}

	if (hasPostgresCredentials(env)) {
		return {
			host: env.POSTGRES_HOST || getHostFallback(env),
			port: toPort(env.POSTGRES_PORT, 5433),
			user: env.POSTGRES_USER,
			password: env.POSTGRES_PASSWORD,
			database: env.POSTGRES_DB,
		}
	}

	throw new Error(
		'Database configuration is missing. Define DATABASE_URL (valid URL) or POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_DB.'
	)
}

export function getDrizzleDbCredentials(env = process.env) {
	if (isValidUrl(env.DATABASE_URL)) {
		return { url: env.DATABASE_URL }
	}

	if (hasPostgresCredentials(env)) {
		return {
			host: env.POSTGRES_HOST || getHostFallback(env),
			port: toPort(env.POSTGRES_PORT, 5433),
			user: env.POSTGRES_USER,
			password: env.POSTGRES_PASSWORD,
			database: env.POSTGRES_DB,
		}
	}

	throw new Error(
		'Database configuration is missing. Define DATABASE_URL (valid URL) or POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_DB.'
	)
}