"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import PaymentButton from "@/components/ui/PaymentButton";
import { REGISTRATION_FEES } from "@/lib/services/razorpay";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [registration, setRegistration] = useState<any>(null);
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
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
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

  const handlePaymentSuccess = (response: any) => {
    setSuccess(true);
    // Redirect to success page after 2 seconds
    setTimeout(() => {
      router.push(`/registration-success?registrationId=${registrationId}`);
    }, 2000);
  };

  const handlePaymentError = (error: any) => {
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
  const calculateFee = (registrationType: string) => {
    return (
      REGISTRATION_FEES[registrationType as keyof typeof REGISTRATION_FEES] || 0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
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
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Error
          </h2>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/registration")}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-green-500 text-center mb-4">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Payment Successful!
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Your payment has been processed successfully. Redirecting to
            confirmation page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            Complete Registration Payment
          </h2>
        </div>

        <div className="p-6">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Registration Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Name:</span>{" "}
                {registration?.name}
              </div>
              <div>
                <span className="font-medium text-gray-500">Email:</span>{" "}
                {registration?.email}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Registration Type:
                </span>{" "}
                {registration?.registrationType}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  Registration Code:
                </span>{" "}
                {registration?.registrationCode}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Payment Summary
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  Registration Fee ({registration?.registrationType})
                </span>
                <span className="font-medium">
                  {formatCurrency(calculateFee(registration?.registrationType))}
                </span>
              </div>

              {registration?.needAccommodation && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    Accommodation (to be paid at venue)
                  </span>
                  <span className="font-medium">As per selection</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">
                    Total Amount
                  </span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(
                      calculateFee(registration?.registrationType)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <PaymentButton
              registrationId={registrationId || ""}
              buttonText="Pay Now"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
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
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-blue-700">
              Your payment is secure. We use industry-standard encryption to
              protect your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
