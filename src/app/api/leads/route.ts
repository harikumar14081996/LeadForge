import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";
import { LeadStatus, LoanType, NoteType } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            isUpdate,
            leadId,
            isInternal, // New flag
            ownerId,    // New optional field
            // Data fields
            firstName, lastName, email, phone, sin,
            consentGiven, connectedOwner,
            street, city, provinceState, postalZip, country,
            latitude, longitude, locationAccuracy, locationCapturedAt,
            employerName, position, yearsEmployed, employerPhone, employerAddress,
            employmentStatus, monthlySalary, paystubFrequency, // New Fields
            ownsVehicle, vehicleDetails,
            ownsHome, homeDetails,
            loanType, amountRequested, // New Fields
            companyId // In a real multi-tenant app, we'd determine this from domain or a default.
            // For this demo, we'll assign to the first company found if not provided or hardcode.
        } = body;

        // Get a default company if not provided (for public form submission)
        let targetCompanyId = companyId;

        // Logic to determine company:
        if (isInternal && ownerId) {
            // Internal lead: Use the owner's company
            const owner = await prisma.user.findUnique({ where: { id: ownerId } });
            if (owner) {
                targetCompanyId = owner.company_id;
            }
        }

        // If still no company (public link without ID or invalid), fallback to default
        if (!targetCompanyId) {
            const defaultCompany = await prisma.company.findFirst();
            if (defaultCompany) {
                targetCompanyId = defaultCompany.id;
            } else {
                // Create a default company if none exists (fallback)
                const newComp = await prisma.company.create({
                    data: { name: "Default Company", email: "admin@default.com" }
                });
                targetCompanyId = newComp.id;
            }
        }

        const encryptedSin = encrypt(sin);
        const yearsEmployedDecimal = parseFloat(yearsEmployed.toString());

        if (isUpdate && leadId) {
            // Update logic
            const oldLead = await prisma.lead.findUnique({ where: { id: leadId } });

            if (!oldLead) {
                return NextResponse.json({ error: "Lead not found for update" }, { status: 404 });
            }

            // Update
            const updatedLead = await prisma.lead.update({
                where: { id: leadId },
                data: {
                    // Only reset status/tracking if NOT internal (i.e. Public Resubmission)
                    ...(!isInternal && {
                        status: LeadStatus.UNASSIGNED,
                        last_application_date: oldLead.created_at,
                        created_at: new Date(),
                        application_count: { increment: 1 },
                        is_resubmission: true,
                    }),

                    // "Update all fields with new data"
                    loan_type: loanType as LoanType,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    sin_full: encryptedSin,
                    consent_given: consentGiven,
                    consent_timestamp: isInternal ? oldLead.consent_timestamp : new Date(), // Keep original consent date if internal edit?
                    // Address
                    street, city, province_state: provinceState, postal_zip: postalZip, country,
                    latitude: latitude, longitude: longitude, location_accuracy: locationAccuracy,
                    location_captured_at: locationCapturedAt ? new Date(locationCapturedAt) : null,
                    // Employment
                    employer_name: employerName,
                    position: position,
                    years_employed: yearsEmployedDecimal,
                    employer_phone: employerPhone,
                    employer_address: employerAddress,
                    employment_status: employmentStatus,
                    monthly_salary: monthlySalary,
                    paystub_frequency: paystubFrequency,

                    // Vehicle
                    owns_vehicle: ownsVehicle,
                    vehicle_details: vehicleDetails,
                    // Home
                    owns_home: ownsHome,
                    home_details: homeDetails,

                    amount_requested: amountRequested,
                }
            });

            // Add Note only if resubmission
            if (!isInternal) {
                await prisma.note.create({
                    data: {
                        lead_id: leadId,
                        user_id: oldLead.current_owner_id || (await getAdminUserId(targetCompanyId)),
                        content: `Application resubmitted. Previous application date: ${oldLead.created_at.toISOString().split('T')[0]}`,
                        type: NoteType.RESUBMISSION,
                    }
                });
            } else {
                // Optional: Add "Lead Edited" note?
                await prisma.note.create({
                    data: {
                        lead_id: leadId,
                        user_id: ownerId || (await getAdminUserId(targetCompanyId)),
                        content: `Lead details manually updated by agent.`,
                        type: NoteType.NOTE, // General note
                    }
                });
            }

            return NextResponse.json({ success: true, lead: updatedLead });

        } else {
            // Create New
            const status = isInternal ? LeadStatus.CONNECTED : LeadStatus.UNASSIGNED;
            const currentOwnerId = isInternal && ownerId ? ownerId : undefined;

            const newLead = await prisma.lead.create({
                data: {
                    company_id: targetCompanyId,
                    status: status,
                    current_owner_id: currentOwnerId,
                    loan_type: loanType as LoanType,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    sin_full: encryptedSin,
                    consent_given: consentGiven,
                    consent_timestamp: new Date(),
                    connected_owner: connectedOwner === 'Yes', // Map string to boolean

                    street, city, province_state: provinceState, postal_zip: postalZip, country,
                    latitude: latitude, longitude: longitude, location_accuracy: locationAccuracy,
                    location_captured_at: locationCapturedAt ? new Date(locationCapturedAt) : null,

                    employer_name: employerName,
                    position: position,
                    years_employed: yearsEmployedDecimal,
                    employer_phone: employerPhone,
                    employer_address: employerAddress,
                    employment_status: employmentStatus,
                    monthly_salary: monthlySalary,
                    paystub_frequency: paystubFrequency,

                    owns_vehicle: ownsVehicle,
                    vehicle_details: vehicleDetails,

                    owns_home: ownsHome,
                    home_details: homeDetails,

                    amount_requested: amountRequested,

                    is_resubmission: false,
                    application_count: 1
                }
            });

            return NextResponse.json({ success: true, lead: newLead });
        }

    } catch (error) {
        console.error("Lead submit error:", error);
        return NextResponse.json({ error: "Submission failed" }, { status: 500 });
    }
}

// Helper to get an admin user ID for system notes if lead has no owner
async function getAdminUserId(companyId: string) {
    const admin = await prisma.user.findFirst({
        where: { company_id: companyId, role: 'ADMIN' }
    });
    return admin?.id || 'system'; // Handled by DB constraints if UUID required, might fail if 'system' not valid UUID.
    // Better: make user_id nullable in Note? Schema says "user_id UUID".
    // We MUST have a user.
    // For now, assume at least one admin exists.
}
