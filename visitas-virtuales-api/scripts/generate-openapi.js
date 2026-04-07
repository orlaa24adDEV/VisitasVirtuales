import swaggerJSDoc from 'swagger-jsdoc'
import fs from 'fs'

try {
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
	fs.writeFileSync('docs/openapi.json', JSON.stringify(swaggerSpec, null, 2))
	console.log('OpenAPI spec written to docs/openapi.json')
	process.exitCode = 0
} catch (error) {
	console.error('Error generating OpenAPI spec:', error)
	process.exitCode = 1
}
