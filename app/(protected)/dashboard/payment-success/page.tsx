// app/dashboard/payment-success/page.tsx
"use client";

import { Check } from "lucide-react";
import { useEffect } from "react";

export default function PaymentSuccess({
  searchParams: { bookingId },
}: {
  searchParams: {
    bookingId: string;
  };
}) {
  useEffect(() => {
    if (bookingId) {
      // Call the API to update the booking status
      fetch("/api/update-booking-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, status: "successful" }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Booking status updated successfully");
          } else {
            console.error("Failed to update booking status:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error updating booking status:", error);
        });
    }
  }, [bookingId]);

  return (
    <main className="flex h-full flex-col items-center justify-center bg-gradient-to-">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Success Animation Circle */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Check className="h-10 w-10 text-green-500" />
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your transaction has been completed
          </p>
        </div>
      </div>
    </main>
  );
}