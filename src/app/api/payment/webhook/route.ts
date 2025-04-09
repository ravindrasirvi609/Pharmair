import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import Transaction from "../../../../models/Transaction";
import Registration from "../../../../models/Registration";
import {
  verifyPaymentSignature,
  updateTransactionStatus,
  generateReceiptUrl,
} from "../../../../lib/services/razorpay";
import { sendPaymentConfirmationEmail } from "../../../../lib/services/email";

export async function POST(request: NextRequest) {
  try {
    // Get payment data from webhook
    const webhookData = await request.json();

    // Verify the webhook signature if provided
    const razorpaySignature =
      request.headers.get("x-razorpay-signature") || undefined;

    // Connect to database
    await connectToDatabase();

    // Extract payment details
    const { payload } = webhookData;

    if (!payload || !payload.payment || !payload.payment.entity) {
      return NextResponse.json(
        { success: false, message: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    const paymentEntity = payload.payment.entity;
    const { order_id: orderId, id: paymentId } = paymentEntity;

    if (!orderId || !paymentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing order_id or payment_id in webhook payload",
        },
        { status: 400 }
      );
    }

    // Find the transaction by Razorpay order ID
    const transaction = await Transaction.findOne({ razorpayOrderId: orderId });

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          message: "Transaction not found for the given order ID",
        },
        { status: 404 }
      );
    }

    // Get payment status
    const paymentStatus =
      paymentEntity.status === "captured" ? "Completed" : "Failed";

    // If the signature is provided, verify it
    if (razorpaySignature) {
      // Using underscore prefix to indicate that this variable is intentionally declared but not used directly
      // It's kept for code clarity and documentation purposes
      const _unused = JSON.stringify(webhookData);

      const isValid = verifyPaymentSignature({
        orderId,
        paymentId,
        signature: razorpaySignature,
      });

      if (!isValid) {
        console.error("Invalid Razorpay webhook signature");
        return NextResponse.json(
          { success: false, message: "Invalid signature" },
          { status: 400 }
        );
      }
    }

    // If payment is successful, generate receipt URL
    let receiptUrl;
    if (paymentStatus === "Completed") {
      receiptUrl = await generateReceiptUrl(transaction._id.toString());
    }

    // Update transaction status
    await updateTransactionStatus({
      transactionId: transaction._id.toString(),
      paymentStatus,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature,
      receiptUrl,
      razorpayResponse: paymentEntity,
    });

    // Find the registration to send email
    const registration = await Registration.findById(transaction.userId);

    // Send confirmation email if payment is completed
    if (paymentStatus === "Completed" && registration) {
      await sendPaymentConfirmationEmail({
        to: registration.email,
        name: registration.name,
        amount: transaction.amount,
        transactionId: paymentId,
        paymentDate: new Date(),
        receiptUrl,
      });
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Payment ${paymentStatus.toLowerCase()}`,
      data: {
        transactionId: transaction._id,
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        paymentStatus,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Payment webhook processing failed";
    console.error("Payment webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Special configuration for Razorpay webhook to disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};
