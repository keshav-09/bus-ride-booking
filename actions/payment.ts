"use server";

import { redirect } from "next/navigation";

export async function handlePayment(data) {
  const amount = data.get("amount");

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    throw new Error("Invalid amount");
  }

  redirect(`/dashboard/payment?amount=${amount}`);
}
