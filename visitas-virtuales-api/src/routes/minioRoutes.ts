import { Router } from 'express'
import minioService from '../services/minioService.ts'
import multer from 'multer'

const router = Router()
// Configurar multer para guardar partes de ficheros en memoria antes de subirlas a MinIO
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 },
}) // Limitar a 10MB por parte

// TODO: Mover lógica a controller y service para mantener router limpio

/**
 * @openapi
 * /api/v1/upload/init:
 *   post:
 *     summary: Iniciar subida multipart a MinIO
 *     tags:
 *       - Upload
 *     description: Solicita un uploadId para iniciar una subida multipart. El cliente debe proporcionar el nombre del fichero y su tipo MIME.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 description: Nombre del fichero a subir (sin path)
 *               mimeType:
 *                 type: string
 *                 description: Tipo MIME del fichero (ej. image/jpeg)
 *     responses:
 *       200:
 *         description: uploadId generado correctamente, listo para recibir partes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito indicando que el uploadId se ha generado y la subida multipart está lista para recibir partes
 *                 uploadId:
 *                   type: string
 *                   description: Identificador de la subida multipart en curso
 *                 fileName:
 *                   type: string
 *                   description: Nombre del fichero limpiado para evitar colisiones o problemas de seguridad
 *       400:
 *         description: Faltan datos requeridos (fileName o mimeType)
 *       500:
 *         description: Error al iniciar la subida multipart
 */
// Iniciar subida multipart
router.post('/upload/init', async (req, res) => {
	try {
		if (!req.body) {
			return res
				.status(400)
				.json({
					error: 'Solicitud sin cuerpo, se requieren fileName y mimeType',
				})
		}
		const { fileName, mimeType } = req.body
		if (!fileName || !mimeType) {
			return res
				.status(400)
				.json({ error: 'fileName y mimeType son requeridos' })
		}

		// Limpiar el nombre del fichero para evitar problemas de seguridad o colisiones
		const sanitizedFileName = await minioService.sanitizeFileName(fileName)

		// Indicar a MinIO que vamos a subir un nuevo fichero por partes, obteniendo un uploadId para identificar la subida multipart en curso
		const uploadId = await minioService.startMultipart(
			sanitizedFileName,
			mimeType,
		)
		res.json({
			message: 'uploadId generado exitosamente, listo para recibir partes',
			uploadId,
			fileName: sanitizedFileName,
		})
	} catch (e) {
		console.error('Error al iniciar subida multipart:', e)
		res.status(500).json({ error: 'Error al iniciar subida multipart' })
	}
})

/**
 * @openapi
 * /api/v1/upload/part:
 *   post:
 *     summary: Subir parte de un fichero a MinIO
 *     tags:
 *       - Upload
 *     description: Sube una parte de un fichero utilizando el uploadId generado previamente. El cliente debe proporcionar el nombre del fichero, el uploadId, el número de parte y el contenido de la parte.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 description: Nombre del fichero (debe coincidir con el usado para iniciar la subida)
 *               uploadId:
 *                 type: string
 *                 description: Identificador de la subida multipart en curso
 *               partNumber:
 *                 type: integer
 *                 description: Número de parte (comenzando en 1)
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Contenido de la parte (Máximo 10MB)
 *     responses:
 *       200:
 *         description: Parte subida correctamente, devuelve el etag de la parte para su posterior uso en la finalización de la subida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 etag:
 *                   type: string
 *                   description: eTag de la parte subida, necesario para completar la subida multipart
 *       400:
 *         description: Faltan datos requeridos (fileName, uploadId, partNumber o file)
 *       500:
 *         description: Error al subir la parte del fichero
 */
// Subir parte (multer intercepta la parte y la pone en req.file.buffer)
router.post('/upload/part', upload.single('file'), async (req, res) => {
	try {
		const { fileName, uploadId, partNumber } = req.body
		const buffer = req.file?.buffer
		if (!buffer || !fileName || !uploadId || !partNumber) {
			return res.status(400).json({
				error: 'fileName, uploadId, partNumber y file (parte) son requeridos',
			})
		}

		const partData = await minioService.uploadPart(
			fileName,
			uploadId,
			parseInt(partNumber), // Aseguramos que sea número
			buffer,
		)

		res.json({
			message: `Parte ${partNumber} subida exitosamente`,
			etag: partData.etag, // Devolver el etag de la parte para su uso en la finalización de la subida
		})
	} catch (e) {
		console.error('Error al procesar parte de subida multipart:', e)
		res
			.status(500)
			.json({ error: 'Error al procesar parte de subida multipart' })
	}
})

/**
 * @openapi
 * /api/v1/upload/abort:
 *   post:
 *     summary: Cancelar una subida multipart en curso
 *     tags:
 *       - Upload
 *     description: Cancela una subida multipart utilizando el uploadId. Esto eliminará cualquier parte subida y limpiará los recursos asociados a esa subida multipart en MinIO.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 description: Nombre del fichero asociado a la subida multipart (debe coincidir con el usado para iniciar la subida)
 *               uploadId:
 *                 type: string
 *                 description: Identificador de la subida multipart en curso que se desea cancelar
 *     responses:
 *       200:
 *         description: Subida multipart cancelada y recursos limpiados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito indicando que la subida multipart ha sido cancelada y los recursos asociados han sido limpiados
 *       400:
 *         description: Faltan datos requeridos (fileName o uploadId)
 *       500:
 *         description: Error al cancelar la subida multipart
 */
// Cancelar subida multipart
router.post('/upload/abort', async (req, res) => {
	try {
		const { fileName, uploadId } = req.body
		if (!fileName || !uploadId) {
			return res
				.status(400)
				.json({ error: 'fileName y uploadId son requeridos' })
		}
		await minioService.abortMultipart(fileName, uploadId)
		res.json({ message: 'Subida cancelada y limpieza realizada' })
	} catch (e) {
		res.status(500).json({ error: 'Error al abortar subida' })
	}
})

/**
 * @openapi
 * /api/v1/upload/complete:
 *   post:
 *     summary: Completar una subida multipart
 *     tags:
 *       - Upload
 *     description: Completa una subida multipart utilizando el uploadId y la lista de partes subidas. Esto unirá todas las partes en MinIO y hará que el fichero esté disponible para su acceso.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 description: Nombre del fichero asociado a la subida multipart (debe coincidir con el usado para iniciar la subida)
 *               uploadId:
 *                 type: string
 *                 description: Identificador de la subida multipart en curso que se desea completar
 *               parts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     partNumber:
 *                       type: integer
 *                       description: Número de parte (comenzando en 1)
 *                     etag:
 *                       type: string
 *                       description: eTag de la parte subida, obtenido al subir cada parte, necesario para completar la subida multipart
 *     responses:
 *       200:
 *         description: Subida multipart completada y fichero disponible para acceso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito indicando que la subida multipart ha sido completada y el fichero está disponible para acceso
 *                 url:
 *                   type: string
 *                   example: "/assets/550e8400-e29b-41d4-a716-446655440000.jpg"
 *       400:
 *         description: Faltan datos requeridos (fileName, uploadId o parts) o formato incorrecto de parts
 *       500:
 *         description: Error al completar la subida multipart
 */
// Subir fichero completo una vez disponemos de todas las partes
// MinIO las une en el orden correcto usando los etags y almacena el fichero final
router.post('/upload/complete', async (req, res) => {
	try {
		const { fileName, uploadId, parts } = req.body
		if (!fileName || !uploadId || !parts || !Array.isArray(parts)) {
			return res
				.status(400)
				.json({ error: 'fileName, uploadId y parts (array) son requeridos' })
		}

		const result = await minioService.completeMultipart(
			fileName,
			uploadId,
			parts,
		)

		// Proporcionar URL de acceso al fichero subido
		res.json({
			message: 'Subida multipart completada',
			url: `/assets/${fileName}`,
		})
	} catch (e) {
		console.error('Error al completar subida multipart:', e)
		res.status(500).json({ error: 'Error al completar subida multipart' })
	}
})

// Obtener imagen (proxy)
router.get('/assets/:fileName', async (req, res) => {
	try {
		const fileName = req.params.fileName
		// Obtener stream del fichero y headers desde MinIO
		const { stream, contentType, size } =
			await minioService.getImageStream(fileName)

		// Configurar headers de respuesta
		res.setHeader('Content-Type', contentType)
		res.setHeader('Content-Length', size)

		// Indicar que el nombre del fichero es immutable
		res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

		// Manejar errores para evitar leaks de memoria si el stream falla (cerrar socket de red hacia MinIO)
		stream.on('error', (err) => {
			console.error('Error en el stream de MinIO:', err)
			if (!res.headersSent) {
				res.status(500).send('Error al transmitir la imagen')
			}
		})

		// Enviar el stream al cliente
		stream.pipe(res)
	} catch (e) {
		console.error('Error al obtener imagen:', e)
		res.status(404).json({ error: 'Imagen no encontrada' })
	}
})

export default router
