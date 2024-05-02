ALTER TABLE "sensorsConfigurations" ALTER COLUMN "numeric_last_value" SET DATA TYPE numeric(100, 0);--> statement-breakpoint
ALTER TABLE "sensorsConfigurations" DROP COLUMN IF EXISTS "last_value";