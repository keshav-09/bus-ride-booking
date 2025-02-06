"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

async function updateFare(
  fareId: string,
  fromLocation: string,
  toLocation: string,
  price: number
) {
  console.log("Sending update request:", { fareId, fromLocation, toLocation, price });

  const response = await fetch(`/api/fare/${fareId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fromLocation, toLocation, price }),
  });

  console.log("API response status:", response.status);

  if (!response.ok) {
    toast.error("Failed to update fare");
    throw new Error("Failed to update fare");
  }
  return response.json();
}

export default function FareForm() {
  const [fareId, setFareId] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const idFromPath = pathParts[pathParts.length - 1];
    setFareId(idFromPath);

    const fromLocation = searchParams.get("fromLocation");
    const toLocation = searchParams.get("toLocation");
    const price = searchParams.get("price");

    console.log("Search Params:", { fromLocation, toLocation, price });

    if (fromLocation) setFromLocation(fromLocation);
    if (toLocation) setToLocation(toLocation);
    if (price) setPrice(Number(price)); // Parse price as a number
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    if (!fareId || fareId === "create") {
      toast.error("Valid fare ID is required.");
      setLoading(false);
      return;
    }

    console.log("Submitting form:", { fareId, fromLocation, toLocation, price });

    // Ensure you're sending all fields (fromLocation, toLocation, price)
    await updateFare(fareId, fromLocation, toLocation, price);

    toast.success("Fare updated successfully");
    setSuccess("Fare updated successfully");
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error(error instanceof Error ? error.message : "An error occurred");
    setError(error instanceof Error ? error.message : "An error occurred");
  } finally {
    setTimeout(() => {
      router.push("/fare"); // Redirect after success
    }, 1500);
    setLoading(false);
  }
};

  return (
    <div className="mx-auto mt-8 w-full md:w-1/2 rounded-md bg-white p-6 shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Edit Fare</h2>

      {error && <p className="mb-4 text-red-500">{error}</p>}
      {success && <p className="mb-4 text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fromLocation" className="block text-sm font-medium">
            From Location
          </label>
          <input
            type="text"
            id="fromLocation"
            className="w-full rounded-md border border-gray-300 p-2"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            placeholder="Enter From Location"
            required
          />
        </div>
        <div>
          <label htmlFor="toLocation" className="block text-sm font-medium">
            To Location
          </label>
          <input
            type="text"
            id="toLocation"
            className="w-full rounded-md border border-gray-300 p-2"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            placeholder="Enter To Location"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Price
          </label>
          <input
            type="number"
            id="price"
            className="w-full rounded-md border border-gray-300 p-2"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Enter Price"
            required
          />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="rounded-md bg-gray-500 px-4 py-2 text-white"
            onClick={() => router.push("/fare")} // Correct path for cancellation
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Fare"}
          </button>
        </div>
      </form>
    </div>
  );
}