import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { users, centers, pois } from './schema.js'
import 'dotenv/config'
import dotenvExpand from 'dotenv-expand'
import bcrypt from 'bcrypt'

dotenvExpand.expand({ parsed: process.env })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle({ client: pool })

async function main() {
	try {
		// Insertar centros de prueba primero
		const mockCenters = [
			{
				name: 'MEDAC Málaga',
				description: 'Centro MEDAC en Málaga',
				location: 'Málaga, España',
			},
			{
				name: 'MEDAC Madrid',
				description: 'Centro MEDAC en Madrid',
				location: 'Madrid, España',
			},
			{
				name: 'MEDAC Sevilla',
				description: 'Centro MEDAC en Sevilla',
				location: 'Sevilla, España',
			},
			{
				name: 'MEDAC Barcelona',
				description: 'Centro MEDAC en Barcelona',
				location: 'Barcelona, España',
			},
		]
		const insertedCenters = await db
			.insert(centers)
			.values(mockCenters)
			.returning()

		// Insertar usuarios de prueba
		const mockUserData = [
			{
				email: 'francisco@zaitec.es',
				username: 'francisco',
				password: await bcrypt.hash('francisco123', 10),
				role: 'admin',
				centerId: insertedCenters[0].id,
			},
			{
				email: 'jaime@zaitec.es',
				username: 'jaime',
				password: await bcrypt.hash('jaime123', 10),
				role: 'admin',
				centerId: insertedCenters[1].id,
			},
			{
				email: 'alumno@alu.medac.es',
				username: 'alumno',
				password: await bcrypt.hash('alumno123', 10),
				role: 'user',
				centerId: insertedCenters[0].id,
			},
			{
				email: 'alumno2@alu.medac.es',
				username: 'alumno2',
				password: await bcrypt.hash('alumno123', 10),
				role: 'user',
				centerId: insertedCenters[1].id,
			},
		]
		const insertedUsers = await db
			.insert(users)
			.values(mockUserData)
			.returning()

		// Insertar POIs de prueba
		const mockPois = [
			// MEDAC Málaga
			{
				name: 'Cafetería',
				details: { description: 'Cafetería principal del centro' },
				centerId: insertedCenters[0].id,
				userId: insertedUsers[0].id,
			},
			{
				name: 'Tablón de anuncios',
				details: { description: 'Tablón de anuncios de MEDAC Málaga' },
				centerId: insertedCenters[0].id,
				userId: insertedUsers[1].id,
			},
			{
				name: 'Biblioteca',
				details: { description: 'Biblioteca del centro' },
				centerId: insertedCenters[0].id,
				userId: insertedUsers[0].id,
			},
			// MEDAC Madrid
			{
				name: 'Aula 101',
				details: { description: 'Aula principal de informática' },
				centerId: insertedCenters[1].id,
				userId: insertedUsers[0].id,
			},
			{
				name: 'Cafetería',
				details: { description: 'Cafetería de MEDAC Madrid' },
				centerId: insertedCenters[1].id,
				userId: insertedUsers[1].id,
			},
			// MEDAC Sevilla
			{
				name: 'Sala de profesores',
				details: { description: 'Sala de profesores de MEDAC Sevilla' },
				centerId: insertedCenters[2].id,
				userId: insertedUsers[1].id,
			},
			{
				name: 'Tablón de anuncios',
				details: { description: 'Tablón de anuncios de MEDAC Sevilla' },
				centerId: insertedCenters[2].id,
				userId: insertedUsers[1].id,
			},
			// MEDAC Barcelona
			{
				name: 'Biblioteca',
				details: { description: 'Biblioteca de MEDAC Barcelona' },
				centerId: insertedCenters[3].id,
				userId: insertedUsers[0].id,
			},
			{
				name: 'Aula 202',
				details: { description: 'Aula de ciencias' },
				centerId: insertedCenters[3].id,
				userId: insertedUsers[1].id,
			},
		]
		await db.insert(pois).values(mockPois)

		console.log('Datos de prueba insertados correctamente.')
		process.exit(0)
	} catch (error) {
		console.error('Error al insertar datos de prueba:', error)
		process.exit(1)
	}
}

void main()
