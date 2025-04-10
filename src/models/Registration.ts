import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db";

// Ensure database connection
connectToDatabase();

// Define registration schema
const registrationSchema = new mongoose.Schema(
  {
    // Personal Information
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    whatsappNumber: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date, required: true },
    salutation: {
      type: String,
      enum: ["Dr", "Prof", "Mr", "Mrs", "Ms"],
      required: true,
    },
    aadharNumber: { type: String, required: false },

    // Professional Information
    affiliation: { type: String, required: true },
    designation: { type: String, required: true },
    institute: { type: String, required: true },

    // Address Information
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true, default: "India" },

    // Conference Specific Information
    registrationType: {
      type: String,
      enum: ["Student", "Academic", "Industry", "Speaker", "Guest"],
      required: true,
    },
    registrationStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    registrationCode: { type: String, unique: true, sparse: true },
    needAccommodation: { type: Boolean, default: false },
    memberId: { type: String },
    qrCodeUrl: { type: String },

    // Payment Information
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentAmount: { type: Number },
    paymentDate: { type: Date },
    transactionId: { type: String },
    feesReceiptUrl: { type: String },

    // Meta Information
    groupCode: { type: String },
    profileImageUrl: { type: String },

    // Reference to abstract submissions
    abstracts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Abstract" }],
    hasSubmittedAbstract: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Create a compound index for efficient lookups
registrationSchema.index({ email: 1, registrationCode: 1 });

// Generate a unique registration code only after payment is completed
registrationSchema.pre("save", async function (next) {
  // Only generate registration code if payment is completed and code doesn't exist yet
  if (this.paymentStatus === "Completed" && !this.registrationCode) {
    // Generate registration code: PHAR-YEAR-RANDOM
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    this.registrationCode = `PHAR-${year}-${random}`;

    // Also update registration status to Confirmed
    this.registrationStatus = "Confirmed";
  }
  next();
});

// Create the model
const Registration =
  mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);

export default Registration;
