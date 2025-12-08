-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'UNASSIGNED', 'ASSIGNED', 'ATTEMPTED_TO_CONTACT', 'CONNECTED', 'QUALIFIED', 'UNQUALIFIED', 'DECLINED', 'CLOSED_WON');

-- CreateEnum
CREATE TYPE "LoanType" AS ENUM ('PERSONAL_LOAN', 'DEBT_CONSOLIDATION', 'HOME_EQUITY');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('ASSIGNED', 'TRANSFERRED', 'CLAIMED', 'RELEASED');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('NOTE', 'CALL', 'EMAIL', 'MEETING', 'STATUS_CHANGE', 'OWNERSHIP_CHANGE', 'RESUBMISSION');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "avatar_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "current_owner_id" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "loan_type" "LoanType" NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "sin_full" TEXT NOT NULL,
    "consent_given" BOOLEAN NOT NULL,
    "consent_timestamp" TIMESTAMP(3) NOT NULL,
    "connected_owner" BOOLEAN NOT NULL DEFAULT false,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province_state" TEXT NOT NULL,
    "postal_zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "location_accuracy" INTEGER,
    "location_captured_at" TIMESTAMP(3),
    "employer_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "years_employed" DECIMAL(65,30) NOT NULL,
    "employer_phone" TEXT NOT NULL,
    "employer_address" JSONB NOT NULL,
    "owns_vehicle" BOOLEAN NOT NULL DEFAULT false,
    "vehicle_details" JSONB,
    "owns_home" BOOLEAN NOT NULL DEFAULT false,
    "home_details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_application_date" TIMESTAMP(3),
    "application_count" INTEGER NOT NULL DEFAULT 1,
    "is_resubmission" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnershipHistory" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "from_user_id" TEXT,
    "to_user_id" TEXT,
    "action_type" "ActionType" NOT NULL,
    "performed_by_user_id" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnershipHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "NoteType" NOT NULL DEFAULT 'NOTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_phone_idx" ON "Lead"("phone");

-- CreateIndex
CREATE INDEX "Lead_created_at_idx" ON "Lead"("created_at");

-- CreateIndex
CREATE INDEX "Lead_company_id_created_at_idx" ON "Lead"("company_id", "created_at");

-- CreateIndex
CREATE INDEX "Lead_company_id_status_idx" ON "Lead"("company_id", "status");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_current_owner_id_fkey" FOREIGN KEY ("current_owner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnershipHistory" ADD CONSTRAINT "OwnershipHistory_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnershipHistory" ADD CONSTRAINT "OwnershipHistory_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnershipHistory" ADD CONSTRAINT "OwnershipHistory_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnershipHistory" ADD CONSTRAINT "OwnershipHistory_performed_by_user_id_fkey" FOREIGN KEY ("performed_by_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
