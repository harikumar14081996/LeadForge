-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "admin_fee" DECIMAL(65,30),
ADD COLUMN     "discharge_amount" DECIMAL(65,30),
ADD COLUMN     "first_payment_date" TIMESTAMP(3),
ADD COLUMN     "funded_amount" DECIMAL(65,30),
ADD COLUMN     "loan_payment_frequency" "PaystubFrequency",
ADD COLUMN     "ppsr_fee" DECIMAL(65,30),
ADD COLUMN     "total_loan_amount" DECIMAL(65,30);
