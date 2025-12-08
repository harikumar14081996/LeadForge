import { z } from "zod";

// Regex patterns - Strict 10 digit phone, 9 digit SIN
const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const sinRegex = /^\d{3}[-. ]?\d{3}[-. ]?\d{3}$/;

export const leadFormSchema = z.object({
    // Step 0: Initial
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(phoneRegex, "Phone must be 10 digits"),

    // Step 1: Personal
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    sin: z.string().regex(sinRegex, "SIN must be exactly 9 digits"),
    consentGiven: z.boolean().refine(val => val === true, "You must consent to proceed"),
    connectedOwner: z.string().optional(), // "Yes" | "No"

    // Step 2: Address
    street: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    provinceState: z.string().min(2, "Province/State is required"),
    country: z.string().min(2, "Country is required"),
    postalZip: z.string().min(5, "Postal/Zip code is required"),

    // Geolocation (Optional but captured)
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    locationAccuracy: z.number().optional().nullable(),
    locationCapturedAt: z.string().optional().nullable(), // ISO string

    // Step 3: Employment
    employerName: z.string().min(2, "Employer name is required"),
    position: z.string().min(2, "Job title is required"),
    employmentStatus: z.enum(["FULL_TIME", "PART_TIME", "SELF_EMPLOYED", "UNEMPLOYED", "RETIRED"]),
    monthlySalary: z.coerce.number().min(0, "Must be positive"),
    paystubFrequency: z.enum(["WEEKLY", "BI_WEEKLY", "SEMI_MONTHLY", "MONTHLY"]),
    yearsEmployed: z.coerce.number().min(0, "Must be valid number"),
    employerPhone: z.string().regex(phoneRegex, "Invalid phone number"),
    employerAddress: z.object({
        street: z.string().min(1, "Required"),
        city: z.string().min(1, "Required"),
        provinceState: z.string().min(1, "Required"),
        postalZip: z.string().min(1, "Required"),
        country: z.string().min(1, "Required"),
    }),

    // Step 4: Vehicle
    ownsVehicle: z.boolean(),
    vehicleDetails: z.object({
        make: z.string().optional(),
        model: z.string().optional(),
        year: z.coerce.number().optional(),
        odometer: z.coerce.number().optional(),
        hasLien: z.boolean().optional(),
        lienBank: z.string().optional(),
        lienBalance: z.coerce.number().optional(),
    }).optional(),

    // Step 5: Home & Loan
    ownsHome: z.boolean(),
    homeDetails: z.object({
        isPaidOff: z.boolean().optional(),
        mortgageBalance: z.coerce.number().optional(),
        loanCompany: z.string().optional(),
    }).optional(),

    loanType: z.enum(["PERSONAL_LOAN", "DEBT_CONSOLIDATION", "HOME_EQUITY"]),
    amountRequested: z.coerce.number().min(1000, "Minimum request is $1,000"),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
