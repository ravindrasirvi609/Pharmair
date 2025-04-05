"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";

const ticketTypes = [
  {
    id: "standard",
    name: "Standard Pass",
    price: 599,
    features: [
      "Access to all keynote sessions",
      "Access to all panel discussions",
      "Conference materials",
      "Coffee breaks and lunches",
      "Welcome reception",
    ],
    notIncluded: [
      "Workshops and masterclasses",
      "Gala dinner",
      "VIP networking events",
    ],
  },
  {
    id: "premium",
    name: "Premium Pass",
    price: 899,
    featured: true,
    features: [
      "All Standard Pass benefits",
      "Access to workshops and masterclasses",
      "Gala dinner",
      "Exclusive Q&A sessions with speakers",
      "Conference recordings",
    ],
    notIncluded: [
      "VIP networking events",
      "One-on-one sessions with keynote speakers",
    ],
  },
  {
    id: "vip",
    name: "VIP Pass",
    price: 1299,
    features: [
      "All Premium Pass benefits",
      "VIP networking events",
      "One-on-one sessions with keynote speakers",
      "VIP lounge access",
      "Priority seating at all events",
      "Exclusive VIP gift bag",
    ],
    notIncluded: [],
  },
];

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  country: string;
  dietaryRequirements: string;
  specialNeeds: string;
  hearAbout: string;
  agreeTerms: boolean;
  agreeUpdates: boolean;
};

export default function Registration() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    country: "",
    dietaryRequirements: "",
    specialNeeds: "",
    hearAbout: "",
    agreeTerms: false,
    agreeUpdates: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicket(ticketId);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields for step 1
    if (currentStep === 1) {
      if (!selectedTicket) {
        newErrors.ticket = "Please select a ticket type";
      }
    }

    // Required fields for step 2
    if (currentStep === 2) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
      if (!formData.company.trim()) {
        newErrors.company = "Company/Organization is required";
      }
      if (!formData.jobTitle.trim()) {
        newErrors.jobTitle = "Job title is required";
      }
      if (!formData.country.trim()) {
        newErrors.country = "Country is required";
      }
    }

    // Required fields for step 3
    if (currentStep === 3) {
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = "You must agree to the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // In a real application, we would send the form data to an API endpoint
      // and handle the payment processing.
      // For this demo, we'll simulate a successful submission after a delay.
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Registration error:", error);
        setErrors({
          submit: "An error occurred during registration. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const stepHeadings = [
    "Select Your Ticket",
    "Personal Information",
    "Additional Information",
    "Review & Payment",
  ];

  const selectedTicketData = selectedTicket
    ? ticketTypes.find((ticket) => ticket.id === selectedTicket)
    : null;

  return (
    <div>
      <div className="relative py-12 md:py-16 lg:py-20">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-bg opacity-30 -z-10"></div>

        <div className="container mx-auto px-4">
          {/* Page header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Register Now</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
              Secure your spot at the 3rd Pharmair International Conference and
              join industry leaders from around the world.
            </p>
          </div>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Card variant="glass">
                <CardHeader>
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900">
                    <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-center text-2xl">
                    Registration Complete!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center mb-6">
                    Thank you for registering for the 3rd Pharmair International
                    Conference. We have sent a confirmation email to{" "}
                    <span className="font-semibold">{formData.email}</span>.
                  </p>
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <h3 className="font-semibold mb-2">
                      Registration Details:
                    </h3>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <span className="font-medium">Name:</span>{" "}
                        {formData.firstName} {formData.lastName}
                      </li>
                      <li>
                        <span className="font-medium">Ticket Type:</span>{" "}
                        {selectedTicketData?.name}
                      </li>
                      <li>
                        <span className="font-medium">Order Number:</span>{" "}
                        PHARMAIR-{Math.floor(Math.random() * 100000)}
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button
                    variant="default"
                    onClick={() => (window.location.href = "/")}
                  >
                    Return to Homepage
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <div>
              {/* Progress steps */}
              <div className="max-w-4xl mx-auto mb-10">
                <div className="flex flex-col md:flex-row justify-between relative">
                  {/* Progress bar */}
                  <div className="hidden md:block absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10"></div>
                  {/* Progress indicator */}
                  <div
                    className="hidden md:block absolute top-5 left-0 h-1 bg-primary-600 dark:bg-primary-400 transition-all duration-300 -z-5"
                    style={{
                      width: `${
                        ((currentStep - 1) / (stepHeadings.length - 1)) * 100
                      }%`,
                    }}
                  ></div>

                  {stepHeadings.map((heading, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center ${
                        index + 1 < currentStep
                          ? "text-primary-600 dark:text-primary-400"
                          : index + 1 === currentStep
                          ? "text-primary-800 dark:text-primary-200"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          index + 1 < currentStep
                            ? "bg-primary-600 dark:bg-primary-700 text-white"
                            : index + 1 === currentStep
                            ? "bg-white dark:bg-slate-800 border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {index + 1 < currentStep ? (
                          <CheckIcon className="w-5 h-5" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <span className="text-sm hidden md:block">{heading}</span>
                    </div>
                  ))}
                </div>
                <h2 className="text-xl md:text-2xl font-bold mt-8 text-center md:text-left">
                  {stepHeadings[currentStep - 1]}
                </h2>
              </div>

              {/* Form steps */}
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Ticket Selection */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ticketTypes.map((ticket) => (
                          <div key={ticket.id} className="relative">
                            <Card
                              variant={ticket.featured ? "gradient" : "glass"}
                              hover="glow"
                              className={`h-full flex flex-col ${
                                selectedTicket === ticket.id
                                  ? "ring-2 ring-primary-600 dark:ring-primary-400"
                                  : ""
                              }`}
                            >
                              {ticket.featured && (
                                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                                  <span className="bg-primary-600 text-white px-3 py-1 text-xs uppercase tracking-wider rounded-full">
                                    Most Popular
                                  </span>
                                </div>
                              )}
                              <CardHeader>
                                <CardTitle>{ticket.name}</CardTitle>
                                <CardDescription>
                                  <span className="text-2xl font-bold">
                                    ${ticket.price}
                                  </span>
                                  <span className="text-sm"> USD</span>
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="flex-grow">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      Includes:
                                    </h4>
                                    <ul className="space-y-2">
                                      {ticket.features.map((feature, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-start"
                                        >
                                          <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                                          <span className="text-sm">
                                            {feature}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  {ticket.notIncluded.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Not Included:
                                      </h4>
                                      <ul className="space-y-2">
                                        {ticket.notIncluded.map(
                                          (feature, idx) => (
                                            <li
                                              key={idx}
                                              className="flex items-start text-gray-500 dark:text-gray-400"
                                            >
                                              <span className="inline-block w-5 h-5 mr-2 flex-shrink-0">
                                                —
                                              </span>
                                              <span className="text-sm">
                                                {feature}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                              <CardFooter>
                                <Button
                                  type="button"
                                  variant={
                                    selectedTicket === ticket.id
                                      ? "default"
                                      : "outline"
                                  }
                                  className="w-full"
                                  onClick={() => handleTicketSelect(ticket.id)}
                                >
                                  {selectedTicket === ticket.id
                                    ? "Selected"
                                    : "Select"}
                                </Button>
                              </CardFooter>
                            </Card>
                          </div>
                        ))}
                      </div>
                      {errors.ticket && (
                        <div className="mt-2 text-red-600 dark:text-red-400 text-sm flex items-center">
                          <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                          {errors.ticket}
                        </div>
                      )}
                      <div className="flex justify-end mt-8">
                        <Button type="button" onClick={handleContinue}>
                          Continue
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Personal Information */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card variant="glass">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label
                                htmlFor="firstName"
                                className="block text-sm font-medium mb-1"
                              >
                                First Name{" "}
                                <span className="text-red-600">*</span>
                              </label>
                              <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={`w-full h-10 px-3 rounded-md bg-white dark:bg-slate-800 border ${
                                  errors.firstName
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-700"
                                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                              />
                              {errors.firstName && (
                                <div className="mt-1 text-red-600 dark:text-red-400 text-sm">
                                  {errors.firstName}
                                </div>
                              )}
                            </div>
                            <div>
                              <label
                                htmlFor="lastName"
                                className="block text-sm font-medium mb-1"
                              >
                                Last Name{" "}
                                <span className="text-red-600">*</span>
                              </label>
                              <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={`w-full h-10 px-3 rounded-md bg-white dark:bg-slate-800 border ${
                                  errors.lastName
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-700"
                                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                              />
                              {errors.lastName && (
                                <div className="mt-1 text-red-600 dark:text-red-400 text-sm">
                                  {errors.lastName}
                                </div>
                              )}
                            </div>
                            <div>
                              <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-1"
                              >
                                Email Address{" "}
                                <span className="text-red-600">*</span>
                              </label>
                              <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full h-10 px-3 rounded-md bg-white dark:bg-slate-800 border ${
                                  errors.email
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-700"
                                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                              />
                              {errors.email && (
                                <div className="mt-1 text-red-600 dark:text-red-400 text-sm">
                                  {errors.email}
                                </div>
                              )}
                            </div>
                            <div>
                              <label
                                htmlFor="company"
                                className="block text-sm font-medium mb-1"
                              >
                                Company/Organization{" "}
                                <span className="text-red-600">*</span>
                              </label>
                              <input
                                id="company"
                                name="company"
                                type="text"
                                value={formData.company}
                                onChange={handleInputChange}
                                className={`w-full h-10 px-3 rounded-md bg-white dark:bg-slate-800 border ${
                                  errors.company
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-700"
                                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                              />
                              {errors.company && (
                                <div className="mt-1 text-red-600 dark:text-red-400 text-sm">
                                  {errors.company}
                                </div>
                              )}
                            </div>
                            <div>
                              <label
                                htmlFor="jobTitle"
                                className="block text-sm font-medium mb-1"
                              >
                                Job Title{" "}
                                <span className="text-red-600">*</span>
                              </label>
                              <input
                                id="jobTitle"
                                name="jobTitle"
                                type="text"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                className={`w-full h-10 px-3 rounded-md bg-white dark:bg-slate-800 border ${
                                  errors.jobTitle
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-700"
                                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                              />
                              {errors.jobTitle && (
                                <div className="mt-1 text-red-600 dark:text-red-400 text-sm">
                                  {errors.jobTitle}
                                </div>
                              )}
                            </div>
                            <div>
                              <label
                                htmlFor="country"
                                className="block text-sm font-medium mb-1"
                              >
                                Country <span className="text-red-600">*</span>
                              </label>
                              <select
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className={`w-full h-10 px-3 rounded-md bg-white dark:bg-slate-800 border ${
                                  errors.country
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-700"
                                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                              >
                                <option value="">Select Country</option>
                                {[
                                  "United States",
                                  "Canada",
                                  "United Kingdom",
                                  "Germany",
                                  "France",
                                  "Japan",
                                  "Australia",
                                  "India",
                                  "Brazil",
                                  "Other",
                                ].map((country) => (
                                  <option key={country} value={country}>
                                    {country}
                                  </option>
                                ))}
                              </select>
                              {errors.country && (
                                <div className="mt-1 text-red-600 dark:text-red-400 text-sm">
                                  {errors.country}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <div className="flex justify-between mt-8">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                        >
                          Back
                        </Button>
                        <Button type="button" onClick={handleContinue}>
                          Continue
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Additional Information */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card variant="glass">
                        <CardContent className="p-6">
                          <div className="space-y-6">
                            <div>
                              <label
                                htmlFor="dietaryRequirements"
                                className="block text-sm font-medium mb-1"
                              >
                                Dietary Requirements
                              </label>
                              <input
                                id="dietaryRequirements"
                                name="dietaryRequirements"
                                type="text"
                                placeholder="Vegetarian, vegan, gluten-free, allergies, etc."
                                value={formData.dietaryRequirements}
                                onChange={handleInputChange}
                                className="w-full h-10 px-3 rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="specialNeeds"
                                className="block text-sm font-medium mb-1"
                              >
                                Special Needs or Accessibility Requirements
                              </label>
                              <textarea
                                id="specialNeeds"
                                name="specialNeeds"
                                rows={3}
                                placeholder="Please let us know if you have any special needs"
                                value={formData.specialNeeds}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="hearAbout"
                                className="block text-sm font-medium mb-1"
                              >
                                How did you hear about us?
                              </label>
                              <select
                                id="hearAbout"
                                name="hearAbout"
                                value={formData.hearAbout}
                                onChange={handleInputChange}
                                className="w-full h-10 px-3 rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                <option value="">Select an option</option>
                                <option value="Email">Email</option>
                                <option value="Social Media">
                                  Social Media
                                </option>
                                <option value="Colleague">Colleague</option>
                                <option value="Website">Website</option>
                                <option value="Previous Attendee">
                                  Previous Attendee
                                </option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <input
                                  id="agreeTerms"
                                  name="agreeTerms"
                                  type="checkbox"
                                  checked={formData.agreeTerms}
                                  onChange={handleCheckboxChange}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor="agreeTerms"
                                  className="ml-2 text-sm"
                                >
                                  I agree to the{" "}
                                  <a
                                    href="#"
                                    className="text-primary-600 dark:text-primary-400 hover:underline"
                                  >
                                    terms and conditions
                                  </a>{" "}
                                  <span className="text-red-600">*</span>
                                </label>
                              </div>
                              {errors.agreeTerms && (
                                <div className="text-red-600 dark:text-red-400 text-sm">
                                  {errors.agreeTerms}
                                </div>
                              )}
                              <div className="flex items-center">
                                <input
                                  id="agreeUpdates"
                                  name="agreeUpdates"
                                  type="checkbox"
                                  checked={formData.agreeUpdates}
                                  onChange={handleCheckboxChange}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor="agreeUpdates"
                                  className="ml-2 text-sm"
                                >
                                  I would like to receive updates about future
                                  conferences and events
                                </label>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <div className="flex justify-between mt-8">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                        >
                          Back
                        </Button>
                        <Button type="button" onClick={handleContinue}>
                          Continue
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Review & Payment */}
                  {currentStep === 4 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card variant="glass">
                        <CardHeader>
                          <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-semibold mb-2">
                                Selected Ticket:
                              </h3>
                              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex justify-between mb-2">
                                  <span>{selectedTicketData?.name}</span>
                                  <span>${selectedTicketData?.price} USD</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                                  <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>
                                      ${selectedTicketData?.price} USD
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">
                                Attendee Information:
                              </h3>
                              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                                <ul className="space-y-1">
                                  <li>
                                    <span className="font-medium">Name:</span>{" "}
                                    {formData.firstName} {formData.lastName}
                                  </li>
                                  <li>
                                    <span className="font-medium">Email:</span>{" "}
                                    {formData.email}
                                  </li>
                                  <li>
                                    <span className="font-medium">
                                      Company:
                                    </span>{" "}
                                    {formData.company}
                                  </li>
                                  <li>
                                    <span className="font-medium">
                                      Job Title:
                                    </span>{" "}
                                    {formData.jobTitle}
                                  </li>
                                  <li>
                                    <span className="font-medium">
                                      Country:
                                    </span>{" "}
                                    {formData.country}
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">
                                Payment Method:
                              </h3>
                              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                                <p className="mb-4">
                                  In a real application, you would integrate
                                  with a payment gateway like Stripe or PayPal
                                  here. For this demo, we&apos;ll simulate a
                                  payment process.
                                </p>
                                <div className="flex items-center mb-4">
                                  <input
                                    id="card-payment"
                                    name="payment"
                                    type="radio"
                                    checked
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                  />
                                  <label
                                    htmlFor="card-payment"
                                    className="ml-2 font-medium"
                                  >
                                    Credit/Debit Card
                                  </label>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                  <div>
                                    <label
                                      htmlFor="card-number"
                                      className="block text-sm font-medium mb-1"
                                    >
                                      Card Number
                                    </label>
                                    <input
                                      id="card-number"
                                      type="text"
                                      placeholder="•••• •••• •••• ••••"
                                      className="w-full h-10 px-3 rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label
                                        htmlFor="expiry-date"
                                        className="block text-sm font-medium mb-1"
                                      >
                                        Expiry Date
                                      </label>
                                      <input
                                        id="expiry-date"
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-full h-10 px-3 rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      />
                                    </div>
                                    <div>
                                      <label
                                        htmlFor="cvv"
                                        className="block text-sm font-medium mb-1"
                                      >
                                        CVV
                                      </label>
                                      <input
                                        id="cvv"
                                        type="text"
                                        placeholder="•••"
                                        className="w-full h-10 px-3 rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      {errors.submit && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                          {errors.submit}
                        </div>
                      )}
                      <div className="flex justify-between mt-8">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                        >
                          Back
                        </Button>
                        <Button type="submit" isLoading={isSubmitting}>
                          Complete Registration
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
