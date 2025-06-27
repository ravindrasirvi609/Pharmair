"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

interface RegistrationFormProps {
  initialEmail: string;
  abstractId: string;
}

type ParticipantCategory = "student" | "academic" | "industry";

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  salutation: string;
  aadharNumber: string;
  designation: string;
  institution: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  participantCategory: ParticipantCategory;

  abstractId: string;
}

export default function RegistrationForm({
  initialEmail,
  abstractId,
}: RegistrationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: "",
    lastName: "",
    email: initialEmail || "",
    phone: "",
    gender: "Male",
    dob: "",
    salutation: "Mr",
    aadharNumber: "",
    designation: "",
    institution: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    participantCategory: "academic",

    abstractId: abstractId || "",
  });

  const fees = {
    student: 2500,
    academic: 4000,
    industry: 6000,
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Map form data to API expected format
      const apiData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        whatsappNumber: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        salutation: formData.salutation,
        aadharNumber: formData.aadharNumber,
        affiliation: formData.institution,
        designation: formData.designation,
        institute: formData.institution,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.postalCode,
        country: formData.country,
        registrationType: mapParticipantCategoryToRegistrationType(
          formData.participantCategory
        ),
        needAccommodation: false,
        abstractId: formData.abstractId,
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Redirect to payment page with registration ID
      router.push(
        `/payment?registrationId=${data.data.registrationId}&amount=${fees[formData.participantCategory]}`
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map participant category to registration type
  const mapParticipantCategoryToRegistrationType = (
    category: ParticipantCategory
  ): string => {
    const mapping: Record<ParticipantCategory, string> = {
      student: "Student",
      academic: "Academic",
      industry: "Industry",
    };
    return mapping[category];
  };

  // Input field style classes
  const inputClass =
    "w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-sm text-gray-900 dark:text-white";
  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const formSectionClass =
    "backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 rounded-xl p-6 shadow-lg";

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-red-50/70 dark:bg-red-900/20 border border-red-200/50 dark:border-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </motion.div>
        )}

        <div className="space-y-8">
          <motion.div
            className={formSectionClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="firstName" className={labelClass}>
                  First name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="lastName" className={labelClass}>
                  Last name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="email" className={labelClass}>
                  Email address *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone" className={labelClass}>
                  Phone number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="institution" className={labelClass}>
                  Institution/Organization *
                  <span className="text-xs text-gray-400 ml-2">
                    (e.g., Sultan ul Uloom College of Pharmacy, Hyderabad)
                  </span>
                </label>
                <input
                  type="text"
                  name="institution"
                  id="institution"
                  required
                  value={formData.institution}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Sultan ul Uloom College of Pharmacy, Hyderabad"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="gender" className={labelClass}>
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="dob" className={labelClass}>
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="salutation" className={labelClass}>
                  Salutation *
                </label>
                <select
                  id="salutation"
                  name="salutation"
                  required
                  value={formData.salutation}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="designation" className={labelClass}>
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  id="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="aadharNumber" className={labelClass}>
                  Aadhar Number
                </label>
                <input
                  type="text"
                  name="aadharNumber"
                  id="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className={formSectionClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Address
            </h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="address" className={labelClass}>
                  Street address *
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="city" className={labelClass}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="state" className={labelClass}>
                  State / Province
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="postalCode" className={labelClass}>
                  ZIP / Postal code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  id="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="country" className={labelClass}>
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className={formSectionClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Registration Details
            </h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="participantCategory" className={labelClass}>
                  Participant Category *
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-2">
                  <div
                    className={`
                      cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 border-2 
                      ${
                        formData.participantCategory === "student"
                          ? "border-blue-500 shadow-lg shadow-blue-300/20 bg-blue-50/30 dark:bg-blue-900/20"
                          : "border-transparent bg-white/70 dark:bg-gray-800/70"
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        participantCategory: "student",
                      }))
                    }
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-blue-700 dark:text-blue-400">
                          Student
                        </h3>
                        <div
                          className={`h-5 w-5 rounded-full border ${formData.participantCategory === "student" ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-gray-600"} flex items-center justify-center`}
                        >
                          {formData.participantCategory === "student" && (
                            <svg
                              className="h-3 w-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-xl font-bold text-blue-900 dark:text-blue-300">
                        ₹2,500
                      </p>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                        Valid student ID required
                      </p>
                    </div>
                  </div>

                  <div
                    className={`
                      cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 border-2 
                      ${
                        formData.participantCategory === "academic"
                          ? "border-indigo-500 shadow-lg shadow-indigo-300/20 bg-indigo-50/30 dark:bg-indigo-900/20"
                          : "border-transparent bg-white/70 dark:bg-gray-800/70"
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        participantCategory: "academic",
                      }))
                    }
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-indigo-700 dark:text-indigo-400">
                          Academic
                        </h3>
                        <div
                          className={`h-5 w-5 rounded-full border ${formData.participantCategory === "academic" ? "border-indigo-500 bg-indigo-500" : "border-gray-300 dark:border-gray-600"} flex items-center justify-center`}
                        >
                          {formData.participantCategory === "academic" && (
                            <svg
                              className="h-3 w-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-xl font-bold text-indigo-900 dark:text-indigo-300">
                        ₹4,000
                      </p>
                      <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
                        Faculty and researchers
                      </p>
                    </div>
                  </div>

                  <div
                    className={`
                      cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 border-2 
                      ${
                        formData.participantCategory === "industry"
                          ? "border-purple-500 shadow-lg shadow-purple-300/20 bg-purple-50/30 dark:bg-purple-900/20"
                          : "border-transparent bg-white/70 dark:bg-gray-800/70"
                      }
                    `}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        participantCategory: "industry",
                      }))
                    }
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-purple-700 dark:text-purple-400">
                          Industry
                        </h3>
                        <div
                          className={`h-5 w-5 rounded-full border ${formData.participantCategory === "industry" ? "border-purple-500 bg-purple-500" : "border-gray-300 dark:border-gray-600"} flex items-center justify-center`}
                        >
                          {formData.participantCategory === "industry" && (
                            <svg
                              className="h-3 w-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-xl font-bold text-purple-900 dark:text-purple-300">
                        ₹6,000
                      </p>
                      <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">
                        Industry professionals
                      </p>
                    </div>
                  </div>

                  {/* Hidden select for form submission */}
                  <select
                    id="participantCategory"
                    name="participantCategory"
                    required
                    value={formData.participantCategory}
                    onChange={handleChange}
                    className="sr-only"
                  >
                    <option value="student">Student (₹2,500)</option>
                    <option value="academic">Academic (₹4,000)</option>
                    <option value="industry">Industry (₹6,000)</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            type="submit"
            disabled={loading}
            variant="glass"
            size="lg"
            animate={true}
            isLoading={loading}
            className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white"
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
