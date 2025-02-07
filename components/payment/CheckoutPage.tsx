import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

const CheckoutPage = ({ amount, bookingId }: { amount: number; bookingId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      setCurrentBookingId(bookingId);
    }
  }, [bookingId]);

  console.log(currentBookingId, "Current Booking ID");


  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  console.log(bookingId, "bookingId")
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }
    console.log(bookingId, "inside the booking api");
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payment-success?bookingId=${bookingId}`,
      },

    });
    console.log(bookingId, "outside the api")
    if (error) {
      setErrorMessage(error.message);
      window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payment-fail`;
    } else {
      console.log(currentBookingId, "inside the booking api");
      await fetch("/api/update-booking-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId: currentBookingId, status: "successful" }),
      });
      console.log(bookingId, "Booking ID at component render");

    }
    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="text-surface inline-block size-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md bg-white p-2">
      {clientSecret && <PaymentElement />}

      {errorMessage && <div>{errorMessage}</div>}

      <button
        disabled={!stripe || loading}
        className="mt-2 w-full rounded-md bg-black p-5 font-bold text-white disabled:animate-pulse disabled:opacity-50"
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;