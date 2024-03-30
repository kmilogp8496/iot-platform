CREATE TABLE IF NOT EXISTS "actuatorConfigurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"sensor_configuration" serial NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "actuatorConfigurations_sensor_configuration_id_unique" UNIQUE("sensor_configuration","id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "actuatorConfigurations" ADD CONSTRAINT "actuatorConfigurations_sensor_configuration_sensorsConfigurations_id_fk" FOREIGN KEY ("sensor_configuration") REFERENCES "sensorsConfigurations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
