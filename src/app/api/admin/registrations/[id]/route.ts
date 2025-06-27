import { NextResponse } from "next/server";

import Registration from "../../../../../models/Registration"; // Assuming you have a Registration model
import { connectToDatabase } from "@/lib/db";

/**
 * Update registration by ID
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData = await request.json();
    await connectToDatabase();
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
    if (updateData.registrationStatus === "Confirmed") {
      try {
        console.log(`Confirmation status updated for registration ${id}`);
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
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
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
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
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
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
