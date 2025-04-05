"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import RegistrationForm from "@/components/forms/RegistrationForm";
import { motion } from "framer-motion";

export default function RegistrationPage() {
  const searchParams = useSearchParams();
  const abstractId = searchParams.get("abstractId");
  const email = searchParams.get("email");

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 sm:text-5xl">
            Conference Registration
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light">
            Register for the Pharmair Conference to join leading researchers and
            industry professionals in the field of pharmaceutical and air
            quality research.
          </p>
        </motion.div>

        {abstractId && (
          <motion.div
            className="mb-8 backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 border border-white/20 rounded-xl p-6 shadow-lg"
            variants={itemVariants}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-blue-500"
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
                <h3 className="text-md font-medium text-blue-700 dark:text-blue-400">
                  Abstract Already Submitted
                </h3>
                <div className="mt-2 text-sm text-blue-600 dark:text-blue-300">
                  <p>
                    We&apos;ve detected that you&apos;ve already submitted an
                    abstract. Completing this registration will link it to your
                    abstract submission.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="backdrop-blur-xl bg-white/40 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/30 rounded-xl shadow-lg overflow-hidden"
        >
          <RegistrationForm
            initialEmail={email || ""}
            abstractId={abstractId || ""}
          />
        </motion.div>

        <motion.div className="mt-16" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Registration Information
          </h2>

          <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-800/40 overflow-hidden shadow-lg rounded-xl border border-white/20 dark:border-gray-700/30">
            <div className="px-6 py-5">
              <h3 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Registration Fees
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                The following registration fees apply based on participant
                category.
              </p>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <motion.div
                  className="backdrop-blur-md bg-gradient-to-br from-blue-400/10 to-blue-600/10 p-6 rounded-xl border border-blue-200/30 shadow-md hover:shadow-blue-400/20 transition-all duration-300 transform hover:scale-105"
                  whileHover={{ y: -5 }}
                >
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400">
                    Student
                  </h4>
                  <p className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-300">
                    ₹2,500
                  </p>
                  <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    Valid student ID required at check-in
                  </p>
                </motion.div>

                <motion.div
                  className="backdrop-blur-md bg-gradient-to-br from-indigo-400/10 to-indigo-600/10 p-6 rounded-xl border border-indigo-200/30 shadow-md hover:shadow-indigo-400/20 transition-all duration-300 transform hover:scale-105"
                  whileHover={{ y: -5 }}
                >
                  <h4 className="font-semibold text-indigo-700 dark:text-indigo-400">
                    Academic
                  </h4>
                  <p className="mt-2 text-3xl font-bold text-indigo-900 dark:text-indigo-300">
                    ₹4,000
                  </p>
                  <p className="mt-2 text-sm text-indigo-700 dark:text-indigo-300">
                    For faculty and academic researchers
                  </p>
                </motion.div>

                <motion.div
                  className="backdrop-blur-md bg-gradient-to-br from-purple-400/10 to-purple-600/10 p-6 rounded-xl border border-purple-200/30 shadow-md hover:shadow-purple-400/20 transition-all duration-300 transform hover:scale-105"
                  whileHover={{ y: -5 }}
                >
                  <h4 className="font-semibold text-purple-700 dark:text-purple-400">
                    Industry
                  </h4>
                  <p className="mt-2 text-3xl font-bold text-purple-900 dark:text-purple-300">
                    ₹6,000
                  </p>
                  <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">
                    For industry professionals
                  </p>
                </motion.div>
              </div>

              <div className="mt-10 px-2">
                <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                  Registration Includes:
                </h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                      <svg
                        className="h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">
                      Access to all conference sessions and workshops
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                      <svg
                        className="h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">
                      Conference materials and proceedings
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                      <svg
                        className="h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">
                      Lunch and refreshments during the conference days
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                      <svg
                        className="h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">
                      Networking opportunities with industry leaders
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                      <svg
                        className="h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">
                      Certificate of participation
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
