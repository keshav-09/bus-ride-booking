"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { toast } from "sonner";

export default function VehicleForm() {
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [seats, setSeats] = useState(0);
  const [vehicleType, setVehicleType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!vehicleName || !vehicleNumber || seats <= 0 || !vehicleType) {
      setError("All vehicle details are required");
      return; 
    }
  
    try {
      const response = await fetch("/api/vehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: vehicleName,
          number: vehicleNumber,
          seats:seats,
          type: vehicleType,
        }),
      });
  
      if (!response.ok) {
        toast.error("Failed to add vehicle");
        const data = await response.json();
        setError(data.error || "An unexpected error occurred");
        return;
      }
  
      toast.success("Vehicle added successfully");
      router.push("/dashboard/vehicle"); 
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while processing your request.");
      setError("An error occurred while processing your request.");
    }
  };
  

  return (
    <div className="mx-auto mt-8 w-full rounded-md bg-white p-6 shadow-md md:w-1/2">
      <h2 className="mb-4 text-lg font-semibold">Add New Vehicle</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

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
            onChange={(e) => setSeats(parseInt(e.target.value))}
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
          >
            Add Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}
