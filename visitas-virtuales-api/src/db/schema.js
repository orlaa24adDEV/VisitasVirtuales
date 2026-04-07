import {
	pgTable,
	integer,
	text,
	serial,
	timestamp,
	jsonb,
} from 'drizzle-orm/pg-core'

export const centers = pgTable('centers', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	location: text('location').notNull(),
})

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	password: text('password').notNull(),
	role: text('role').notNull(), // 'user' o 'admin'
	centerId: integer('center_id')
		.notNull()
		.references(() => centers.id, { onDelete: 'cascade' }),
})

export const pois = pgTable('pois', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	details: jsonb('details').notNull(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	centerId: integer('center_id')
		.notNull()
		.references(() => centers.id, { onDelete: 'cascade' }),
})

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
