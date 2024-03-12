ALTER TABLE "sensorsConfiguration" RENAME TO "sensorsConfigurations";--> statement-breakpoint
ALTER TABLE "sensorsConfigurations" DROP CONSTRAINT "sensorsConfiguration_sensor_id_sensors_id_fk";
--> statement-breakpoint
ALTER TABLE "sensorsConfigurations" DROP CONSTRAINT "sensorsConfiguration_variable_id_variables_id_fk";
--> statement-breakpoint
ALTER TABLE "sensorsConfigurations" DROP CONSTRAINT "sensorsConfiguration_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "sensorsConfigurations" DROP CONSTRAINT "sensorsConfiguration_created_by_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensorsConfigurations" ADD CONSTRAINT "sensorsConfigurations_sensor_id_sensors_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "sensors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensorsConfigurations" ADD CONSTRAINT "sensorsConfigurations_variable_id_variables_id_fk" FOREIGN KEY ("variable_id") REFERENCES "variables"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensorsConfigurations" ADD CONSTRAINT "sensorsConfigurations_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensorsConfigurations" ADD CONSTRAINT "sensorsConfigurations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
