ALTER TABLE "variables" ADD COLUMN "project" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variables" ADD CONSTRAINT "variables_project_projects_id_fk" FOREIGN KEY ("project") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
