import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().unique(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  content: varchar("content", { length: 280 }).notNull(),
  image_url: varchar("image_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id),
  userId: uuid("user_id").notNull(),
  content: varchar("content", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at").defaultNow(),
});

export const likes = pgTable("likes", {
  id: uuid("id").defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id),
  userId: uuid("user_id").notNull(),
});
