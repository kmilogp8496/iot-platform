ALTER TABLE "locations" ADD COLUMN "parent_location" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "locations" ADD CONSTRAINT "locations_parent_location_locations_id_fk" FOREIGN KEY ("parent_location") REFERENCES "locations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
