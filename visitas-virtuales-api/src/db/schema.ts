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
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'

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

//tabla de trazabilidad
export const poiHistory = pgTable('poi_history', {
	id: serial('id').primaryKey(),
	poiId: integer('poi_id')
		.notNull()
		.references(() => pois.id, {onDelete: 'cascade'}),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	action: text('action').notNull(),
	timestamp: timestamp('timestamp').notNull().defaultNow(),
	details: jsonb('details'),
})

/* Definir relaciones entre tablas para permitir a Drizzle simplificar 
   consultas con joins */

// Un centro tiene muchos usuarios y muchos POIs
export const centerRelations = relations(centers, ({ many }) => ({
	pois: many(pois),
}))

// Un usuario puede tener muchos POIs y estadísticas
export const userRelations = relations(users, ({ many }) => ({
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


/* Derivar tipos a partir de las tablas */
export type Center = typeof centers.$inferSelect
export type User = typeof users.$inferSelect
export type Poi = typeof pois.$inferSelect
export type Stat = typeof stats.$inferSelect

/* Exportar schemas para validación datos recibido en endpoints */
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{6,24}$/
const PASSWORD_PATTERN =
	/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,32}$/

export const userSelectSchema = createSelectSchema(users);
export type UserSelectType = z.infer<typeof userSelectSchema>;

export const userInsertSchema = createInsertSchema(users);
export type UserInsertType = z.infer<typeof userInsertSchema>;

export const userRegisterBaseSchema = createInsertSchema(users).pick({ email: true, username: true, password: true });

export const userRegisterSchema = userRegisterBaseSchema.safeExtend({
	email: z.email(),
	username: userRegisterBaseSchema.shape.username.refine(
		(username) => USERNAME_PATTERN.test(username),
		'El nombre de usuario debe tener entre 6 y 24 caracteres y solo puede contener letras, números y guiones bajos',
	),
	password: userRegisterBaseSchema.shape.password.refine(
		(password) => PASSWORD_PATTERN.test(password),
		'La contraseña debe tener entre 8 y 32 caracteres y contener al menos un símbolo, un número y una letra mayúscula',
	),
})

export type UserRegisterType = z.infer<typeof userRegisterSchema>;

const userLoginBaseSchema = createSelectSchema(users)
	.partial({ email: true, username: true })
	.omit({ id: true, role: true })
	.refine(
		(data) => data.email || data.username,
		'Se debe proporcionar al menos un email o un nombre de usuario para iniciar sesión',
	)

export const userLoginSchema = userLoginBaseSchema.safeExtend({
	email: z.email(),
	username: userLoginBaseSchema.shape.username.refine(
		(username) => !username || USERNAME_PATTERN.test(username),
		'Credenciales inválidas',
	),
	password: userInsertSchema.shape.password.refine(
		(password) => PASSWORD_PATTERN.test(password),
		'Credenciales inválidas',
	),
})
export type UserLoginType = z.infer<typeof userLoginSchema>;

export const TokenResponseSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
})
export type TokenResponseType = z.infer<typeof TokenResponseSchema>;

export const UserProfileSchema = createSelectSchema(users).omit({ password: true });
export type UserProfileType = z.infer<typeof UserProfileSchema>;

export const UserRoleEditSchema = z.object({
	userId: z.number().int().positive(),
	role: userRoles('role').notNull(),
})
export type UserRoleEditType = z.infer<typeof UserRoleEditSchema>;

export const poiSelectSchema = createSelectSchema(pois);
export type PoiSelectType = z.infer<typeof poiSelectSchema>;

export const poiInsertSchema = createInsertSchema(pois);
export type PoiInsertType = z.infer<typeof poiInsertSchema>;

export const poiCreateSchema = poiInsertSchema.omit({ id: true, userId: true, centerId: true });
export type PoiCreateType = z.infer<typeof poiCreateSchema>;

export const poiDeleteSchema = z.object({
	centerId: z.coerce.number().int().positive(),
	poiId: z.coerce.number().int().positive(),
})