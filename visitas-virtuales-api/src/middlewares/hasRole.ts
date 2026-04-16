import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../helpers/jwt.js'
import { env } from '../../env.ts'
import type { JWTPayload } from 'jose'

const hasRole = (roles: string | string[]) => {
	const allowedRoles = Array.isArray(roles) ? roles : [roles]

	return async (
		req: Request & { user: JWTPayload },
		res: Response,
		next: NextFunction,
	) => {
		// Comprobar que el usuario esté autenticado y tenga un rol válido
		const authHeader = req.headers['authorization']
		// Authorization: Bearer <token>
		const token = authHeader && authHeader.split(' ')[1]

		if (!token) {
			env.APP_STAGE === 'dev' &&
				console.warn(
					`Acceso denegado - no se proporcionó un token de acceso: + ${req.method} ${req.originalUrl}`,
				)
			return res.status(401).json({
				message: 'No se proporcionó un token de acceso',
			})
		}

		// Verificar token y extraer claims del usuario
		try {
			const { payload } = await verifyToken(token)
			req.user = payload
		} catch (err) {
			env.APP_STAGE === 'dev' &&
				console.warn(
					'Token de acceso inválido o expirado para ruta protegida: ' +
						req.method +
						' ' +
						req.originalUrl,
				)
			return res.status(403).json({
				message: 'Token de acceso inválido o expirado',
			})
		}

		const userRole = req.user?.role

		if (!userRole) {
			env.APP_STAGE === 'dev' &&
				console.warn(
					`Acceso denegado - no se encontró el rol del usuario en la solicitud: + ${req.method} ${req.originalUrl}`,
				)
			return res.status(403).json({
				message: 'No tienes permiso para acceder a este recurso',
			})
		}

		if (!allowedRoles.includes(userRole) && !allowedRoles.includes('any')) {
			env.APP_STAGE === 'dev' &&
				console.warn(
					`Acceso denegado - el rol del usuario (${userRole}) no tiene permisos para acceder a este recurso: + ${req.method} ${req.originalUrl}`,
				)
			return res.status(403).json({
				message: 'No tienes permiso para acceder a este recurso',
			})
		}

		next()
	}
}

export default hasRole
