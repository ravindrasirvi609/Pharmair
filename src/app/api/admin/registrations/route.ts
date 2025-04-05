import { NextRequest, NextResponse } from "next/server";
import Registration from "../../../../models/Registration";

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    const registrations = await Registration.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(100); // Limit to 100 entries to avoid performance issues

    return NextResponse.json({ success: true, data: registrations });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
