/*
  Warnings:

  - The values [NEW,ASSIGNED,CLOSED_WON] on the enum `LeadStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LeadStatus_new" AS ENUM ('UNASSIGNED', 'ATTEMPTED_TO_CONTACT', 'CONNECTED', 'QUALIFIED', 'UNQUALIFIED', 'DECLINED', 'FUNDED');
ALTER TABLE "Lead" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus_new" USING ("status"::text::"LeadStatus_new");
ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
ALTER TYPE "LeadStatus_new" RENAME TO "LeadStatus";
DROP TYPE "LeadStatus_old";
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'UNASSIGNED';
COMMIT;

-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'UNASSIGNED';
