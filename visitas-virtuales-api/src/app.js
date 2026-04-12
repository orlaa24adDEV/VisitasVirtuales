import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import apiErrorThrown from './middlewares/apiErrorThrown.js'
import cors from 'cors'
import assert from 'node:assert'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Garantizar que las variables de entorno necesarias estén definidas
assert(
	process.env.JWT_SECRET,
	'Error: JWT_SECRET no está definido en las variables de entorno',
)
assert(
	process.env.FRONTEND_URL,
	'Error: FRONTEND_URL no está definido en las variables de entorno',
)

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
		origin: process.env.FRONTEND_URL,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true, // Compartir cookies entre frontend y backend
	}),
)

// Montar rutas de usuarios
app.use('/api/v1/', userRoutes)

// Montar rutas de administración
app.use('/api/v1/', adminRoutes)

// Montar ruta de especificación OpenAPI
const currentDir = dirname(fileURLToPath(import.meta.url))
const openApiPath = resolve(currentDir, '../docs/openapi.json')
const swaggerSpec = JSON.parse(readFileSync(openApiPath, 'utf-8'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Middleware para manejar errores lanzados desde servicios
app.use(apiErrorThrown)

app.listen(8000, () => console.log('Servidor escuchando en puerto 8000'))

export default app
