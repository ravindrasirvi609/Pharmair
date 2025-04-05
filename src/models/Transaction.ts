import { mongoose } from "../lib/db";
import { Schema } from "mongoose";

// Define transaction schema
const transactionSchema = new Schema(
  {
    // User reference
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },

    // Abstract reference (if applicable)
    abstractId: {
      type: Schema.Types.ObjectId,
      ref: "Abstract",
    },

    // Payment details
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    transactionId: { type: String },
    paymentDate: { type: Date },

    // Payment provider details
    paymentProvider: {
      type: String,
      default: "Razorpay",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    // Complete provider response
    razorpayResponse: {
      type: Schema.Types.Mixed,
    },

    // Receipt information
    receiptUrl: { type: String },

    // Description of the transaction
    description: { type: String },

    // Additional metadata
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Create indexes for efficient lookups
transactionSchema.index({ userId: 1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ razorpayOrderId: 1 });
transactionSchema.index({ paymentStatus: 1 });

// Create the model
const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
