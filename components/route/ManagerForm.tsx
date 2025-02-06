"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Select from "react-select";
import { useSession } from "next-auth/react"

export default function RouteForm({ routeId }: { routeId?: string }) {
  const { data: session } = useSession()
  
  const [originId, setOriginId] = useState<string | null>(null);
  const [destinationId, setDestinationId] = useState<string | null>(null);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(session?.user?.id); 
  const [locations, setLocations] = useState<any[]>([]); 
  const [vehicles, setVehicles] = useState<any[]>([]); 
  const router = useRouter();

   

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/locations");
        const data = await response.json();
        if (response.ok) {
          setLocations(data.locations || []); 
        } else {
          setError(data.error || "Failed to fetch locations");
        }
      } catch (error) {
        setError("Error fetching locations");
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicle");
        const data = await response.json();
        if (response.ok) {
          setVehicles(data.data || []); 
        } else {
          setError(data.error || "Failed to fetch vehicles");
        }
      } catch (error) {
        setError("Error fetching vehicles");
      }
    };

    fetchLocations();
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (routeId) {
      const fetchRoute = async () => {
        try {
          const routeRes = await fetch(`/api/routes/${routeId}`);
          const routeData = await routeRes.json();

          if (routeRes.ok) {
            setOriginId(routeData.originId);
            setDestinationId(routeData.destinationId);
            setVehicleId(routeData.vehicleId);
            setDepartureTime(routeData.departureTime);
            setArrivalTime(routeData.arrivalTime);
            setUserId(routeData.userId || "");
          } else {
            setError("Failed to fetch route data");
          }
        } catch (error) {
          setError("Error fetching route details");
        }
      };

      fetchRoute();
    }
  }, [routeId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const routeData = {
        originId,
        destinationId,
        vehicleId,
        departureTime,
        arrivalTime,
        userId,
      };

      const response = await fetch(routeId ? `/api/routes/${routeId}` : "/api/routes", {
        method: routeId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        toast.error("Failed to save route");
        return;
      }

      toast.success(routeId ? "Route updated successfully" : "Route added successfully");
      router.push("/dashboard/route");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while processing your request.");
    }
  };

  // Helper function to find the full object from id
  const safeFindLocation = (id: string | null) => {
    return locations.find((loc) => loc.id === id) || null;
  };

  const safeFindVehicle = (id: string | null) => {
    return vehicles.find((vehicle) => vehicle.id === id) || null;
  };

  return (
    <div className="mx-auto mt-8 w-full rounded-md bg-white p-6 shadow-md md:w-1/2">
      <h2 className="mb-4 text-lg font-semibold">{routeId ? "Edit Route" : "Add New Route"}</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="originId" className="block text-sm font-medium">
            Origin
          </label>
          <Select
            id="originId"
            value={safeFindLocation(originId)?.id ? { value: safeFindLocation(originId).id, label: safeFindLocation(originId).name } : null}
            onChange={(selectedOption) => setOriginId(selectedOption?.value || null)} // Update with selectedOption.value
            options={locations.map((location) => ({
              value: location.id,
              label: location.name,
            }))}
            required
          />
        </div>

        <div>
          <label htmlFor="destinationId" className="block text-sm font-medium">
            Destination
          </label>
          <Select
            id="destinationId"
            value={safeFindLocation(destinationId)?.id ? { value: safeFindLocation(destinationId).id, label: safeFindLocation(destinationId).name } : null}
            onChange={(selectedOption) => setDestinationId(selectedOption?.value || null)} // Use selectedOption.value
            options={locations.map((location) => ({
              value: location.id,
              label: location.name,
            }))}
            required
          />
        </div>

        <div>
          <label htmlFor="vehicleId" className="block text-sm font-medium">
            Vehicle
          </label>
          <Select
            id="vehicleId"
            value={safeFindVehicle(vehicleId)?.id ? { value: safeFindVehicle(vehicleId).id, label: safeFindVehicle(vehicleId).name } : null}
            onChange={(selectedOption) => setVehicleId(selectedOption?.value || null)} // Set value to selectedOption.value
            options={vehicles.map((vehicle) => ({
              value: vehicle.id,
              label: vehicle.name,
            }))}
            required
          />
        </div>

        <div className="flex space-x-4">
        <div className="flex-1">
            <label htmlFor="arrivalTime" className="block text-sm font-medium">
              Arrival Time
            </label>
            <input
              type="time"
              id="arrivalTime"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="departureTime" className="block text-sm font-medium">
              Departure Time
            </label>
            <input
              type="time"
              id="departureTime"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
        
        </div>


        <input type="hidden" name="userId" value={userId} />

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="rounded-md bg-gray-500 px-4 py-2 text-white"
            onClick={() => router.push("/dashboard/route")}
          >
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-white">
            {routeId ? "Update Route" : "Add Route"}
          </button>
        </div>
      </form>
    </div>
  );
}

