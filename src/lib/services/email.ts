import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email template types
export type EmailTemplate =
  | "registration-confirmation"
  | "abstract-submission"
  | "payment-confirmation"
  | "abstract-accepted"
  | "abstract-rejected";

/**
 * Send an email using Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = "Pharmair Conference <noreply@pharmanecia.org>",
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error("Failed to send email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

/**
 * Send a registration confirmation email
 */
export async function sendRegistrationConfirmationEmail({
  to,
  name,
  registrationCode,
}: {
  to: string;
  name: string;
  registrationCode: string;
}) {
  const subject = "Registration Confirmation - Pharmair Conference";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0369a1; color: white; padding: 20px; text-align: center;">
        <h1>Pharmair Conference</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
        <h2>Registration Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for registering for the Pharmair Conference. Your registration has been received successfully.</p>
        <p>Your registration code is: <strong>${registrationCode}</strong></p>
        <p>Please keep this code for future reference. You'll need it to access the conference materials and for any inquiries.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Pharmair Conference Team</p>
      </div>
      <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} Pharmair Conference. All rights reserved.
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Send an abstract submission confirmation email
 */
export async function sendAbstractSubmissionEmail({
  to,
  name,
  abstractCode,
  abstractTitle,
}: {
  to: string;
  name: string;
  abstractCode: string;
  abstractTitle: string;
}) {
  const subject = "Abstract Submission Confirmation - Pharmair Conference";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0369a1; color: white; padding: 20px; text-align: center;">
        <h1>Pharmair Conference</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
        <h2>Abstract Submission Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for submitting your abstract to the Pharmair Conference. Your abstract has been received successfully and is under review.</p>
        <p>Abstract Title: <strong>${abstractTitle}</strong></p>
        <p>Abstract Code: <strong>${abstractCode}</strong></p>
        <p>You will be notified of the review outcome via email. Please keep this code for future reference.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Pharmair Conference Team</p>
      </div>
      <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} Pharmair Conference. All rights reserved.
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Send a payment confirmation email with receipt
 */
export async function sendPaymentConfirmationEmail({
  to,
  name,
  amount,
  transactionId,
  paymentDate,
  receiptUrl,
}: {
  to: string;
  name: string;
  amount: number;
  transactionId: string;
  paymentDate: Date;
  receiptUrl?: string;
}) {
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(paymentDate);

  const subject = "Payment Confirmation - Pharmair Conference";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0369a1; color: white; padding: 20px; text-align: center;">
        <h1>Pharmair Conference</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
        <h2>Payment Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your payment. We have received your payment of <strong>${formattedAmount}</strong> successfully.</p>
        <p>Transaction ID: <strong>${transactionId}</strong></p>
        <p>Payment Date: <strong>${formattedDate}</strong></p>
        ${receiptUrl ? `<p>You can download your receipt <a href="${receiptUrl}" target="_blank">here</a>.</p>` : ""}
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Pharmair Conference Team</p>
      </div>
      <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} Pharmair Conference. All rights reserved.
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Send an abstract review outcome email
 */
export async function sendAbstractReviewEmail({
  to,
  name,
  abstractTitle,
  abstractCode,
  status,
  comments,
}: {
  to: string;
  name: string;
  abstractTitle: string;
  abstractCode: string;
  status: "Accepted" | "Rejected";
  comments?: string;
}) {
  const isAccepted = status === "Accepted";
  const subject = `Abstract ${status} - Pharmair Conference`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0369a1; color: white; padding: 20px; text-align: center;">
        <h1>Pharmair Conference</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
        <h2>Abstract Review Outcome</h2>
        <p>Dear ${name},</p>
        <p>We have completed the review of your abstract submission:</p>
        <p>Abstract Title: <strong>${abstractTitle}</strong></p>
        <p>Abstract Code: <strong>${abstractCode}</strong></p>
        <p>We are pleased to inform you that your abstract has been <strong>${status}</strong> for presentation at the Pharmair Conference.</p>
        ${
          isAccepted
            ? `
          <p>Further instructions regarding your presentation will be sent to you shortly.</p>
        `
            : ""
        }
        ${
          comments
            ? `
          <div style="background-color: #f8fafc; padding: 15px; margin: 15px 0; border-left: 4px solid #0369a1;">
            <h3 style="margin-top: 0;">Reviewer Comments:</h3>
            <p>${comments}</p>
          </div>
        `
            : ""
        }
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Pharmair Conference Team</p>
      </div>
      <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} Pharmair Conference. All rights reserved.
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}
