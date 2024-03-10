CREATE TABLE IF NOT EXISTS "sensorsConfiguration" (
	"id" serial PRIMARY KEY NOT NULL,
	"sensor_id" serial NOT NULL,
	"variable_id" serial NOT NULL,
	"location_id" serial NOT NULL,
	"created_by" serial NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensorsConfiguration" ADD CONSTRAINT "sensorsConfiguration_sensor_id_sensors_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "sensors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensorsConfiguration" ADD CONSTRAINT "sensorsConfiguration_variable_id_variables_id_fk" FOREIGN KEY ("variable_id") REFERENCES "variables"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensorsConfiguration" ADD CONSTRAINT "sensorsConfiguration_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensorsConfiguration" ADD CONSTRAINT "sensorsConfiguration_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
