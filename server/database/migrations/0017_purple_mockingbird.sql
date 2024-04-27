DO $$ BEGIN
 CREATE TYPE "sign" AS ENUM('gte', 'lte', 'eq', 'neq', 'gt', 'lt');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notificationConfigurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"notification" integer NOT NULL,
	"sensor_configuration" integer NOT NULL,
	"sign" "sign" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "notificationConfigurations_notification_sensor_configuration_unique" UNIQUE("notification","sensor_configuration")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_by" integer NOT NULL,
	"name" text,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "sensorsConfigurations" ADD COLUMN "last_value" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notificationConfigurations" ADD CONSTRAINT "notificationConfigurations_notification_notifications_id_fk" FOREIGN KEY ("notification") REFERENCES "notifications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notificationConfigurations" ADD CONSTRAINT "notificationConfigurations_sensor_configuration_sensorsConfigurations_id_fk" FOREIGN KEY ("sensor_configuration") REFERENCES "sensorsConfigurations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
