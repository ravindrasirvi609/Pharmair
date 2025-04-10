import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db";
import Abstract from "../../../models/Abstract";
import Registration from "../../../models/Registration";
import { sendAbstractSubmissionEmail } from "../../../lib/services/email";
import { generateQrCodeUrl } from "../../../lib/services/firebase";

// Define a type for the supported form values
interface AbstractSubmissionData {
  email: string;
  name: string;
  affiliation: string;
  designation: string;
  title: string;
  subject: string;
  articleType: string;
  presentationType: string;
  abstractFileUrl: string;
  abstractFilePath?: string;
  coAuthors?: Array<{
    name: string;
    email: string;
    affiliation: string;
  }>;
  [key: string]: string | Array<Record<string, string>> | undefined;
}

export async function POST(request: NextRequest) {
  try {
    // Parse JSON data from request
    const data: AbstractSubmissionData = await request.json();

    // Validate required fields
    const requiredFields = [
      "email",
      "name",
      "affiliation",
      "designation",
      "title",
      "subject",
      "articleType",
      "presentationType",
      "abstractFileUrl",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Connect to database
    await connectToDatabase();

    // Create a new abstract
    const abstract = new Abstract({
      email: data.email,
      name: data.name,
      coAuthors: data.coAuthors || [],
      affiliation: data.affiliation,
      designation: data.designation,
      title: data.title,
      subject: data.subject,
      articleType: data.articleType,
      presentationType: data.presentationType,
      abstractFileUrl: data.abstractFileUrl, // Use the URL provided by the client
    });

    // Generate QR code
    const qrCodeUrl = await generateQrCodeUrl(abstract.abstractCode);
    abstract.qrCodeUrl = qrCodeUrl;

    // Check if user is already registered
    const registration = await Registration.findOne({ email: data.email });

    if (registration) {
      // Link abstract to registration
      abstract.registration = registration._id;

      // Set registration status based on the registration's payment status
      if (registration.paymentStatus === "Completed") {
        abstract.registrationCompleted = true;
        abstract.paymentCompleted = true;
        abstract.registrationStatus = "Confirmed";
      } else {
        abstract.registrationStatus = "Pending";
        abstract.registrationCompleted = false;
        abstract.paymentCompleted = false;
      }

      // Update the registration to indicate that user has submitted an abstract
      registration.hasSubmittedAbstract = true;
      registration.abstracts = [
        ...(registration.abstracts || []),
        abstract._id,
      ];
      await registration.save();
    } else {
      // No registration found - set status to not registered
      abstract.registrationStatus = "NotRegistered";
    }

    // Save the abstract after all updates
    await abstract.save();

    // Send confirmation email
    await sendAbstractSubmissionEmail({
      to: abstract.email,
      name: abstract.name,
      abstractCode: abstract.abstractCode,
      abstractTitle: abstract.title,
    });

    // Return success response with detailed status
    return NextResponse.json({
      success: true,
      message: "Abstract submission successful",
      data: {
        abstractId: abstract._id,
        abstractCode: abstract.abstractCode,
        title: abstract.title,
        email: abstract.email,
        registrationStatus: abstract.registrationStatus,
        registrationCompleted: abstract.registrationCompleted,
        paymentCompleted: abstract.paymentCompleted,
        registrationExists: !!registration,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Abstract submission failed";
    console.error("Abstract submission error:", error);
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch abstract details by ID, email, or code
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const abstractId = searchParams.get("id");
    const email = searchParams.get("email");
    const abstractCode = searchParams.get("code");
    const registrationStatus = searchParams.get("registrationStatus");
    const paymentStatus = searchParams.get("paymentStatus");

    if (
      !abstractId &&
      !email &&
      !abstractCode &&
      !registrationStatus &&
      !paymentStatus
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one search parameter is required",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Build query based on provided parameters
    interface AbstractQuery {
      _id?: string;
      abstractCode?: string;
      email?: string;
      registrationStatus?: string;
      paymentCompleted?: boolean;
    }

    const query: AbstractQuery = {};
    if (abstractId) query._id = abstractId;
    else if (abstractCode) query.abstractCode = abstractCode;
    else if (email) query.email = email;
    if (registrationStatus) query.registrationStatus = registrationStatus;
    if (paymentStatus) {
      if (paymentStatus === "true" || paymentStatus === "1") {
        query.paymentCompleted = true;
      } else if (paymentStatus === "false" || paymentStatus === "0") {
        query.paymentCompleted = false;
      }
    }

    // Handle multiple abstracts for email query or status filters
    if (
      (email && !abstractId && !abstractCode) ||
      registrationStatus ||
      paymentStatus
    ) {
      const abstracts = await Abstract.find(query)
        .populate("registration")
        .sort({ createdAt: -1 });

      if (!abstracts || abstracts.length === 0) {
        return NextResponse.json(
          { success: false, message: "No abstracts found matching criteria" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: abstracts,
        count: abstracts.length,
      });
    } else {
      // Single abstract lookup
      const abstract = await Abstract.findOne(query).populate("registration");

      if (!abstract) {
        return NextResponse.json(
          { success: false, message: "Abstract not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: abstract,
      });
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch abstract";
    console.error("Error fetching abstract:", error);
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
