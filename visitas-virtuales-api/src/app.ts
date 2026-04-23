import type { Request, Response, RequestHandler } from 'express'
import { env } from './env.ts'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import userRoutes from './routes/userRoutes.ts'
import centerRoutes from './routes/centerRoutes.ts'
import poiRoutes from './routes/poiRoutes.ts'
import errorHandler from './middlewares/errorHandler.ts'
import cors from 'cors'
import helmet from 'helmet'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()

// Logger para solicitudes HTTP
morgan.token(
	'status-message',
	(req: Request, res: Response) => res.statusMessage || '',
)
app.use(morgan('dev') as RequestHandler)

// Middleware para establecer headers de seguridad en las respuestas
app.use(helmet())

// Middleware para extraer JSON de las solicitudes
app.use(express.json())

// Middleware para extraer cookies de las solicitudes
app.use(cookieParser() as RequestHandler)

// Permitir CORS desde la app de React (Vite)
const allowedOrigins = [
	env.FRONTEND_URL,
	'http://localhost:5173',
	'http://localhost:8000',
]

app.use(
	cors({
		// Comprobar si el origen de la petición está en la lista
		origin: (
			origin: string | undefined,
			callback: (err: Error | null, allow?: boolean) => void,
		) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true)
			} else {
				callback(new Error('Origen no permitido por CORS'))
			}
		},
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		credentials: true,
	}) as RequestHandler,
)

// Montar rutas de usuarios
app.use('/api/v1/', userRoutes)

// Montar rutas de centros
app.use('/api/v1/', centerRoutes)

// Montar rutas de POIs
app.use('/api/v1/', poiRoutes)

// Montar ruta de especificación OpenAPI (solo en desarrollo y staging)
if (env.APP_STAGE !== 'prod') {
	const currentDir = dirname(fileURLToPath(import.meta.url))
	const openApiPath = resolve(currentDir, '../docs/openapi.json')
	const swaggerSpec = JSON.parse(readFileSync(openApiPath, 'utf-8'))
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

// Middleware para manejar errores lanzados desde servicios
app.use(errorHandler)

app.listen(env.APP_PORT, () =>
	console.log(`Servidor escuchando en puerto ${env.APP_PORT}`),
)

export default app
