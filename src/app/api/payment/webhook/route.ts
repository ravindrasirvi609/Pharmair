import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import Registration from "../../../../models/Registration";
import Abstract from "../../../../models/Abstract";
import Transaction from "../../../../models/Transaction";
import crypto from "crypto";
import { sendPaymentConfirmationEmail } from "../../../../lib/services/email";
import { generateQrCodeUrl } from "../../../../lib/services/firebase";

// Razorpay secret for webhook verification
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    // Get the signature from the headers
    const razorpaySignature = request.headers.get("x-razorpay-signature");

    // Get the raw body text
    const bodyText = await request.text();

    // Verify the webhook signature
    if (!verifyWebhookSignature(bodyText, razorpaySignature)) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    // Parse the body as JSON
    const body = JSON.parse(bodyText);

    // Handle the webhook event based on its type
    const { event, payload } = body;

    // Connect to database
    await connectToDatabase();

    // We're interested in payment.authorized events
    if (event === "payment.authorized" || event === "payment.captured") {
      // Extract payment details
      const { payment } = payload;
      const { entity } = payment;
      const { order_id, id: paymentId } = entity;

      // Find the transaction by Razorpay order ID
      const transaction = await Transaction.findOne({
        razorpayOrderId: order_id,
      });

      if (!transaction) {
        console.error("Transaction not found for order ID:", order_id);
        return NextResponse.json(
          { success: false, message: "Transaction not found" },
          { status: 404 }
        );
      }

      // Update the transaction with payment details
      transaction.paymentStatus = "Completed";
      transaction.paymentDate = new Date();
      transaction.razorpayPaymentId = paymentId;
      transaction.razorpayResponse = entity;
      await transaction.save();

      // Find the registration associated with this transaction
      const registration = await Registration.findById(transaction.userId);

      if (!registration) {
        console.error(
          "Registration not found for user ID:",
          transaction.userId
        );
        return NextResponse.json(
          { success: false, message: "Registration not found" },
          { status: 404 }
        );
      }

      // Mark the registration payment as complete
      registration.paymentStatus = "Completed";
      registration.paymentDate = new Date();
      registration.transactionId = transaction._id;

      // The pre-save hook will generate the registration code
      await registration.save();

      // Generate QR code for the registration
      const qrCodeUrl = await generateQrCodeUrl(registration.registrationCode);
      registration.qrCodeUrl = qrCodeUrl;
      await registration.save();

      // Find all abstracts associated with this registration's email
      // and update their status to reflect the completed registration
      const abstracts = await Abstract.find({ email: registration.email });

      if (abstracts && abstracts.length > 0) {
        for (const abstract of abstracts) {
          abstract.registration = registration._id;
          abstract.registrationCompleted = true;
          abstract.paymentCompleted = true;
          abstract.registrationStatus = "Confirmed";
          await abstract.save();
        }
      }

      // Send payment confirmation email
      await sendPaymentConfirmationEmail({
        to: registration.email,
        name: registration.name,
        amount: transaction.amount,
        transactionId:
          transaction.razorpayPaymentId || transaction._id.toString(),
        paymentDate: transaction.paymentDate,
      });

      // Return success response
      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
      });
    }

    // Return success for other webhook events
    return NextResponse.json({
      success: true,
      message: "Webhook received",
      event,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Payment webhook processing failed";
    console.error("Payment webhook error:", error);
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

// Function to verify Razorpay webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null
): boolean {
  if (!signature || !RAZORPAY_WEBHOOK_SECRET) return false;

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "hex"),
    Buffer.from(signature, "hex")
  );
}

// Special configuration for Razorpay webhook to disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};
