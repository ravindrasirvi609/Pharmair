import { sendEmail } from "./email";

/**
 * Send a payment reminder email to a registrant
 */
export async function sendPaymentReminderEmail({
  to,
  name,
  registrationCode,
  dueDate,
  amount,
  paymentUrl,
}: {
  to: string;
  name: string;
  registrationCode: string;
  dueDate?: Date;
  amount?: number;
  paymentUrl?: string;
}) {
  const subject = "Payment Reminder - Pharmair Conference";

  const formattedAmount = amount
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)
    : "[Amount Due]";

  const formattedDate = dueDate
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(dueDate)
    : "as soon as possible";

  const defaultPaymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://pharmanecia.org"}/payment?code=${registrationCode}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0369a1; color: white; padding: 20px; text-align: center;">
        <h1>Pharmair Conference</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
        <h2>Payment Reminder</h2>
        <p>Dear ${name},</p>
        <p>This is a friendly reminder that we have not yet received the payment for your registration to the Pharmair Conference.</p>
        <p>Registration Code: <strong>${registrationCode}</strong></p>
        <p>Amount Due: <strong>${formattedAmount}</strong></p>
        <p>Please complete your payment by <strong>${formattedDate}</strong> to confirm your registration.</p>
        <div style="margin: 25px 0; text-align: center;">
          <a href="${paymentUrl || defaultPaymentUrl}" style="background-color: #0369a1; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Complete Payment</a>
        </div>
        <p>If you have already made the payment, please disregard this message.</p>
        <p>If you are experiencing any issues with the payment process or have any questions, please don't hesitate to contact us.</p>
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
 * Send a custom payment reminder with specific message
 */
export async function sendCustomPaymentReminder({
  to,
  subject,
  message,
  registrationCode,
  paymentUrl,
}: {
  to: string;
  name: string;
  subject: string;
  message: string;
  registrationCode: string;
  paymentUrl?: string;
}) {
  const defaultPaymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://pharmanecia.org"}/payment?code=${registrationCode}`;

  // Convert line breaks to HTML paragraphs
  const formattedMessage = message
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0369a1; color: white; padding: 20px; text-align: center;">
        <h1>Pharmair Conference</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
        <h2>${subject}</h2>
        ${formattedMessage}
        <div style="margin: 25px 0; text-align: center;">
          <a href="${paymentUrl || defaultPaymentUrl}" style="background-color: #0369a1; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Complete Payment</a>
        </div>
        <p>Best regards,<br>Pharmair Conference Team</p>
      </div>
      <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
        &copy; ${new Date().getFullYear()} Pharmair Conference. All rights reserved.
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}
