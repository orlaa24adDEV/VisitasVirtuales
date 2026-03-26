import { SignJWT } from 'jose'
import assert from 'node:assert'

// Comprobar que las variables de entorno necesarias para JWT están definidas
assert(
  process.env.JWT_SECRET,
  'Error: JWT_SECRET no está definido en las variables de entorno',
)
assert(
  process.env.JWT_ACCESS_TOKEN_TTL,
  'Error: JWT_ACCESS_TOKEN_TTL no está definido en las variables de entorno',
)
assert(
  process.env.JWT_REFRESH_TOKEN_TTL,
  'Error: JWT_REFRESH_TOKEN_TTL no está definido en las variables de entorno',
)
assert(
  process.env.JWT_ISSUER,
  'Error: JWT_ISSUER no está definido en las variables de entorno',
)
assert(
  process.env.JWT_AUDIENCE,
  'Error: JWT_AUDIENCE no está definido en las variables de entorno',
)

const secret = new TextEncoder().encode(process.env.JWT_SECRET)
const expiration = process.env.JWT_ACCESS_TOKEN_TTL
const issuer = process.env.JWT_ISSUER
const audience = process.env.JWT_AUDIENCE
const alg = 'HS256'

const generateToken = (sub, role, ttl) => {
  const payload = {
    sub,
    role,
  }

  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuer(issuer)
    .setIssuedAt()
    .setAudience(audience)
    .setExpirationTime(ttl)
    .sign(secret)
}

const generateAccessToken = (sub, role) => {
  return generateToken(sub, role, expiration)
}

const generateRefreshToken = (sub, role) => {
  return generateToken(sub, role, process.env.JWT_REFRESH_TOKEN_TTL)
}

const verifyToken = async (token) => {
  try {
    const { payload } = await jose.jwtVerify(token, secret, {
      issuer,
      audience,
    })
    return payload
  } catch (err) {
    throw new Error('Token inválido o expirado: ' + err.message)
  }
}

export { generateAccessToken, generateRefreshToken, verifyToken }
