import { relations } from 'drizzle-orm'
import {
	pgTable,
	integer,
	text,
	serial,
	timestamp,
	jsonb,
	pgEnum,
	uniqueIndex,
} from 'drizzle-orm/pg-core'

export const centers = pgTable('centers', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	location: text('location').notNull(),
})

export const userRoles = pgEnum('user_roles', ['admin', 'teacher', 'student'])

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	password: text('password').notNull(),
	role: userRoles('role').notNull().default('student'),
	centerId: integer('center_id')
		.notNull()
		.references(() => centers.id, { onDelete: 'cascade' }),
})

export const pois = pgTable(
	'pois',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		details: jsonb('details').notNull(),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		centerId: integer('center_id')
			.notNull()
			.references(() => centers.id, { onDelete: 'cascade' }),
	},
	(t) => [uniqueIndex('pois_name_center_unique').on(t.name, t.centerId)],
)

export const stats = pgTable('stats', {
	id: serial('id').primaryKey(),
	event_type: text('event_type').notNull(),
	event_count: integer('event_count').notNull().default(0),
	timestamp: timestamp('timestamp').notNull().defaultNow(),
})

export const statsUsers = pgTable('stats_users', {
	id: serial('id').primaryKey(),
	stat_id: integer('stat_id')
		.notNull()
		.references(() => stats.id, { onDelete: 'cascade' }),
	user_id: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
})

export const statsPois = pgTable('stats_pois', {
	id: serial('id').primaryKey(),
	stat_id: integer('stat_id')
		.notNull()
		.references(() => stats.id, { onDelete: 'cascade' }),
	poi_id: integer('poi_id')
		.notNull()
		.references(() => pois.id, { onDelete: 'cascade' }),
})

// Definir relaciones entre tablas para permitir a Drizzle simplificar consultas con joins

// Un centro tiene muchos usuarios y muchos POIs
export const centerRelations = relations(centers, ({ many }) => ({
	users: many(users),
	pois: many(pois),
}))

// Un usuario pertenece a un centro y puede tener muchos POIs y estadísticas
export const userRelations = relations(users, ({ one, many }) => ({
	center: one(centers, {
		fields: [users.centerId],
		references: [centers.id],
	}),
	pois: many(pois),
	stats: many(statsUsers),
}))

// Un POI pertenece a un centro y a un usuario, y puede tener muchas estadísticas
export const poiRelations = relations(pois, ({ one, many }) => ({
	center: one(centers, {
		fields: [pois.centerId],
		references: [centers.id],
	}),
	user: one(users, {
		fields: [pois.userId],
		references: [users.id],
	}),
	stats: many(statsPois),
}))

// Una estadística puede estar relacionada con muchos usuarios y muchos POIs
export const statRelations = relations(stats, ({ many }) => ({
	users: many(statsUsers),
	pois: many(statsPois),
}))

// Cada entrada en stats_users relaciona una estadística con un usuario específico
export const statsUsersRelations = relations(statsUsers, ({ one }) => ({
	stat: one(stats, {
		fields: [statsUsers.stat_id],
		references: [stats.id],
	}),
	user: one(users, {
		fields: [statsUsers.user_id],
		references: [users.id],
	}),
}))

// Cada entrada en stats_pois relaciona una estadística con un POI específico
export const statsPoisRelations = relations(statsPois, ({ one }) => ({
	stat: one(stats, {
		fields: [statsPois.stat_id],
		references: [stats.id],
	}),
	poi: one(pois, {
		fields: [statsPois.poi_id],
		references: [pois.id],
	}),
}))
