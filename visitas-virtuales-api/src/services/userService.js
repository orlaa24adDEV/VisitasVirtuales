import bcrypt from 'bcrypt'
import { eq, or } from 'drizzle-orm'
import { db } from '../db/db.js'
import { users } from '../db/schema.js'
import { generateAccessToken, generateRefreshToken } from '../helpers/jwt.js'
import ApiError from '../helpers/ApiError.js'

const register = async (userRegisterRequest) => {
  const { email, username, password } = userRegisterRequest
  if (!email || !username || !password) {
    throw new ApiError(
      400,
      'Email, nombre de usuario y contraseña son obligatorios',
    )
  }
  const existingUserArr = await db
    .select()
    .from(users)
    .where(or(eq(users.email, email), eq(users.username, username)))
    .limit(1)

  const existingUser = existingUserArr[0]

  if (existingUser) {
    throw new ApiError(409, 'El email o el nombre de usuario ya están en uso')
  }

  const isFirstUser = (await db.select().from(users)).length === 0

  // Aplicar hashing a la contraseña (bcrypt)
  const hashedPassword = await bcrypt.hash(password, 10)
  userRegisterRequest = {
    ...userRegisterRequest,
    password: hashedPassword,
    // El primer usuario registrado será admin, el resto serán usuarios normales
    role: isFirstUser ? 'admin' : 'user',
  }

  const newUserArr = await db
    .insert(users)
    .values(userRegisterRequest)
    .returning()
  const newUser = newUserArr[0]
  if (newUser.length === 0) {
    throw new ApiError(500, 'Error al registrar el usuario')
  }
  const tokenPair = {
    accessToken: await generateAccessToken(newUser.id, newUser.role),
    refreshToken: await generateRefreshToken(newUser.id, newUser.role),
  }
  if (!tokenPair.accessToken || !tokenPair.refreshToken) {
    throw new ApiError(500, 'Error al generar los tokens de autenticación')
  }
  // TODO: garantizar que el token de actualización se almacene de forma segura en el cliente (cookie HTTP-only) y se invalide al cerrar sesión o después de un tiempo determinado
  // Devolver ambos tokens al controlador para que los envíe al cliente
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

const getUserProfile = async (userId) => {
  const userArr = await db
    .select({ id: users.id, email: users.email, username: users.username, role: users.role })
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
