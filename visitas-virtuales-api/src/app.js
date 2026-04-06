import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import apiErrorThrown from './middlewares/apiErrorThrown.js'
console.log('JWT_SECRET in app.js:', process.env.JWT_SECRET)
const app = express()

// Logger para solicitudes HTTP
morgan.token('status-message', (req, res) => res.statusMessage || '')
app.use(morgan(':method :url :status :status-message - :response-time ms'))

app.use(express.json())

app.use(cookieParser())

// Montar rutas de usuarios
app.use('/api/v1/', userRoutes)

// Montar rutas de administración
app.use('/api/v1/', adminRoutes)

// Montar ruta de especificación OpenAPI
const swaggerSpec = swaggerJSDoc({
	definition: {
		openapi: '3.0.0',
		info: { title: 'Visitas Virtuales API', version: '0.1.0' },
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [{ bearerAuth: [] }],
	},
	apis: ['./src/routes/*.js'],
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Middleware para manejar errores lanzados desde servicios
app.use(apiErrorThrown)

app.listen(3000, () => console.log('Server running on port 3000'))

export default app
