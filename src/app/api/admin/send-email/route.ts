import { NextResponse } from "next/server";
import { sendEmail } from "../../../../lib/services/email";

export async function POST(request: Request) {
  try {
    // Get request data
    const { to, subject, message, registrationId, emailType } =
      await request.json();

    // Validate request data
    if (!to || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create HTML email content based on the template
    const html = generateEmailHtml(to, subject, message);

    // Use the Resend email service to send the email
    await sendEmail({
      to,
      subject,
      html,
      from: "Pharmair Conference <noreply@pharmanecia.org>",
    });

    // Log the email activity
    const emailActivity = {
      to,
      subject,
      emailType,
      registrationId,
      sentAt: new Date(),
    };

    console.log("Email activity logged:", emailActivity);

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}

/**
 * Generate HTML email content based on the email type
 */
function generateEmailHtml(
  to: string,
  subject: string,
  message: string
): string {
  // Base email template with variable content
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0369a1; color: white; padding: 20px; text-align: center;">
        <h1>Pharmair Conference</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
        <h2>${subject}</h2>
        ${message
          .split("\n")
          .map((line) => `<p>${line}</p>`)
          .join("")}
        <p>Best regards,<br>Pharmair Conference Team</p>
      </div>
      <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} Pharmair Conference. All rights reserved.
      </div>
    </div>
  `;
}
