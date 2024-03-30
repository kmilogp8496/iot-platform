ALTER TABLE "actuatorConfigurations" DROP CONSTRAINT "actuatorConfigurations_sensor_configuration_id_unique";--> statement-breakpoint
ALTER TABLE "actuatorConfigurations" ADD COLUMN "sensor" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "actuatorConfigurations" ADD CONSTRAINT "actuatorConfigurations_sensor_sensors_id_fk" FOREIGN KEY ("sensor") REFERENCES "sensors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "actuatorConfigurations" ADD CONSTRAINT "actuatorConfigurations_sensor_sensor_configuration_unique" UNIQUE("sensor","sensor_configuration");