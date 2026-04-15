import { generateAccessToken, generateRefreshToken } from '../helpers/jwt.js'
import { verifyToken } from '../helpers/jwt.js'
import { getHttpOnlyCookieOptions } from '../helpers/cookies.js'
import userService from '../services/userService.ts'
import { env } from '../../env.ts'

/**
 *
 * @param request.body debe contener email, username, password y centerId
 * @returns objeto con accessToken (refreshToken se envía al cliente en una cookie HTTP-only)
 * @throws manejados por middleware apiErrorHandler
 */
export const registerHandler = async (req, res) => {
	const tokenPair = await userService.register(req.body)
	res.cookie('refreshToken', tokenPair.refreshToken, getHttpOnlyCookieOptions())
	res.status(201).json({
		message: 'Usuario registrado exitosamente',
		accessToken: tokenPair.accessToken,
	})
}

/**
 *
 * @param request.body debe contener email o username y password
 * @returns objeto con accessToken (refreshToken se envía al cliente en una cookie HTTP-only)
 * @throws manejados por middleware apiErrorHandler
 */
export const loginHandler = async (req, res) => {
	const tokenPair = await userService.login(req.body)
	// Insertar token de actualización en cookie HTTP-only para que el cliente lo envíe automáticamente en cada solicitud
	res.cookie('refreshToken', tokenPair.refreshToken, getHttpOnlyCookieOptions())
	res.json({
		message: 'Usuario autenticado exitosamente',
		accessToken: tokenPair.accessToken,
	})
}

// TODO: implementar endpoint para que el usuario pueda actualizar su perfil
export const userUpdateHandler = (req, res) => {
	res.json({
		message:
			'Ruta para actualizar el perfil del usuario autenticado - ID obtenido desde el token de acceso',
	})
}

/**
 *
 * @param req debe contener la cookie HTTP-only refreshToken enviada automáticamente por el navegador
 * @returns objeto con un nuevo accessToken si el refreshToken es válido (refreshToken se envía al cliente en una cookie HTTP-only)
 *
 * El token de actualización se enviará desde el cliente en una cookie HTTP-only para evitar ataques XSS.
 * El cliente no tiene acceso directo a esta cookie, el navegador la envía automáticamente en cada solicitud al backend.
 */
export const refreshTokenHandler = async (req, res) => {
	const token = req.cookies?.refreshToken

	// Denegar acceso si no se proporciona un token de actualización
	if (!token) {
		env.APP_STAGE === 'dev' &&
			console.warn(
				'Token de actualización no proporcionado para ruta protegida: ' +
					req.method +
					' ' +
					req.originalUrl,
			)
		return res
			.status(401)
			.json({ message: 'Token de actualización no proporcionado' })
	}

	// Verificar token de actualización y generar un nuevo token de acceso si es válido
	try {
		const { payload } = await verifyToken(token)
		const newAccessToken = await generateAccessToken(payload.sub, payload.role)
		// Adicionalmente, renovar el token de actualización
		const newRefreshToken = await generateRefreshToken(
			payload.sub,
			payload.role,
		)
		res.cookie('refreshToken', newRefreshToken, getHttpOnlyCookieOptions())
		return res.json({
			message: 'Tokens renovados exitosamente',
			accessToken: newAccessToken,
		})
	} catch (_) {
		env.APP_STAGE === 'dev' &&
			console.warn(
				'Token de actualización inválido o expirado para ruta protegida: ' +
					req.method +
					' ' +
					req.originalUrl,
			)
		// Denegar acceso si el token de actualización es inválido o ha expirado
		return res.status(403).json({
			message: 'Token de actualización inválido o expirado',
		})
	}
}

/**
 *
 * @param req contiene el ID del usuario autenticado en req.user.sub, proporcionado por el middleware isAuthenticated
 * @returns perfil del usuario autenticado
 * @throws manejados por middleware apiErrorHandler
 */
export const profileHandler = async (req, res) => {
	const userProfile = await userService.getUserProfile(req.user.sub)
	return res.json({
		message: 'Perfil de usuario obtenido exitosamente',
		profile: userProfile,
	})
}
