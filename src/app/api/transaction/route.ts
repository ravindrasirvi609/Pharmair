import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db";
import Transaction from "../../../models/Transaction";

// Define interface for transaction query
interface TransactionQuery {
  userId?: string;
  _id?: string;
  paymentStatus?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const transactionId = searchParams.get("id");
    const status = searchParams.get("status");

    if (!userId && !transactionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Either userId or transaction id is required",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Query based on provided parameters
    const query: TransactionQuery = {};

    if (userId) query.userId = userId;
    if (transactionId) query._id = transactionId;
    if (status) query.paymentStatus = status;

    // Single transaction lookup
    if (transactionId) {
      const transaction = await Transaction.findById(transactionId);

      if (!transaction) {
        return NextResponse.json(
          { success: false, message: "Transaction not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: transaction,
      });
    }

    // User's transactions (multiple)
    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { success: false, message: "No transactions found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch transactions";
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
