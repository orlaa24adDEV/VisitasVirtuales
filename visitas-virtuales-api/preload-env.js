import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
// Solo cargar un .env si no estamos en producción
if (process.env.NODE_ENV !== 'production') {
	console.log('API ejecutandose en modo desarrollo')
	const env = dotenv.config({ path: process.env.ENV_PATH || '.env.dev' })
	dotenvExpand.expand(env)
} else {
	console.log('API ejecutandose en modo producción')
}
// En producción se asume que Docker proporcionará las variables de entorno
