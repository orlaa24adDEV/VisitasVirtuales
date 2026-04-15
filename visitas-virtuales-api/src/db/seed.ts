import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import {
	users,
	centers,
	pois,
	UserInsertType,
	PoiInsertType,
	UserSelectType,
	UserSelectMinusPasswordType,
} from './schema.ts'
import 'dotenv/config'
import { env } from '../../env.ts'
import bcrypt from 'bcrypt'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle({ client: pool })

async function main() {
	try {
		// Limpiar datos previos para poder ejecutar seed múltiples veces sin conflictos
		await db.delete(pois)
		await db.delete(users)
		await db.delete(centers)
		await db.execute('ALTER SEQUENCE users_id_seq RESTART WITH 1')
		await db.execute('ALTER SEQUENCE centers_id_seq RESTART WITH 1')
		await db.execute('ALTER SEQUENCE pois_id_seq RESTART WITH 1')

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
		const adminPassword = await bcrypt.hash('Admin123!', 10)
		const teacherPassword = await bcrypt.hash('Profe123!', 10)
		const studentPassword = await bcrypt.hash('Alumno123!', 10)

		const mockUserData: UserInsertType[] = [
			{
				email: 'admin_mad@instituto.es',
				username: 'admin_mad',
				password: adminPassword,
				role: 'admin',
			},
			{
				email: 'admin_bar@instituto.es',
				username: 'admin_bar',
				password: adminPassword,
				role: 'admin',
			},
			{
				email: 'admin_sev@instituto.es',
				username: 'admin_sev',
				password: adminPassword,
				role: 'admin',
			},
			{
				email: 'profesor_mad@instituto.es',
				username: 'prof_mad',
				password: teacherPassword,
				role: 'teacher',
			},
			{
				email: 'profesor_bar@instituto.es',
				username: 'prof_bar',
				password: teacherPassword,
				role: 'teacher',
			},
			{
				email: 'profesor_sev@instituto.es',
				username: 'prof_sev',
				password: teacherPassword,
				role: 'teacher',
			},
			{
				email: 'alumno_mad@instituto.es',
				username: 'alumno_mad',
				password: studentPassword,
				role: 'student',
			},
			{
				email: 'alumno_bar@instituto.es',
				username: 'alumno_bar',
				password: studentPassword,
				role: 'student',
			},
			{
				email: 'alumno_sev@instituto.es',
				username: 'alumno_sev',
				password: studentPassword,
				role: 'student',
			},
		]
		const insertedUsers: { id: number; username: string }[] = await db
			.insert(users)
			.values(mockUserData)
			.returning({ id: users.id, username: users.username })

		const usersByUsername = Object.fromEntries(
			insertedUsers.map((u) => [u.username, u]),
		)

		// Insertar POIs de prueba
		const mockPois: PoiInsertType[] = [
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
