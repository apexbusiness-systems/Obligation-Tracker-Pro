import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  varchar
} from "drizzle-orm/pg-core";

export const idempotencyKeysTable = pgTable("idempotency_keys", {
  key: varchar("key", { length: 255 }).primaryKey(),
  userId: text("user_id").notNull(),
  requestMethod: varchar("request_method", { length: 10 }).notNull(),
  requestPath: text("request_path").notNull(),
  responseStatus: integer("response_status"),
  responseBody: jsonb("response_body"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
