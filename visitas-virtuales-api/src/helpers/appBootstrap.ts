import minioService from '../services/minioService.ts'
import { env } from '../env.ts'
import app from '../app.ts'
export default async function appBootstrap() {
	try {
		await minioService.init()
		console.log('MinIO inicializado y bucket verificado')
		app.listen(env.APP_PORT, () =>
			console.log(`Servidor escuchando en puerto ${env.APP_PORT}`),
		)
	} catch (e) {
		console.error('Error al inicializar MinIO', e)
		process.exit(1)
	}
}
