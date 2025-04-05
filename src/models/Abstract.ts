import { mongoose } from "../lib/db";
import { Schema } from "mongoose";

// Define abstract schema
const abstractSchema = new Schema(
  {
    // Identification Information
    email: { type: String, required: true },
    name: { type: String, required: true },
    coAuthors: [
      {
        name: { type: String },
        email: { type: String },
        affiliation: { type: String },
      },
    ],
    affiliation: { type: String, required: true },
    designation: { type: String, required: true },

    // Abstract Submission Information
    title: { type: String, required: true },
    subject: { type: String, required: true },
    articleType: {
      type: String,
      enum: ["Research Paper", "Review Article", "Case Study", "Poster"],
      required: true,
    },
    presentationType: {
      type: String,
      enum: ["Oral", "Poster", "Workshop"],
      required: true,
    },
    abstractFileUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["InReview", "Accepted", "Rejected", "Revisions"],
      default: "InReview",
    },

    // Review Information
    rejectionComment: { type: String },
    presentationFileUrl: { type: String },
    presentationFileStatus: {
      type: String,
      enum: ["NotSubmitted", "Submitted", "Accepted", "Rejected"],
      default: "NotSubmitted",
    },
    presentationRejectionComment: { type: String },

    // Linking Information
    temporaryAbstractCode: { type: String },
    abstractCode: { type: String, unique: true },
    qrCodeUrl: { type: String },
    registrationCompleted: { type: Boolean, default: false },

    // References
    registration: { type: Schema.Types.ObjectId, ref: "Registration" },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Create indexes for faster queries
abstractSchema.index({ email: 1, abstractCode: 1 });
abstractSchema.index({ status: 1 });

// Generate abstract code before saving if not already present
abstractSchema.pre("save", function (next) {
  if (!this.abstractCode) {
    // Generate abstract code: ABS-YEAR-RANDOM
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    this.abstractCode = `ABS-${year}-${random}`;
  }
  next();
});

// Create the model
const Abstract =
  mongoose.models.Abstract || mongoose.model("Abstract", abstractSchema);

export default Abstract;
