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
				name: 'Instituto Madrid',
				description: 'Centro educativo principal en Madrid',
				location: 'Madrid, España',
			},
			{
				name: 'Instituto Barcelona',
				description: 'Centro educativo principal en Barcelona',
				location: 'Barcelona, España',
			},
			{
				name: 'Instituto Sevilla',
				description: 'Centro educativo principal en Sevilla',
				location: 'Sevilla, España',
			},
		]
		const insertedCenters = await db
			.insert(centers)
			.values(mockCenters)
			.returning()

		// Insertar usuarios de prueba
		const adminPassword = await bcrypt.hash('admin123', 10)
		const teacherPassword = await bcrypt.hash('prof123', 10)
		const studentPassword = await bcrypt.hash('alumno123', 10)

		const mockUserData = [
			{
				email: 'admin_mad@instituto.es',
				username: 'admin_mad',
				password: adminPassword,
				role: 'admin',
				centerId: insertedCenters[0].id,
			},
			{
				email: 'admin_bar@instituto.es',
				username: 'admin_bar',
				password: adminPassword,
				role: 'admin',
				centerId: insertedCenters[1].id,
			},
			{
				email: 'admin_sev@instituto.es',
				username: 'admin_sev',
				password: adminPassword,
				role: 'admin',
				centerId: insertedCenters[2].id,
			},
			{
				email: 'profesor_mad@instituto.es',
				username: 'prof_mad',
				password: teacherPassword,
				role: 'teacher',
				centerId: insertedCenters[0].id,
			},
			{
				email: 'profesor_bar@instituto.es',
				username: 'prof_bar',
				password: teacherPassword,
				role: 'teacher',
				centerId: insertedCenters[1].id,
			},
			{
				email: 'profesor_sev@instituto.es',
				username: 'prof_sev',
				password: teacherPassword,
				role: 'teacher',
				centerId: insertedCenters[2].id,
			},
			{
				email: 'alumno_mad@instituto.es',
				username: 'alumno_mad',
				password: studentPassword,
				role: 'student',
				centerId: insertedCenters[0].id,
			},
			{
				email: 'alumno_bar@instituto.es',
				username: 'alumno_bar',
				password: studentPassword,
				role: 'student',
				centerId: insertedCenters[1].id,
			},
			{
				email: 'alumno_sev@instituto.es',
				username: 'alumno_sev',
				password: studentPassword,
				role: 'student',
				centerId: insertedCenters[2].id,
			},
		]
		const insertedUsers = await db
			.insert(users)
			.values(mockUserData)
			.returning()

		const usersByUsername = Object.fromEntries(
			insertedUsers.map((u) => [u.username, u])
		)

		// Insertar POIs de prueba
		const mockPois = [
			// Instituto Madrid
			{
				name: 'Cafetería',
				details: { description: 'Cafetería principal del centro' },
				centerId: insertedCenters[0].id,
				userId: usersByUsername.prof_mad.id,
			},
			{
				name: 'Tablón de anuncios',
				details: { description: 'Tablón de anuncios de Instituto Madrid' },
				centerId: insertedCenters[0].id,
				userId: usersByUsername.admin_mad.id,
			},
			{
				name: 'Biblioteca',
				details: { description: 'Biblioteca del centro' },
				centerId: insertedCenters[0].id,
				userId: usersByUsername.prof_mad.id,
			},
			// Instituto Barcelona
			{
				name: 'Aula 101',
				details: { description: 'Aula principal de informática' },
				centerId: insertedCenters[1].id,
				userId: usersByUsername.prof_bar.id,
			},
			{
				name: 'Cafetería',
				details: { description: 'Cafetería de Instituto Barcelona' },
				centerId: insertedCenters[1].id,
				userId: usersByUsername.admin_bar.id,
			},
			// Instituto Sevilla
			{
				name: 'Sala de profesores',
				details: { description: 'Sala de profesores de Instituto Sevilla' },
				centerId: insertedCenters[2].id,
				userId: usersByUsername.prof_sev.id,
			},
			{
				name: 'Tablón de anuncios',
				details: { description: 'Tablón de anuncios de Instituto Sevilla' },
				centerId: insertedCenters[2].id,
				userId: usersByUsername.admin_sev.id,
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
