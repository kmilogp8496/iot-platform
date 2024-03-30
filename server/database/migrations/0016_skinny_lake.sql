ALTER TABLE "actuatorConfigurations" ADD COLUMN "created_by" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "actuatorConfigurations" ADD CONSTRAINT "actuatorConfigurations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
