import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
// Solo cargar un .env si no estamos en producción
if (process.env.NODE_ENV !== 'production') {
  const env = dotenv.config({ path: process.env.ENV_PATH || '.env.dev' })
  dotenvExpand.expand(env)
// En producción se asume que Docker proporcionará las variables de entorno
} else {
  dotenvExpand.expand({ parsed: process.env })
}
