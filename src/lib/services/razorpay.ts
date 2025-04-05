import Razorpay from "razorpay";
import crypto from "crypto";
import Transaction from "../../models/Transaction";
import Registration from "../../models/Registration";
import { connectToDatabase } from "../db";

// Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Define registration fee structure (in INR)
export const REGISTRATION_FEES = {
  Student: 2500,
  Academic: 4000,
  Industry: 6000,
  Speaker: 0, // Free for speakers
  Guest: 0, // Free for special guests
};

// Fee types
export type FeeType = "registration" | "abstract" | "accommodation";

/**
 * Create a Razorpay order
 */
export async function createOrder({
  amount,
  receipt,
  notes,
  currency = "INR",
}: {
  amount: number;
  receipt: string;
  notes?: Record<string, string>;
  currency?: string;
}) {
  try {
    // Amount needs to be in paise (multiply by 100)
    const amountInPaise = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt,
      notes,
      payment_capture: 1, // Auto capture payment
    });

    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Error verifying payment signature:", error);
    return false;
  }
}

/**
 * Create a transaction record in the database
 */
export async function createTransactionRecord({
  userId,
  amount,
  description,
  abstractId,
  metadata,
}: {
  userId: string;
  amount: number;
  description: string;
  abstractId?: string;
  metadata?: Record<string, any>;
}) {
  await connectToDatabase();

  try {
    const transaction = new Transaction({
      userId,
      amount,
      description,
      ...(abstractId && { abstractId }),
      ...(metadata && { metadata }),
      paymentStatus: "Pending",
    });

    await transaction.save();
    return transaction;
  } catch (error) {
    console.error("Error creating transaction record:", error);
    throw error;
  }
}

/**
 * Update transaction status after payment completion
 */
export async function updateTransactionStatus({
  transactionId,
  paymentStatus,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  receiptUrl,
  razorpayResponse,
}: {
  transactionId: string;
  paymentStatus: "Completed" | "Failed";
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  receiptUrl?: string;
  razorpayResponse?: any;
}) {
  await connectToDatabase();

  try {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`);
    }

    // Update transaction details
    transaction.paymentStatus = paymentStatus;
    transaction.razorpayOrderId = razorpayOrderId;
    transaction.razorpayPaymentId = razorpayPaymentId;
    if (razorpaySignature) transaction.razorpaySignature = razorpaySignature;
    if (receiptUrl) transaction.receiptUrl = receiptUrl;
    if (razorpayResponse) transaction.razorpayResponse = razorpayResponse;

    if (paymentStatus === "Completed") {
      transaction.paymentDate = new Date();
    }

    await transaction.save();

    // If payment completed successfully, update registration payment status
    if (paymentStatus === "Completed") {
      await Registration.findByIdAndUpdate(
        transaction.userId,
        {
          paymentStatus: "Completed",
          paymentDate: new Date(),
          paymentAmount: transaction.amount,
          transactionId: transaction._id,
          ...(receiptUrl && { feesReceiptUrl: receiptUrl }),
        },
        { new: true }
      );
    }

    return transaction;
  } catch (error) {
    console.error("Error updating transaction status:", error);
    throw error;
  }
}

/**
 * Get payment details from Razorpay
 */
export async function getPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw error;
  }
}

/**
 * Generate a receipt for a payment
 */
export async function generateReceiptUrl(
  transactionId: string
): Promise<string> {
  // This would typically integrate with a PDF generation service
  // For now, we'll just return a mock URL
  return `${process.env.NEXT_PUBLIC_API_URL}/api/receipts/${transactionId}`;
}
