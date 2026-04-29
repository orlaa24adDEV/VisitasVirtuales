import storageService from '../services/storageService.ts'
import { uploadIdMap } from '../controllers/storageController.ts'
import { UPLOAD_TTL_MS } from '../jobs/uploadCleanupJob.ts'
import { env } from '../env.ts'
import app from '../app.ts'
import uploadCleanupJob from '../jobs/uploadCleanupJob.ts'

const uploadCleanupJobInstance = uploadCleanupJob(
	storageService,
	uploadIdMap,
	UPLOAD_TTL_MS,
)

export default async function appBootstrap() {
	try {
		await storageService.init()
		uploadCleanupJobInstance.start()
		app.listen(env.APP_PORT, () =>
			console.log(`Servidor escuchando en puerto ${env.APP_PORT}`),
		)
	} catch (e) {
		uploadCleanupJobInstance.stop()
		console.error('Error al inicializar MinIO', e)
		process.exit(1)
	}
}
