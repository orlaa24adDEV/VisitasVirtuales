import { generateAccessToken } from '../helpers/jwt.js'
import { verifyToken } from '../helpers/jwt.js'
import { getHttpOnlyCookieOptions } from '../helpers/cookies.js'
import userService from '../services/userService.js'

/**
 *
 * @param request.body debe contener email, username y password
 * @returns objeto con accessToken (refreshToken se envía al cliente en una cookie HTTP-only)
 * @throws manejados por middleware apiErrorHandler
 */
export const registerHandler = async (req, res) => {
	const tokenPair = await userService.register(req.body)
	res.locals.statusMessage = 'Usuario registrado exitosamente'
	res.cookie('refreshToken', tokenPair.refreshToken, getHttpOnlyCookieOptions())
	res.status(201).json({
		message: 'Usuario registrado exitosamente',
		tokens: tokenPair.accessToken,
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
	res.locals.statusMessage = 'Usuario autenticado exitosamente'
	res.cookie('refreshToken', tokenPair.refreshToken, getHttpOnlyCookieOptions())
	res.json({
		message: 'Usuario autenticado exitosamente',
		accessToken: tokenPair.accessToken,
	})
}

// TODO: implementar endpoint para que el usuario pueda actualizar su perfil
export const userUpdateHandler = (req, res) => {
	res.json({
		message: `Ruta para actualizar el usuario con ID ${req.params.id} - solo accesible para el propio usuario`,
	})
}

export const refreshTokenHandler = async (req, res) => {
	console.log('Cookies recibidas en refreshTokenHandler')
	// El token de actualización se enviará desde el cliente en una cookie HTTP-only para evitar ataques XSS
	// El frontend, por diseño, no tiene acceso a esta cookie, el backend la entrega al navegador y el navegador la envía en cada solicitud
	const token = req.cookies?.refreshToken

	if (!token) {
		res.locals.statusMessage =
			'error(refreshTokenHandler): No se proporcionó un token de actualización'
		return res
			.status(401)
			.json({ message: 'Error: No se proporcionó un token de actualización' })
	}

	// Verificar token de actualización y generar un nuevo token de acceso si es válido
	verifyToken(token)
		.then(async (payload) => {
			const newAccessToken = await generateAccessToken(
				payload.sub,
				payload.role,
			)
			res.locals.statusMessage = 'Nuevo token de acceso generado exitosamente'
			res.json({ accessToken: newAccessToken })
		})
		.catch((err) => {
			res.locals.statusMessage =
				'error(refreshTokenHandler): El token de actualización proporcionado es inválido o ha expirado - ' +
				err.message
			return res.status(403).json({
				message:
					'Error: El token de actualización proporcionado es inválido o ha expirado',
			})
		})
}

/**
 *
 * @param request.user.id es asignado por el middleware isAuthenticated después de verificar el token de acceso
 * @returns perfil del usuario autenticado
 * @throws manejados por middleware apiErrorHandler
 */
export const profileHandler = async (req, res) => {
	const userProfile = await userService.getUserProfile(req.user.sub)
	res.locals.statusMessage = 'Perfil de usuario obtenido exitosamente'
	res.json({
		message: 'Perfil de usuario obtenido exitosamente',
		profile: userProfile,
	})
}
