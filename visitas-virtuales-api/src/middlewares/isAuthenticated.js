import { verifyToken } from '../helpers/jwt.js'
import { env } from '../../env.ts'

const isAuthenticated = async (req, res, next) => {
	const authHeader = req.headers['authorization']
	// Authorization: Bearer <token>
	const token = authHeader && authHeader.split(' ')[1]

	// Denegar acceso si no se proporciona un token
	if (!token) {
		env.APP_STAGE === 'dev' &&
			console.warn(
				'Token de acceso no proporcionado para ruta protegida: ' +
					req.method +
					' ' +
					req.originalUrl,
			)
		return res
			.status(401)
			.json({ message: 'Token de acceso no proporcionado' })
	}

	// Verificar token, almacenar claims del usuario y pasar al siguiente middleware o ruta
	try {
		const { payload } = await verifyToken(token)
		req.user = payload
		next()
	} catch (_) {
		env.APP_STAGE === 'dev' &&
			console.warn(
				'Token de acceso inválido o expirado para ruta protegida: ' +
					req.method +
					' ' +
					req.originalUrl,
			)
		return res
			.status(403)
			.json({
				message: 'Token de acceso inválido o expirado',
			})
	}
}

export default isAuthenticated
