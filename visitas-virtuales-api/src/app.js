import { env } from '../env.ts'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import centerRoutes from './routes/centerRoutes.ts'
import poiRoutes from './routes/poiRoutes.js'
import apiErrorThrown from './middlewares/apiErrorThrown.js'
import cors from 'cors'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()

// Logger para solicitudes HTTP
morgan.token('status-message', (req, res) => res.statusMessage || '')
app.use(morgan('dev'))

// Middleware para extraer JSON de las solicitudes
app.use(express.json())

// Middleware para extraer cookies de las solicitudes
app.use(cookieParser())

// Permitir CORS desde la app de React (Vite)
app.use(
	cors({
		origin: env.FRONTEND_URL,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true, // Compartir cookies entre frontend y backend
	}),
)

// Montar rutas de usuarios
app.use('/api/v1/', userRoutes)

// Montar rutas de administración
app.use('/api/v1/', adminRoutes)

// Montar rutas de centros
app.use('/api/v1/', centerRoutes)

// Montar rutas de POIs
app.use('/api/v1/', poiRoutes)

// Montar ruta de especificación OpenAPI
const currentDir = dirname(fileURLToPath(import.meta.url))
const openApiPath = resolve(currentDir, '../docs/openapi.json')
const swaggerSpec = JSON.parse(readFileSync(openApiPath, 'utf-8'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Middleware para manejar errores lanzados desde servicios
app.use(apiErrorThrown)

app.listen(env.APP_PORT, () =>
	console.log(`Servidor escuchando en puerto ${env.APP_PORT}`),
)

export default app
