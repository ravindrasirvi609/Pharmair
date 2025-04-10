"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

// Define types
interface Abstract {
  _id: string;
  name: string;
  email: string;
  title: string;
  subject: string;
  articleType: string;
  presentationType: string;
  status: string;
  abstractCode: string;
  rejectionComment?: string;
  createdAt: string;
  abstractFileUrl?: string;
  qrCodeUrl?: string;
  registrationCompleted: boolean;
  paymentCompleted: boolean;
  registrationStatus: string;
}

interface Registration {
  _id: string;
  name: string;
  email: string;
  registrationCode: string;
  registrationType: string;
  paymentStatus: string;
  registrationStatus: string;
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Your Profile
        </h1>
        <ProfileContent />
      </div>
    </div>
  );
}

function ProfileContent() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abstract, setAbstract] = useState<Abstract | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [uploadingRevision, setUploadingRevision] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Get abstract code or email from URL parameters
  const abstractCode = searchParams.get("abstractCode");
  const email = searchParams.get("email");
  const registrationCode = searchParams.get("regCode");

  useEffect(() => {
    const fetchData = async () => {
      if (!abstractCode && !email && !registrationCode) {
        setError(
          "Please provide an abstract code, email, or registration code to view your profile"
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Try to fetch abstract if code is provided
        if (abstractCode) {
          const abstractResponse = await axios.get(
            `/api/abstract?code=${abstractCode}`
          );
          if (abstractResponse.data.success) {
            setAbstract(abstractResponse.data.data);

            // If abstract has a linked registration, fetch that too
            if (abstractResponse.data.data.registration) {
              try {
                const regResponse = await axios.get(
                  `/api/register?id=${abstractResponse.data.data.registration}`
                );
                if (regResponse.data.success) {
                  setRegistration(regResponse.data.data);
                }
              } catch (error) {
                console.error("Error fetching registration:", error);
              }
            }
          }
        }
        // Try to fetch by email
        else if (email) {
          const abstractResponse = await axios.get(
            `/api/abstract?email=${email}`
          );
          if (abstractResponse.data.success) {
            // If multiple abstracts, just use the first one for now
            setAbstract(
              Array.isArray(abstractResponse.data.data)
                ? abstractResponse.data.data[0]
                : abstractResponse.data.data
            );

            // Try to fetch registration with the same email
            try {
              const regResponse = await axios.get(
                `/api/register?email=${email}`
              );
              if (regResponse.data.success) {
                setRegistration(regResponse.data.data);
              }
            } catch (error) {
              console.error("Error fetching registration:", error);
            }
          }
        }
        // Try to fetch by registration code
        else if (registrationCode) {
          const regResponse = await axios.get(
            `/api/register?code=${registrationCode}`
          );
          if (regResponse.data.success) {
            setRegistration(regResponse.data.data);

            // If registration has abstracts, fetch the first one
            if (
              regResponse.data.data.abstracts &&
              regResponse.data.data.abstracts.length > 0
            ) {
              try {
                const abstractResponse = await axios.get(
                  `/api/abstract?id=${regResponse.data.data.abstracts[0]}`
                );
                if (abstractResponse.data.success) {
                  setAbstract(abstractResponse.data.data);
                }
              } catch (error) {
                console.error("Error fetching abstract:", error);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load your profile information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [abstractCode, email, registrationCode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleSubmitRevision = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile || !abstract) {
      setError("Please select a file to upload");
      return;
    }

    setUploadingRevision(true);
    setUploadProgress(0);

    try {
      // This would be replaced with the actual file upload logic
      // similar to what's in AbstractSubmissionForm
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("abstractId", abstract._id);

      // Simulate a file upload with progress
      const simulateUpload = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            // Once upload is complete, update the abstract status
            updateAbstractStatus();
          }
        }, 300);
      };

      simulateUpload();
    } catch (error) {
      console.error("Error uploading revision:", error);
      setError("Failed to upload revision. Please try again.");
      setUploadingRevision(false);
    }
  };

  const updateAbstractStatus = async () => {
    try {
      if (!abstract) return;

      // Call API to update the abstract status back to "InReview"
      await axios.patch(`/api/abstract/${abstract._id}`, {
        status: "InReview",
        // The URL would actually come from the upload response
        abstractFileUrl: `${abstract.abstractFileUrl}?v=${Date.now()}`,
      });

      setUploadSuccess(true);
      setUploadingRevision(false);

      // Update the local abstract state
      setAbstract((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: "InReview",
        };
      });

      // Wait 3 seconds then hide the success message
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating abstract status:", error);
      setError("Failed to update abstract status. Please try again.");
      setUploadingRevision(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-4">
          Error
        </h2>
        <p className="text-red-600 dark:text-red-300">{error}</p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // No data found
  if (!abstract && !registration) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-yellow-700 dark:text-yellow-400 mb-4">
          No information found
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          We couldn&apos;t find any information with the provided details. If
          you&apos;ve registered or submitted an abstract, please make sure
          you&apos;re using the correct email or code.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Registration Details */}
      {registration && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
            Registration Details
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="text-lg font-medium">{registration.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-lg">{registration.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Registration Code
              </p>
              <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                {registration.registrationCode || "Pending"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Registration Type
              </p>
              <p className="text-lg">{registration.registrationType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Payment Status
              </p>
              <span
                className={`px-2 py-1 text-sm font-semibold rounded-full ${
                  registration.paymentStatus === "Completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {registration.paymentStatus}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Abstract Details */}
      {abstract && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
            Abstract Details
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
              <p className="text-lg font-medium">{abstract.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Author</p>
              <p className="text-lg">{abstract.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Abstract Code
              </p>
              <p className="text-lg font-medium text-purple-600 dark:text-purple-400">
                {abstract.abstractCode}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Article Type
              </p>
              <p className="text-lg">{abstract.articleType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Presentation Type
              </p>
              <p className="text-lg">{abstract.presentationType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <span
                className={`px-2 py-1 text-sm font-semibold rounded-full ${
                  abstract.status === "Accepted"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : abstract.status === "Rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : abstract.status === "Revisions"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {abstract.status === "Revisions"
                  ? "Revisions Required"
                  : abstract.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Submitted On
              </p>
              <p className="text-lg">
                {new Date(abstract.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="md:col-span-2">
              <a
                href={abstract.abstractFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                View Abstract Document
              </a>
            </div>
          </div>

          {/* Reviewer Comments */}
          {abstract.rejectionComment && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Reviewer Comments</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {abstract.rejectionComment}
              </p>
            </div>
          )}

          {/* QR Code */}
          {abstract.qrCodeUrl && (
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold mb-3">Abstract QR Code</h3>
              <div className="inline-block bg-white p-2 rounded-md">
                <Image
                  src={abstract.qrCodeUrl}
                  alt="Abstract QR Code"
                  width={150}
                  height={150}
                  className="mx-auto"
                />
              </div>
            </div>
          )}

          {/* Submit Revision Form */}
          {abstract.status === "Revisions" && (
            <div className="mt-8 p-4 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-3">
                Submit Revised Abstract
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Please upload your revised abstract based on the reviewer
                comments.
              </p>

              <form onSubmit={handleSubmitRevision}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload Revised Abstract
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                    disabled={uploadingRevision}
                  />
                </div>

                {uploadingRevision && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Uploading: {uploadProgress}%
                    </p>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md">
                    Your revised abstract has been submitted successfully and is
                    now under review.
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!selectedFile || uploadingRevision}
                  className={`w-full ${
                    !selectedFile || uploadingRevision
                      ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {uploadingRevision
                    ? "Uploading..."
                    : "Submit Revised Abstract"}
                </Button>
              </form>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
