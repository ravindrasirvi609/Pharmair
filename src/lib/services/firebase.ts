import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { randomUUID } from "crypto";

// Initialize Firebase Admin if it hasn't been initialized yet
const apps = getApps();
const firebaseApp =
  apps.length === 0
    ? initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle the private key properly by trying different formats
          privateKey: process.env.FIREBASE_PRIVATE_KEY
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
            : undefined,
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      })
    : apps[0];

// Get Firebase services
export const storage = getStorage(firebaseApp);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Define allowed file types
const allowedMimeTypes = {
  "application/pdf": { ext: "pdf", folder: "documents" },
  "image/jpeg": { ext: "jpg", folder: "images" },
  "image/png": { ext: "png", folder: "images" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    ext: "pptx",
    folder: "presentations",
  },
  "application/vnd.ms-powerpoint": { ext: "ppt", folder: "presentations" },
  "application/msword": { ext: "doc", folder: "documents" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    ext: "docx",
    folder: "documents",
  },
};

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(
  file: Buffer,
  mimeType: string,
  customFolder?: string,
  filename?: string
): Promise<{ url: string; path: string }> {
  try {
    // Validate mime type
    const fileType =
      allowedMimeTypes[mimeType as keyof typeof allowedMimeTypes];
    if (!fileType) {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }

    // Generate filename if not provided
    const finalFilename = filename || `${randomUUID()}.${fileType.ext}`;

    // Determine the folder path
    const folder = customFolder || fileType.folder;
    const filePath = `${folder}/${finalFilename}`;

    // Get bucket reference
    const bucket = storage.bucket();
    const fileRef = bucket.file(filePath);

    // Upload file
    await fileRef.save(file, {
      metadata: {
        contentType: mimeType,
      },
    });

    // Make file publicly accessible
    await fileRef.makePublic();

    // Get download URL
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2500", // Far future expiration
    });

    return {
      url,
      path: filePath,
    };
  } catch (error) {
    console.error("Error uploading file to Firebase:", error);
    throw error;
  }
}

/**
 * Upload an abstract file to Firebase
 */
export async function uploadAbstractFile(
  file: Buffer,
  mimeType: string,
  abstractCode: string
) {
  return uploadFile(
    file,
    mimeType,
    "abstracts",
    `abstract-${abstractCode}.${mimeType === "application/pdf" ? "pdf" : "docx"}`
  );
}

/**
 * Upload a presentation file to Firebase
 */
export async function uploadPresentationFile(
  file: Buffer,
  mimeType: string,
  abstractCode: string
) {
  return uploadFile(
    file,
    mimeType,
    "presentations",
    `presentation-${abstractCode}.${mimeType.includes("presentation") ? "pptx" : "pdf"}`
  );
}

/**
 * Upload a profile image to Firebase
 */
export async function uploadProfileImage(
  file: Buffer,
  mimeType: string,
  userId: string
) {
  return uploadFile(
    file,
    mimeType,
    "profile-images",
    `profile-${userId}.${mimeType === "image/png" ? "png" : "jpg"}`
  );
}

/**
 * Generate a QR code URL for a given code
 */
export async function generateQrCodeUrl(code: string) {
  // Using Google Charts API for QR code generation (no Firebase needed)
  const encodedData = encodeURIComponent(code);
  return `https://chart.googleapis.com/chart?cht=qr&chl=${encodedData}&chs=250x250&chld=L|1`;
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(filePath: string) {
  try {
    const bucket = storage.bucket();
    const fileRef = bucket.file(filePath);
    await fileRef.delete();
    return true;
  } catch (error) {
    console.error("Error deleting file from Firebase:", error);
    throw error;
  }
}
