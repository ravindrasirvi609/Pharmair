import { NextResponse } from "next/server";

import Registration from "../../../../../models/Registration"; // Assuming you have a Registration model
import { connectToDatabase } from "@/lib/db";

interface Params {
  params: {
    id: string;
  };
}

/**
 * Update registration by ID
 */
export async function PATCH(request: Request, { params }: Params) {
  try {
    // Check authentication

    const { id } = params;
    const updateData = await request.json();

    // Connect to database
    await connectToDatabase();

    // Find and update the registration
    const registration = await Registration.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    // If status is changed to confirmed, we might want to send a confirmation email
    if (updateData.registrationStatus === "Confirmed") {
      // Optional: Send confirmation email
      try {
        // Implementation would depend on your email sending setup
        console.log(`Confirmation status updated for registration ${id}`);
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Continue with the response even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update registration" },
      { status: 500 }
    );
  }
}

/**
 * Get registration by ID
 */
export async function GET(request: Request, { params }: Params) {
  try {
    // Check authentication

    const { id } = params;

    // Connect to database
    await connectToDatabase();

    // Find the registration
    const registration = await Registration.findById(id);

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Error fetching registration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch registration" },
      { status: 500 }
    );
  }
}

/**
 * Delete registration by ID
 */
export async function DELETE(request: Request, { params }: Params) {
  try {
    // Check authentication

    const { id } = params;

    // Connect to database
    await connectToDatabase();

    // Find and delete the registration
    const registration = await Registration.findByIdAndDelete(id);

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete registration" },
      { status: 500 }
    );
  }
}
