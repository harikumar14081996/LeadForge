-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('FULL_TIME', 'PART_TIME', 'SELF_EMPLOYED', 'UNEMPLOYED', 'RETIRED');

-- CreateEnum
CREATE TYPE "PaystubFrequency" AS ENUM ('WEEKLY', 'BI_WEEKLY', 'SEMI_MONTHLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "amount_requested" DECIMAL(65,30),
ADD COLUMN     "employment_status" "EmploymentStatus" NOT NULL DEFAULT 'FULL_TIME',
ADD COLUMN     "monthly_salary" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "paystub_frequency" "PaystubFrequency" NOT NULL DEFAULT 'MONTHLY';
