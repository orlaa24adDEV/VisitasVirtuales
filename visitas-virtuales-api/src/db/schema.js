import { pgTable, integer, text, serial } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(), // 'user' o 'admin'
})

export const centers = pgTable('centers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
})

export const pois = pgTable('pois', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  centerId: integer('center_id')
    .notNull()
    .references(() => centers.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
})
