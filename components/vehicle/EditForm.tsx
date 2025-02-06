"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function updateVehicle(
  vehicleId: string,
  vehicleName: string,
  vehicleNumber: string,
  seats: number,
  vehicleType: string
) {
  const response = await fetch(`/api/vehicle/${vehicleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: vehicleName, number: vehicleNumber, seats, type: vehicleType }),
  });

  if (!response.ok) {
    throw new Error("Failed to update vehicle");
  }

  return response.json();
}

export default function VehicleForm({ vehicle }: { vehicle: any }) {
  const [vehicleId, setVehicleId] = useState(vehicle?.id || "");
  const [vehicleName, setVehicleName] = useState(vehicle?.name || "");
  const [vehicleNumber, setVehicleNumber] = useState(vehicle?.number || "");
  const [seats, setSeats] = useState(vehicle?.seats || 0);
  const [vehicleType, setVehicleType] = useState(vehicle?.type || "");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await updateVehicle(vehicleId, vehicleName, vehicleNumber, seats, vehicleType);
      toast.success("Vehicle updated successfully");
      router.push("/dashboard/vehicle"); 
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 w-full rounded-md bg-white p-6 shadow-md md:w-1/2">
      <h2 className="mb-4 text-lg font-semibold">Edit Vehicle</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="vehicleName" className="block text-sm font-medium">
            Vehicle Name
          </label>
          <input
            type="text"
            id="vehicleName"
            className="w-full rounded-md border border-gray-300 p-2"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
            placeholder="Enter Vehicle Name"
            required
          />
        </div>

        <div>
          <label htmlFor="vehicleNumber" className="block text-sm font-medium">
            Vehicle Number
          </label>
          <input
            type="text"
            id="vehicleNumber"
            className="w-full rounded-md border border-gray-300 p-2"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="Enter Vehicle Number"
            required
          />
        </div>

        <div>
          <label htmlFor="seats" className="block text-sm font-medium">
            Number of Seats
          </label>
          <input
            type="number"
            id="seats"
            className="w-full rounded-md border border-gray-300 p-2"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            placeholder="Enter Number of Seats"
            required
          />
        </div>

        <div>
          <label htmlFor="vehicleType" className="block text-sm font-medium">
            Vehicle Type
          </label>
          <input
            type="text"
            id="vehicleType"
            className="w-full rounded-md border border-gray-300 p-2"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            placeholder="Enter Vehicle Type"
            required
          />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="rounded-md bg-gray-500 px-4 py-2 text-white"
            onClick={() => router.push("/dashboard/vehicle")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}
