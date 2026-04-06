import { verifyToken } from '../helpers/jwt.js'

const isAuthenticated = async (req, res, next) => {
	const authHeader = req.headers['authorization']
	// Authorization: Bearer <token>
	const token = authHeader && authHeader.split(' ')[1]

	// Denegar acceso si no se proporciona un token
	if (!token) {
		res.locals.statusMessage =
			'error(authMiddleware): el cliente no proporcionó un token de acceso'
		return res
			.status(401)
			.json({ message: 'Error: El cliente no proporcionó un token de acceso' })
	}

	// Verificar token, almacenar claims del usuario y pasar al siguiente middleware o ruta
	await verifyToken(token)
		.then(({ payload }) => {
			req.user = payload
			next()
		})
		.catch((err) => {
			res.locals.statusMessage =
				'error(authMiddleware): El token proporcionado es inválido o ha expirado - ' +
				err.message
			return res.status(403).json({
				message: 'Error: El token proporcionado es inválido o ha expirado',
			})
		})
}

export default isAuthenticated
