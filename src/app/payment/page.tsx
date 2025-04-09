"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import {
  CreditCardIcon,
  UserCircleIcon,
  EnvelopeIcon,
  IdentificationIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import PaymentButton from "@/components/ui/PaymentButton";
import { REGISTRATION_FEES } from "@/lib/services/razorpay-constants";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Registration {
  name: string;
  email: string;
  registrationType: string;
  registrationCode: string;
  paymentStatus: string;
  needAccommodation?: boolean;
}

// Loading component to use as fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-primary-600 dark:border-primary-400"></div>
        <p className="mt-6 text-xl font-medium text-gray-800 dark:text-gray-200">
          Loading payment details...
        </p>
      </motion.div>
    </div>
  );
}

// Component that uses useSearchParams
function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get registration ID from URL query parameters
  const registrationId = searchParams.get("registrationId");

  useEffect(() => {
    // Load Razorpay script
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    // Load registration details
    const fetchRegistration = async () => {
      if (!registrationId) {
        setError("Registration ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/register?id=${registrationId}`);

        if (response.data.success) {
          setRegistration(response.data.data);

          // If payment already completed, show success message
          if (response.data.data.paymentStatus === "Completed") {
            setSuccess(true);
          }
        } else {
          setError(
            response.data.message || "Failed to load registration details"
          );
        }
      } catch (error: unknown) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        setError(
          axiosError.response?.data?.message ||
            "Something went wrong. Please try again."
        );
        console.error("Error fetching registration:", error);
      } finally {
        setLoading(false);
      }
    };

    const init = async () => {
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        setError(
          "Failed to load payment gateway. Please refresh the page and try again."
        );
      }
      await fetchRegistration();
    };

    init();
  }, [registrationId]);

  const handlePaymentSuccess = () => {
    setSuccess(true);
    // Redirect to success page after 2 seconds
    setTimeout(() => {
      router.push(`/registration-success?registrationId=${registrationId}`);
    }, 2000);
  };

  const handlePaymentError = (error: Error | unknown) => {
    setError("Payment failed. Please try again.");
    console.error("Payment error:", error);
  };

  // Format currency amount to INR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Calculate fee based on registration type
  const calculateFee = (registrationType: string | undefined) => {
    if (!registrationType) return 0;
    return (
      REGISTRATION_FEES[registrationType as keyof typeof REGISTRATION_FEES] || 0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-primary-600 dark:border-primary-400"></div>
          <p className="mt-6 text-xl font-medium text-gray-800 dark:text-gray-200">
            Loading payment details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="default" className="max-w-md w-full">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="text-red-500 mb-6">
                <ExclamationCircleIcon className="mx-auto h-16 w-16" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Error</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
              <Button
                variant="default"
                size="lg"
                animate
                onClick={() => router.push("/registration")}
                className="inline-flex items-center"
              >
                <ArrowLeftIcon className="mr-2 h-5 w-5" />
                Back to Registration
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="default" className="max-w-md w-full">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="text-green-500 mb-6">
                <CheckCircleIcon className="mx-auto h-16 w-16" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your payment has been processed successfully.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Redirecting to confirmation page...
              </p>
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-primary-700 to-secondary-700 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
            Complete Your Payment
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Secure your spot at the Pharmair Conference by completing your
            registration payment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="default" hover="none" className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800 px-6 py-5">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2" />
                Payment Details
              </h2>
            </div>

            <CardContent className="divide-y divide-gray-200 dark:divide-gray-800">
              <div className="pb-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Registration Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <UserCircleIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Name
                      </p>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                        {registration?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <EnvelopeIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                        {registration?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <IdentificationIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Registration Type
                      </p>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                        {registration?.registrationType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BuildingLibraryIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Registration Code
                      </p>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                        {registration?.registrationCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Payment Summary
                </h3>
                <Card
                  variant="glass"
                  className="bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-slate-900/50 dark:to-slate-800/50"
                >
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          {registration?.registrationType} Registration Fee
                        </span>
                        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(
                            calculateFee(registration?.registrationType)
                          )}
                        </span>
                      </div>

                      {registration?.needAccommodation && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Accommodation (to be paid at venue)
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            To be determined
                          </span>
                        </div>
                      )}

                      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Total Amount
                          </span>
                          <span className="text-xl font-bold text-primary-700 dark:text-primary-400">
                            {formatCurrency(
                              calculateFee(registration?.registrationType)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-6 flex flex-col space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back
                  </Button>
                  <PaymentButton
                    registrationId={registrationId || ""}
                    buttonText="Complete Payment"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card
            variant="glass"
            className="border border-gray-200/50 dark:border-gray-800/50"
          >
            <CardContent className="p-5">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Secure Payment
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your payment information is encrypted and processed
                    securely. We use industry-standard security measures to
                    protect your data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <LockClosedIcon className="h-4 w-4 mr-1" />
            <span>Secured by Razorpay Payment Gateway</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentContent />
    </Suspense>
  );
}
