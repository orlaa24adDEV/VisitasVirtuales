import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
const env = dotenv.config({ path: process.env.ENV_PATH || '.env.dev' })
dotenvExpand.expand(env)
