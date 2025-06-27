"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Tooltip } from "react-tooltip";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Your Profile
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
          View and manage your abstract submissions and registration details
        </p>
        <Suspense
          fallback={<div className="text-center py-10">Loading profile...</div>}
        >
          <ProfileContent />
        </Suspense>
      </motion.div>
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
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Loading your profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-red-50 dark:bg-red-900/20 p-8 rounded-xl shadow-md border border-red-200 dark:border-red-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-red-100 dark:bg-red-800 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600 dark:text-red-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">
            Error
          </h2>
        </div>
        <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
        <div className="mt-6 flex justify-between">
          <Link
            href="/"
            className="inline-block bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md transition-colors"
          >
            Return to Home
          </Link>
          <button
            onClick={() => setError(null)}
            className="inline-block bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  // No data found
  if (!abstract && !registration) {
    return (
      <motion.div
        className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-xl shadow-md border border-yellow-200 dark:border-yellow-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-yellow-100 dark:bg-yellow-800 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-600 dark:text-yellow-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-yellow-700 dark:text-yellow-400">
            No information found
          </h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We couldn&apos;t find any information with the provided details. If
          you&apos;ve registered or submitted an abstract, please make sure
          you&apos;re using the correct email or code.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors shadow-md"
          >
            Return to Home
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Registration Details */}
      {registration && (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              Registration Details
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Name
              </p>
              <p className="text-lg font-medium">{registration.name}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Email
              </p>
              <p className="text-lg break-words">{registration.email}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Registration Code
              </p>
              <p className="text-lg font-medium text-blue-600 dark:text-blue-400 flex items-center">
                {registration.registrationCode || "Pending"}
                <button
                  className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      registration.registrationCode
                    );
                    alert("Registration code copied to clipboard!");
                  }}
                  data-tooltip-id="copy-tooltip"
                  data-tooltip-content="Copy to clipboard"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Registration Type
              </p>
              <p className="text-lg">{registration.registrationType}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Payment Status
              </p>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full inline-flex items-center ${
                  registration.paymentStatus === "Completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {registration.paymentStatus === "Completed" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {registration.paymentStatus === "Pending" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {registration.paymentStatus}
              </span>

              {registration.paymentStatus === "Pending" && (
                <div className="mt-3">
                  <Link
                    href="/payment"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    Complete Payment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Abstract Details */}
      {abstract && (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
              Abstract Details
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Title
              </p>
              <p className="text-lg font-medium">{abstract.title}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Author
              </p>
              <p className="text-lg">{abstract.name}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Abstract Code
              </p>
              <p className="text-lg font-medium text-purple-600 dark:text-purple-400 flex items-center">
                {abstract.abstractCode}
                <button
                  className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  onClick={() => {
                    navigator.clipboard.writeText(abstract.abstractCode);
                    alert("Abstract code copied to clipboard!");
                  }}
                  data-tooltip-id="copy-tooltip"
                  data-tooltip-content="Copy to clipboard"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Article Type
              </p>
              <p className="text-lg">{abstract.articleType}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Presentation Type
              </p>
              <p className="text-lg">{abstract.presentationType}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Status
              </p>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full inline-flex items-center ${
                  abstract.status === "Accepted"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : abstract.status === "Rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : abstract.status === "Revisions"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {abstract.status === "Accepted" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {abstract.status === "Rejected" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
                {abstract.status === "Revisions" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                )}
                {abstract.status === "InReview" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {abstract.status === "Revisions"
                  ? "Revisions Required"
                  : abstract.status}
              </span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Submitted On
              </p>
              <p className="text-lg">
                {new Date(abstract.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="md:col-span-2 mt-2">
              <a
                href={abstract.abstractFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                Reviewer Comments
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                {abstract.rejectionComment}
              </p>
            </motion.div>
          )}

          {/* QR Code */}
          {abstract.qrCodeUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex flex-col items-center"
            >
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                Abstract QR Code
              </h3>
              <div className="bg-white p-3 rounded-md shadow-md">
                <div className="relative">
                  <Image
                    src={abstract.qrCodeUrl}
                    alt="Abstract QR Code"
                    width={150}
                    height={150}
                    className="mx-auto"
                  />
                  <div className="absolute inset-0 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded">
                    <a
                      href={abstract.qrCodeUrl}
                      download={`abstract-qr-${abstract.abstractCode}.png`}
                      className="bg-white/80 dark:bg-black/80 p-2 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-800 dark:text-gray-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
                <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
                  Hover to download
                </p>
              </div>
            </motion.div>
          )}

          {/* Submit Revision Form */}
          {abstract.status === "Revisions" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 border border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50 dark:bg-purple-900/10"
            >
              <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Submit Revised Abstract
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Please upload your revised abstract based on the reviewer
                comments above.
              </p>

              <form onSubmit={handleSubmitRevision} className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Revised Abstract
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 
                    ${
                      selectedFile
                        ? "border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/10"
                        : "border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500"
                    } 
                    transition-colors text-center`}
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingRevision}
                    />
                    <div className="space-y-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      {selectedFile ? (
                        <>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Selected file:{" "}
                            <span className="font-medium">
                              {selectedFile.name}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Click to upload</span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PDF, DOC or DOCX (max. 10MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {uploadingRevision && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Uploading...
                      </span>
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md border border-green-200 dark:border-green-800 flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Your revised abstract has been submitted successfully and
                      is now under review.
                    </span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!selectedFile || uploadingRevision}
                  className={`w-full ${
                    !selectedFile || uploadingRevision
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {uploadingRevision
                    ? "Uploading..."
                    : "Submit Revised Abstract"}
                </Button>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Tooltips */}
      <Tooltip id="copy-tooltip" />
    </motion.div>
  );
}
