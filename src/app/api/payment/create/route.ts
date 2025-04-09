import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import Registration from "../../../../models/Registration";
import Transaction from "../../../../models/Transaction";
import { createOrder } from "../../../../lib/services/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId, transactionId } = body;

    if (!registrationId && !transactionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Either registrationId or transactionId is required",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    let transaction;

    if (transactionId) {
      // If transactionId is provided, fetch the transaction directly
      transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        return NextResponse.json(
          { success: false, message: "Transaction not found" },
          { status: 404 }
        );
      }

      // Check if payment is already completed
      if (transaction.paymentStatus === "Completed") {
        return NextResponse.json(
          {
            success: false,
            message: "Payment has already been completed for this transaction",
          },
          { status: 400 }
        );
      }
    } else {
      // If registrationId is provided, fetch registration and related pending transaction
      const registration = await Registration.findById(registrationId);
      if (!registration) {
        return NextResponse.json(
          { success: false, message: "Registration not found" },
          { status: 404 }
        );
      }

      // Check if payment is already completed
      if (registration.paymentStatus === "Completed") {
        return NextResponse.json(
          {
            success: false,
            message: "Payment has already been completed for this registration",
          },
          { status: 400 }
        );
      }

      // Find pending transaction for this registration
      transaction = await Transaction.findOne({
        userId: registrationId,
        paymentStatus: "Pending",
      });

      if (!transaction) {
        return NextResponse.json(
          {
            success: false,
            message: "No pending transaction found for this registration",
          },
          { status: 404 }
        );
      }
    }

    // Create Razorpay order
    const order = await createOrder({
      amount: transaction.amount,
      receipt: transaction._id.toString(),
      notes: {
        transactionId: transaction._id.toString(),
        userId: transaction.userId.toString(),
        description: transaction.description,
      },
    });

    // Update transaction with order ID
    transaction.razorpayOrderId = order.id;
    await transaction.save();

    // Return order details to client
    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: (order.amount as number) / 100, // Convert back from paise to rupees for display
        currency: order.currency,
        transactionId: transaction._id,
        userId: transaction.userId,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create payment order";
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
