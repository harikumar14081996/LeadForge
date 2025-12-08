-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "default_admin_fee_percent" SET DEFAULT 21;

-- Backfill existing companies (if 0 or null, set to 21)
UPDATE "Company" SET "default_admin_fee_percent" = 21 WHERE "default_admin_fee_percent" = 0 OR "default_admin_fee_percent" IS NULL;
