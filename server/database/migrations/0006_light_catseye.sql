CREATE TABLE IF NOT EXISTS "sensorsToVariables" (
	"sensor_id" serial NOT NULL,
	"variable_id" serial NOT NULL,
	CONSTRAINT "pk_sensorsToVariables" PRIMARY KEY("sensor_id","variable_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensorsToVariables" ADD CONSTRAINT "sensorsToVariables_sensor_id_sensors_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "sensors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensorsToVariables" ADD CONSTRAINT "sensorsToVariables_variable_id_variables_id_fk" FOREIGN KEY ("variable_id") REFERENCES "variables"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
