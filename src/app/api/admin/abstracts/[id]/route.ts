import { NextRequest, NextResponse } from "next/server";
import Abstract from "../../../../../models/Abstract";
import { sendAbstractReviewEmail } from "../../../../../lib/services/email";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, reviewComment } = await request.json();

    // Validate input
    if (
      !status ||
      !["Accepted", "Rejected", "Revisions", "InReview"].includes(status)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    // Find the abstract by ID
    const abstract = await Abstract.findById(id);
    if (!abstract) {
      return NextResponse.json(
        { success: false, message: "Abstract not found" },
        { status: 404 }
      );
    }

    // Update the abstract status and comment
    abstract.status = status;

    // Store the review comment in the appropriate field
    if (status === "Rejected") {
      abstract.rejectionComment = reviewComment || "";
    } else {
      // For other statuses, we'll store it in the same field for simplicity
      abstract.rejectionComment = reviewComment || "";
    }

    await abstract.save();

    // Send email notification
    try {
      await sendAbstractReviewEmail({
        to: abstract.email,
        name: abstract.name,
        abstractTitle: abstract.title,
        abstractCode: abstract.abstractCode,
        status: status === "Revisions" ? "Revisions Required" : status,
        comments: reviewComment || undefined,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Continue with the response even if email fails
    }

    return NextResponse.json({
      success: true,
      message: `Abstract status updated to ${status}`,
      data: {
        id: abstract._id,
        status: abstract.status,
        reviewComment: abstract.rejectionComment,
      },
    });
  } catch (error) {
    console.error("Error updating abstract status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update abstract status" },
      { status: 500 }
    );
  }
}
