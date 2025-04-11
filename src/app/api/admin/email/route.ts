import { sendEmail } from "@/lib/services/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { type, email, name, subject, message, registrationCode } =
      await req.json();

    if (!email || !type) {
      return NextResponse.json(
        { success: false, message: "Email and type are required" },
        { status: 400 }
      );
    }

    let emailSubject = subject;
    let emailContent = message;

    // Pre-filled templates based on type
    if (type === "payment_reminder") {
      emailSubject =
        subject || "Reminder: Complete Your Payment for PharmAir Conference";
      emailContent =
        message ||
        `
        <p>Dear ${name},</p>
        <p>This is a friendly reminder that we haven't yet received your payment for the PharmAir Conference registration.</p>
        <p>Your registration code is: <strong>${registrationCode}</strong></p>
        <p>Please complete your payment at your earliest convenience to secure your spot.</p>
        <p>If you've already made the payment, please disregard this message.</p>
        <p>Thank you,<br>PharmAir Conference Team</p>
      `;
    }

    // Send the email
    await sendEmail({
      to: email,
      subject: emailSubject,
      html: emailContent,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email" },
      { status: 500 }
    );
  }
}
