import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db";
import Registration from "../../../models/Registration";
import { sendRegistrationConfirmationEmail } from "../../../lib/services/email";
import { generateQrCodeUrl } from "../../../lib/services/firebase";
import {
  createTransactionRecord,
  REGISTRATION_FEES,
} from "../../../lib/services/razorpay";

// Define interface for query parameters
interface RegistrationQuery {
  _id?: string;
  email?: string;
  registrationCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "whatsappNumber",
      "gender",
      "dob",
      "salutation",
      "affiliation",
      "designation",
      "institute",
      "address",
      "city",
      "state",
      "pincode",
      "country",
      "registrationType",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await Registration.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // Create new registration
    const registration = new Registration({
      // Personal Information
      name: body.name,
      email: body.email,
      whatsappNumber: body.whatsappNumber,
      gender: body.gender,
      dob: new Date(body.dob),
      salutation: body.salutation,
      aadharNumber: body.aadharNumber,

      // Professional Information
      affiliation: body.affiliation,
      designation: body.designation,
      institute: body.institute,

      // Address Information
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      country: body.country,

      // Conference Specific Information
      registrationType: body.registrationType,
      needAccommodation: body.needAccommodation || false,
      memberId: body.memberId,
    });

    // Save the registration and get the document with the generated registration code
    await registration.save();

    // Generate QR code
    const qrCodeUrl = await generateQrCodeUrl(registration.registrationCode);
    registration.qrCodeUrl = qrCodeUrl;
    await registration.save();

    // Create transaction record for payment if fees applicable
    const registrationFee =
      REGISTRATION_FEES[
        registration.registrationType as keyof typeof REGISTRATION_FEES
      ] || 0;

    if (registrationFee > 0) {
      // Create transaction record
      await createTransactionRecord({
        userId: registration._id.toString(),
        amount: registrationFee,
        description: `Registration Fee for ${registration.registrationType} - ${registration.name}`,
        metadata: {
          registrationType: registration.registrationType,
          registrationCode: registration.registrationCode,
        },
      });
    } else {
      // If no fees, mark as already paid
      registration.paymentStatus = "Completed";
      await registration.save();
    }

    // Send confirmation email
    await sendRegistrationConfirmationEmail({
      to: registration.email,
      name: registration.name,
      registrationCode: registration.registrationCode,
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Registration successful",
      data: {
        registrationId: registration._id,
        registrationCode: registration.registrationCode,
        name: registration.name,
        email: registration.email,
        registrationType: registration.registrationType,
        paymentStatus: registration.paymentStatus,
        paymentRequired: registrationFee > 0,
        paymentAmount: registrationFee,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Registration failed";
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch registration details by ID or email
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const registrationId = searchParams.get("id");
    const email = searchParams.get("email");
    const registrationCode = searchParams.get("code");

    if (!registrationId && !email && !registrationCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Either id, email, or code parameter is required",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Build query based on provided parameters
    const query: RegistrationQuery = {};
    if (registrationId) query._id = registrationId;
    else if (email) query.email = email;
    else if (registrationCode) query.registrationCode = registrationCode;

    // Find registration
    const registration = await Registration.findOne(query);

    if (!registration) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 }
      );
    }

    // Return registration details
    return NextResponse.json({
      success: true,
      data: registration,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch registration";
    console.error("Error fetching registration:", error);
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
