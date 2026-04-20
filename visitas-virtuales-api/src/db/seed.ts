import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import {
	users,
	centers,
	pois,
	UserInsertType,
	PoiInsertType,
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
			{
				name: 'Instituto Valencia',
				description: 'Centro educativo principal en Valencia',
				location: 'Valencia, España',
			},
			{
				name: 'Instituto Córdoba',
				description: 'Centro educativo principal en Córdoba',
				location: 'Córdoba, España',
			},
		]
		const insertedCenters = await db
			.insert(centers)
			.values(mockCenters)
			.returning()

		// Insertar usuarios de prueba
		const adminPassword = await bcrypt.hash('Admin123!', env.BCRYPT_ROUNDS)
		const teacherPassword = await bcrypt.hash('Profe123!', env.BCRYPT_ROUNDS)

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
				email: 'admin_val@instituto.es',
				username: 'admin_val',
				password: adminPassword,
				role: 'admin',
			},
			{
				email: 'admin_cor@instituto.es',
				username: 'admin_cor',
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
				email: 'profesor_val@instituto.es',
				username: 'prof_val',
				password: teacherPassword,
				role: 'teacher',
			},
			{
				email: 'profesor_cor@instituto.es',
				username: 'prof_cor',
				password: teacherPassword,
				role: 'teacher',
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
				name: 'Laboratorio de ciencias',
				details: { description: 'Laboratorio de ciencias de Instituto Madrid' },
				centerId: insertedCenters[0].id,
				userId: usersByUsername.prof_mad.id,
			},
			{
				name: 'Biblioteca',
				details: { description: 'Biblioteca del centro' },
				centerId: insertedCenters[0].id,
				userId: usersByUsername.prof_mad.id,
			},
			{
				name: 'Gimnasio',
				details: { description: 'Gimnasio del centro' },
				centerId: insertedCenters[0].id,
				userId: usersByUsername.prof_mad.id,
			},
			{
				name: 'Sala de profesores',
				details: { description: 'Sala de profesores de Instituto Madrid' },
				centerId: insertedCenters[0].id,
				userId: usersByUsername.prof_mad.id,
			},
			{
				name: 'Aula de informática',
				details: { description: 'Aula de informática de Instituto Madrid' },
				centerId: insertedCenters[0].id,
				userId: usersByUsername.prof_mad.id,
			},
			{
				name: 'Auditorio',
				details: { description: 'Auditorio de Instituto Madrid' },
				centerId: insertedCenters[0].id,
				userId: usersByUsername.admin_mad.id,
			},
			// Instituto Barcelona
			{
				name: 'Aula 101',
				details: { description: 'Aula principal de informática' },
				centerId: insertedCenters[1].id,
				userId: usersByUsername.prof_bar.id,
			},
			{
				name: 'Sala de profesores',
				details: { description: 'Sala de profesores de Instituto Barcelona' },
				centerId: insertedCenters[1].id,
				userId: usersByUsername.prof_bar.id,
			},
			{
				name: 'Biblioteca',
				details: { description: 'Biblioteca de Instituto Barcelona' },
				centerId: insertedCenters[1].id,
				userId: usersByUsername.prof_bar.id,
			},
			{
				name: 'Cafetería',
				details: { description: 'Cafetería de Instituto Barcelona' },
				centerId: insertedCenters[1].id,
				userId: usersByUsername.admin_bar.id,
			},
			{
				name: 'Gimnasio',
				details: { description: 'Gimnasio de Instituto Barcelona' },
				centerId: insertedCenters[1].id,
				userId: usersByUsername.prof_bar.id,
			},
			{
				name: 'Aula de música',
				details: { description: 'Aula de música de Instituto Barcelona' },
				centerId: insertedCenters[1].id,
				userId: usersByUsername.prof_bar.id,
			},
			{
				name: 'Auditorio',
				details: { description: 'Auditorio de Instituto Barcelona' },
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
				name: 'Biblioteca',
				details: { description: 'Biblioteca de Instituto Sevilla' },
				centerId: insertedCenters[2].id,
				userId: usersByUsername.prof_sev.id,
			},
			{
				name: 'Cafetería',
				details: { description: 'Cafetería de Instituto Sevilla' },
				centerId: insertedCenters[2].id,
				userId: usersByUsername.prof_sev.id,
			},
			{
				name: 'Tablón de anuncios',
				details: { description: 'Tablón de anuncios de Instituto Sevilla' },
				centerId: insertedCenters[2].id,
				userId: usersByUsername.admin_sev.id,
			},
			{
				name: 'Gimnasio',
				details: { description: 'Gimnasio de Instituto Sevilla' },
				centerId: insertedCenters[2].id,
				userId: usersByUsername.prof_sev.id,
			},
			{
				name: 'Aula de informática',
				details: { description: 'Aula de informática de Instituto Sevilla' },
				centerId: insertedCenters[2].id,
				userId: usersByUsername.prof_sev.id,
			},
			{
				name: 'Auditorio',
				details: { description: 'Auditorio de Instituto Sevilla' },
				centerId: insertedCenters[2].id,
				userId: usersByUsername.admin_sev.id,
			},
			// Instituto Valencia
			{
				name: 'Aula de música',
				details: { description: 'Aula de música de Instituto Valencia' },
				centerId: insertedCenters[3].id,
				userId: usersByUsername.prof_val.id,
			},
			{
				name: 'Biblioteca',
				details: { description: 'Biblioteca de Instituto Valencia' },
				centerId: insertedCenters[3].id,
				userId: usersByUsername.prof_val.id,
			},
			{
				name: 'Cafetería',
				details: { description: 'Cafetería de Instituto Valencia' },
				centerId: insertedCenters[3].id,
				userId: usersByUsername.prof_val.id,
			},
			{
				name: 'Gimnasio',
				details: { description: 'Gimnasio de Instituto Valencia' },
				centerId: insertedCenters[3].id,
				userId: usersByUsername.prof_val.id,
			},
			{
				name: 'Aula de informática',
				details: { description: 'Aula de informática de Instituto Valencia' },
				centerId: insertedCenters[3].id,
				userId: usersByUsername.prof_val.id,
			},
			{
				name: 'Auditorio',
				details: { description: 'Auditorio de Instituto Valencia' },
				centerId: insertedCenters[3].id,
				userId: usersByUsername.admin_val.id,
			}, 
			{
				name: 'Sala de profesores',
				details: { description: 'Sala de profesores de Instituto Valencia' },
				centerId: insertedCenters[3].id,
				userId: usersByUsername.prof_val.id,
			},
			// Instituto Córdoba
			{
				name: 'Aula de arte',
				details: { description: 'Aula de arte de Instituto Córdoba' },
				centerId: insertedCenters[4].id,
				userId: usersByUsername.prof_cor.id,
			},
			{
				name: 'Biblioteca',
				details: { description: 'Biblioteca de Instituto Córdoba' },
				centerId: insertedCenters[4].id,
				userId: usersByUsername.prof_cor.id,
			},
			{
				name: 'Cafetería',
				details: { description: 'Cafetería de Instituto Córdoba' },
				centerId: insertedCenters[4].id,
				userId: usersByUsername.prof_cor.id,
			},
			{
				name: 'Gimnasio',
				details: { description: 'Gimnasio de Instituto Córdoba' },
				centerId: insertedCenters[4].id,
				userId: usersByUsername.prof_cor.id,
			},
			{
				name: 'Aula de informática',
				details: { description: 'Aula de informática de Instituto Córdoba' },
				centerId: insertedCenters[4].id,
				userId: usersByUsername.prof_cor.id,
			},
			{
				name: 'Auditorio',
				details: { description: 'Auditorio de Instituto Córdoba' },
				centerId: insertedCenters[4].id,
				userId: usersByUsername.admin_cor.id,
			},
			{
				name: 'Sala de profesores',
				details: { description: 'Sala de profesores de Instituto Córdoba' },
				centerId: insertedCenters[4].id,
				userId: usersByUsername.prof_cor.id,
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
