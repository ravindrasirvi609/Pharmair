"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// Define proper types for abstract and registration
interface Abstract {
  title: string;
  abstractCode: string;
  subject: string;
  articleType: string;
  presentationType: string;
  registrationCompleted: boolean;
  registration?: string;
  qrCodeUrl?: string;
  email?: string;
  abstractFileUrl?: string;
}

// Loading component to use as fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50/50 dark:bg-slate-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Loading abstract details...
        </p>
      </div>
    </div>
  );
}

// Component that uses useSearchParams
function AbstractSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [abstract, setAbstract] = useState<Abstract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get abstract ID from URL query parameters
  const abstractId = searchParams.get("abstractId");

  useEffect(() => {
    const fetchData = async () => {
      if (!abstractId) {
        setError("Abstract ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch abstract details
        const abstractResponse = await axios.get(
          `/api/abstract?id=${abstractId}`
        );

        if (abstractResponse.data.success) {
          const abstractData = abstractResponse.data.data;
          setAbstract(abstractData);
        } else {
          setError(
            abstractResponse.data.message || "Failed to load abstract details"
          );
        }
      } catch (error: unknown) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Something went wrong. Please try again.";
        setError(errorMessage);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [abstractId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50/50 dark:bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Loading abstract details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50/50 dark:bg-slate-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 p-8 rounded-xl shadow-lg max-w-md w-full"
        >
          <div className="text-red-500 dark:text-red-400 text-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
            Error
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/abstract-submission")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-md shadow-lg hover:shadow-blue-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Abstract Submission
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-6 bg-primary-50/50 dark:bg-slate-900 min-h-screen">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 px-6 py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
              className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm text-white mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Abstract Submitted Successfully!
            </h2>
            <p className="text-white/90 mt-2 max-w-2xl mx-auto">
              Your abstract has been submitted for review. You&apos;ll be
              notified when it&apos;s evaluated.
            </p>
          </div>

          <div className="p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
                Abstract Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50 md:col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Title
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {abstract?.title}
                  </p>
                </div>

                <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Abstract Code
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {abstract?.abstractCode}
                  </p>
                </div>

                <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Subject Area
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {abstract?.subject}
                  </p>
                </div>

                <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Article Type
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {abstract?.articleType}
                  </p>
                </div>

                <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Presentation Type
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {abstract?.presentationType}
                  </p>
                </div>

                <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Abstract Status
                  </p>
                  <p className="font-medium">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      Under Review
                    </span>
                  </p>
                </div>

                <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Registration Status
                  </p>
                  <p className="font-medium">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        abstract?.registrationCompleted
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}
                    >
                      {abstract?.registrationCompleted ? "Complete" : "Pending"}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>

            {abstract?.qrCodeUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8 text-center"
              >
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
                  Your Abstract QR Code
                </h3>
                <div className="inline-block backdrop-blur-lg bg-white/40 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <div className="bg-white p-2 rounded-lg shadow-inner">
                    <Image
                      src={abstract.qrCodeUrl}
                      alt="Abstract QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    This QR code contains your abstract submission information
                  </p>
                </div>
              </motion.div>
            )}

            {!abstract?.registrationCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8 backdrop-blur-sm bg-yellow-50/70 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-900/30 rounded-lg p-4"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-500 dark:text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      Attention: Registration Required
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                      <p>
                        Please complete your conference registration to finalize
                        your abstract submission.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="-mx-2 -my-1.5 flex">
                        <Link
                          href={`/registration?email=${abstract?.email}`}
                          className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-amber-500/20 transition-all duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                          Complete Registration
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {abstract?.abstractFileUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-8 backdrop-blur-sm bg-blue-50/70 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-900/30 rounded-lg p-4"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-500 dark:text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
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
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      You can access your submitted abstract document here.
                    </p>
                    <p className="mt-3 text-sm md:mt-0 md:ml-6">
                      <a
                        href={abstract.abstractFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        View Abstract <span aria-hidden="true">&rarr;</span>
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 p-5 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50"
            >
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
                What&apos;s Next?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <span className="text-gray-700 dark:text-gray-300">
                    Check your email for the abstract submission confirmation.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <span className="text-gray-700 dark:text-gray-300">
                    Our scientific committee will review your abstract and
                    notify you of the results.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <span className="text-gray-700 dark:text-gray-300">
                    Save your abstract code{" "}
                    <span className="font-semibold">
                      {abstract?.abstractCode}
                    </span>{" "}
                    for future reference.
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Link
                href="/"
                className="inline-flex justify-center items-center px-4 py-2 rounded-lg backdrop-blur-md bg-white/20 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl hover:bg-white/30 dark:hover:bg-gray-800/40 transition-all duration-300 text-gray-700 dark:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Return to Home
              </Link>

              {!abstract?.registrationCompleted ? (
                <Link
                  href={`/registration?email=${abstract?.email}`}
                  className="inline-flex justify-center items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Complete Registration
                </Link>
              ) : (
                <Link
                  href="/abstract-submission"
                  className="inline-flex justify-center items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Submit Another Abstract
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AbstractSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AbstractSuccessContent />
    </Suspense>
  );
}
