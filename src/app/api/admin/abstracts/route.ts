import { NextRequest, NextResponse } from "next/server";
import Abstract from "../../../../models/Abstract";

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    const abstracts = await Abstract.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(100); // Limit to 100 entries to avoid performance issues

    return NextResponse.json({ success: true, data: abstracts });
  } catch (error) {
    console.error("Error fetching abstracts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch abstracts" },
      { status: 500 }
    );
  }
}
