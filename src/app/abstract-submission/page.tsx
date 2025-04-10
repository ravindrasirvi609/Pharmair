"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AbstractSubmissionForm from "@/components/forms/AbstractSubmissionForm";
import Link from "next/link";
import { motion } from "framer-motion";

// Loading component to use as fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50/50 dark:bg-slate-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Loading abstract submission form...
        </p>
      </div>
    </div>
  );
}

// Component that uses useSearchParams
function AbstractSubmissionContent() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("registrationId");
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 bg-primary-50/50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Abstract Submission
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Submit your research abstract for the Pharmair Conference. Accepted
            abstracts will be included in the conference proceedings and
            considered for oral or poster presentation.
          </p>
        </motion.div>

        {registrationId && (
          <motion.div
            className="mb-8 backdrop-blur-sm bg-green-50/70 dark:bg-green-900/10 border border-green-200/50 dark:border-green-900/30 rounded-lg p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500 dark:text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                  Registration Complete
                </h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                  <p>
                    You are registered for the conference. Your abstract will be
                    linked to your registration automatically.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!registrationId && (
          <motion.div
            className="mb-8 backdrop-blur-sm bg-yellow-50/70 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-900/30 rounded-lg p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
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
                  Registration Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                  <p>
                    You can submit your abstract now, but you will need to
                    register for the conference to complete the submission
                    process.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <Link
                      href="/registration"
                      className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-amber-500/20 transition-all duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Register for Conference
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="p-6 md:p-8">
            <AbstractSubmissionForm
              initialEmail={email || ""}
              registrationId={registrationId || ""}
            />
          </div>
        </motion.div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6">
            Abstract Submission Guidelines
          </h2>

          <div className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 rounded-xl overflow-hidden shadow-lg divide-y divide-gray-200/50 dark:divide-gray-700/50">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Abstract Format
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Please follow these guidelines when preparing your abstract.
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Content Requirements
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary-500 dark:text-primary-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Title: Concise and descriptive
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary-500 dark:text-primary-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Authors: All authors and their affiliations
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary-500 dark:text-primary-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Introduction: Background and objectives
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary-500 dark:text-primary-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Methods: Brief description of methodology
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary-500 dark:text-primary-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Results: Summary of findings
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary-500 dark:text-primary-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Conclusion: Main implications of findings
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Formatting Requirements
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary-500 dark:text-primary-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Length: Maximum 300 words
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary-500 dark:text-primary-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        File format: PDF, DOCX, or DOC
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary-500 dark:text-primary-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Font: Times New Roman, 12pt
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary-500 dark:text-primary-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Spacing: 1.5 line spacing
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary-500 dark:text-primary-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Margins: 1 inch all sides
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary-500 dark:text-primary-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        File size: Maximum 10MB
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <motion.div
                className="mt-8 backdrop-blur-sm bg-blue-50/70 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-900/30 rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-500 dark:text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Important Dates
                    </h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Abstract submission deadline: May 15, 2025</li>
                        <li>Notification of acceptance: June 15, 2025</li>
                        <li>
                          Final submission of accepted abstracts: July 15, 2025
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AbstractSubmissionPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AbstractSubmissionContent />
    </Suspense>
  );
}
