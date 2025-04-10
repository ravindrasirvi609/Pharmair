import { NextRequest, NextResponse } from "next/server";
import Abstract from "../../../../models/Abstract";
import { connectToDatabase } from "../../../../lib/db";
import { sendAbstractSubmissionEmail } from "../../../../lib/services/email";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status, abstractFileUrl } = await request.json();

    // Connect to the database
    await connectToDatabase();

    // Find the abstract by ID
    const abstract = await Abstract.findById(id);
    if (!abstract) {
      return NextResponse.json(
        { success: false, message: "Abstract not found" },
        { status: 404 }
      );
    }

    // Update abstract fields
    if (status) abstract.status = status;
    if (abstractFileUrl) abstract.abstractFileUrl = abstractFileUrl;

    // When users submit revisions, reset status to InReview
    if (abstract.status === "InReview" && abstractFileUrl) {
      // Clear any previous rejection comment if this is a resubmission
      abstract.rejectionComment = "";
    }

    await abstract.save();

    // Notify user about the update if it's a revision
    if (status === "InReview" && abstractFileUrl) {
      try {
        await sendAbstractSubmissionEmail({
          to: abstract.email,
          name: abstract.name,
          abstractCode: abstract.abstractCode,
          abstractTitle: abstract.title,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Continue with the response even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Abstract updated successfully",
      data: {
        id: abstract._id,
        status: abstract.status,
      },
    });
  } catch (error) {
    console.error("Error updating abstract:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update abstract" },
      { status: 500 }
    );
  }
}
