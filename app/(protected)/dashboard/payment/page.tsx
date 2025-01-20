"use client";

import CheckoutPage from "@/components/payment/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
  
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
export default function Payment() {
  const searchParams = useSearchParams();
  const amountString = searchParams.get("amount") ?? "0";
  const bookingId = searchParams.get("booking_id") as string;
  
  const amount = parseFloat(amountString);

  if (!amount || amount <= 0) {
    return <div className="text-red-500">Invalid amount. Please try again.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-8 text-gray-800 bg-gray-50 shadow-lg rounded-md border border-gray-200 mt-16">
  <div className="mb-10 text-center">
    <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Complete Your Payment</h1>
    <h2 className="text-xl">
      You are about to make a payment of 
      <span className="font-bold text-indigo-600"> ${amount}</span>
    </h2>
  </div>

  <div className="p-6 bg-white shadow-md rounded-md border border-gray-300">
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: convertToSubcurrency(amount),
        currency: "usd",
      }}
    >
      <CheckoutPage amount={amount} />
    </Elements>
  </div>
</main>

  );
}
