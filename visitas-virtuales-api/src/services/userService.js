import bcrypt from 'bcrypt'
import { eq, or } from 'drizzle-orm'
import { db } from '../db/db.js'
import { users, centers } from '../db/schema.js'
import { generateAccessToken, generateRefreshToken } from '../helpers/jwt.js'
import ApiError from '../helpers/ApiError.js'

const EMAIL_PATTERN =
	/^(?=.{1,120}$)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{6,24}$/
const PASSWORD_PATTERN =
	/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,32}$/

const register = async (userRegisterRequest) => {
	const { email, username, password, centerId } = userRegisterRequest
	if (!email || !username || !password || !centerId) {
		throw new ApiError(
			400,
			'Email, nombre de usuario, contraseña y centro son obligatorios',
		)
	}

	// Verificar que el email tenga un formato válido
	if (!EMAIL_PATTERN.test(email)) {
		throw new ApiError(400, 'El email proporcionado no tiene un formato válido')
	}

	// Verificar que el nombre de usuario tenga al menos 6 caracteres y solo contenga letras, números y guiones bajos
	if (!USERNAME_PATTERN.test(username)) {
		throw new ApiError(
			400,
			'El nombre de usuario debe tener entre 6 y 24 caracteres y solo puede contener letras, números y guiones bajos',
		)
	}

	// Verificar que la contraseña tenga al menos 8 caracteres y contenga al menos un símbolo, un número y una letra mayúscula
	if (!PASSWORD_PATTERN.test(password)) {
		throw new ApiError(
			400,
			'La contraseña debe tener entre 8 y 32 caracteres y contener al menos un símbolo, un número y una letra mayúscula',
		)
	}

	// Verificar que el email o el nombre de usuario no estén ya en uso
	const existingUserArr = await db
		.select()
		.from(users)
		.where(or(eq(users.email, email), eq(users.username, username)))
		.limit(1)

	const existingUser = existingUserArr[0]

	if (existingUser) {
		throw new ApiError(409, 'El email o el nombre de usuario ya están en uso')
	}

	// Verificar que el centro especificado existe
	const centerArr = await db
		.select()
		.from(centers)
		.where(eq(centers.id, centerId))
		.limit(1)

	const center = centerArr[0]

	if (!center) {
		throw new ApiError(400, 'El centro especificado no existe')
	}

	const isFirstUser = (await db.select().from(users)).length === 0

	// Aplicar hashing a la contraseña (bcrypt)
	const hashedPassword = await bcrypt.hash(password, 10)
	userRegisterRequest = {
		...userRegisterRequest,
		password: hashedPassword,
		// El primer usuario registrado será admin, el resto serán usuarios normales
		role: isFirstUser ? 'admin' : 'student',
	}

	const newUserArr = await db
		.insert(users)
		.values(userRegisterRequest)
		.returning()
	const newUser = newUserArr[0]
	if (!newUser) {
		throw new ApiError(500, 'Error al registrar el usuario')
	}
	const tokenPair = {
		accessToken: await generateAccessToken(newUser.id, newUser.role),
		refreshToken: await generateRefreshToken(newUser.id, newUser.role),
	}
	if (!tokenPair.accessToken || !tokenPair.refreshToken) {
		throw new ApiError(500, 'Error al generar los tokens de autenticación')
	}
	return tokenPair
}

const login = async (userLoginRequest) => {
	const { email, username, password } = userLoginRequest
	if ((!email && !username) || !password) {
		throw new ApiError(
			400,
			'Email o nombre de usuario y contraseña son obligatorios',
		)
	}

	if (email && !EMAIL_PATTERN.test(email)) {
		throw new ApiError(400, 'El email proporcionado no tiene un formato válido')
	}

	if (username && username.length > 24) {
		throw new ApiError(
			400,
			'El nombre de usuario no puede tener más de 24 caracteres',
		)
	}

	if (password.length > 32) {
		throw new ApiError(400, 'La contraseña no puede tener más de 32 caracteres')
	}

	const userArr = await db
		.select()
		.from(users)
		.where(email ? eq(users.email, email) : eq(users.username, username))
		.limit(1)

	const user = userArr[0]

	const passwordMatch = user
		? await bcrypt.compare(password, user.password)
		: false

	if (!user || !passwordMatch) {
		throw new ApiError(401, 'Credenciales inválidas')
	}

	const tokenPair = {
		accessToken: await generateAccessToken(user.id, user.role),
		refreshToken: await generateRefreshToken(user.id, user.role),
	}
	if (!tokenPair.accessToken || !tokenPair.refreshToken) {
		throw new ApiError(500, 'Error al generar los tokens de autenticación')
	}
	return tokenPair
}

const getUserProfile = async (sub) => {
	const userId = sub
	const userArr = await db
		.select({
			id: users.id,
			email: users.email,
			username: users.username,
			role: users.role,
		})
		.from(users)
		.where(eq(users.id, Number(userId)))
		.limit(1)

	const userProfile = userArr[0]

	if (!userProfile) {
		throw new ApiError(404, 'Usuario no encontrado')
	}

	return userProfile
}

export default {
	register,
	login,
	getUserProfile,
}
