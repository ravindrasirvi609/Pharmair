import React, { useState } from "react";
import axios from "axios";
import Button from "./Button";
import { useRouter } from "next/navigation";

interface PaymentButtonProps {
  registrationId?: string;
  transactionId?: string;
  className?: string;
  onSuccess?: (paymentData: any) => void;
  onError?: (error: any) => void;
  buttonText?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  registrationId,
  transactionId,
  className,
  onSuccess,
  onError,
  buttonText = "Pay Now",
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validate props
  if (!registrationId && !transactionId) {
    console.error(
      "Either registrationId or transactionId is required for PaymentButton"
    );
    return null;
  }

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Step 1: Create order on the backend
      const orderResponse = await axios.post("/api/payment/create", {
        registrationId,
        transactionId,
      });

      const { data } = orderResponse.data;

      // Step 2: Initialize Razorpay payment
      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount * 100, // Razorpay expects amount in paise
          currency: data.currency,
          name: "Pharmair Conference",
          description: "Conference Registration Payment",
          order_id: data.orderId,
          handler: async (response: any) => {
            try {
              // Handle successful payment
              // The webhook will update the payment status in the backend
              if (onSuccess) {
                onSuccess(response);
              } else {
                // Redirect to success page if no custom handler
                router.push(
                  `/payment-success?orderId=${data.orderId}&paymentId=${response.razorpay_payment_id}`
                );
              }
            } catch (error) {
              console.error("Error handling payment success:", error);
              if (onError) onError(error);
            }
          },
          prefill: {
            // These can be populated from the registration data if available
          },
          notes: {
            transactionId: data.transactionId,
            userId: data.userId,
          },
          theme: {
            color: "#0369a1",
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        console.error("Razorpay SDK not loaded");
        if (onError) onError(new Error("Razorpay SDK not loaded"));
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? "Processing..." : buttonText}
    </Button>
  );
};

export default PaymentButton;
