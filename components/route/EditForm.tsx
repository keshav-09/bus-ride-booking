"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Select from "react-select";
import { toast } from "sonner";


async function updateRoute(
  routeId: string,
  originId: string,
  destinationId: string,
  vehicleId: string,
  departureTime: string,
  arrivalTime: string,
) {
  const response = await fetch(`/api/routes/${routeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      originId,
      destinationId,
      vehicleId,
      departureTime,
      arrivalTime,
    }),
  });
  if (!response.ok) {
    toast.error("Failed to update route");
  }
  return response.json();
}

export default function RouteForm() {
  const [routeId, setRouteId] = useState("");
  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [locations, setLocations] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const idFromPath = pathParts[pathParts.length - 1];
    setRouteId(idFromPath);

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

   
    const fetchRoute = async () => {
      try {
        const routeRes = await fetch(`/api/routes/${routeId}`);
        if (!routeRes.ok) {
          throw new Error(
            `Failed to fetch route details: ${routeRes.statusText}`,
          );
        }
        const routeData = await routeRes.json();
        console.log("Fetched Route:", routeData); 

        setOriginId(routeData.originId);
        setDestinationId(routeData.destinationId);
        setVehicleId(routeData.vehicleId);
        setDepartureTime(routeData.departureTime);
        setArrivalTime(routeData.arrivalTime);
      } catch (error) {
        setError(`Error fetching route details: ${error.message}`);
      }
    };

    if (routeId && routeId !== "create") {
      fetchRoute();
    }
    fetchLocations();
    fetchVehicles();
  }, [routeId]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(""); 
  
    console.log({
      originId,
      destinationId,
      vehicleId,
      departureTime,  
      arrivalTime,   
    });
  
    try {
      if (!routeId || routeId === "create") {
        toast.error("Valid route ID is required.");
        return;
      }
  
      await updateRoute(
        routeId,
        originId,
        destinationId,
        vehicleId,
        departureTime,  
        arrivalTime    
      );
      setSuccess("Route updated successfully");
      toast.success("Route updated successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setTimeout(() => {
        router.push("/dashboard/route");
      }, 1500); 
      setLoading(false);
    }
  };
  
  

 
  const safeFindLocation = (id: string | null) => {
    return locations.find((loc) => loc.id === id) || null;
  };

  
  const safeFindVehicle = (id: string | null) => {
    return vehicles.find((vehicle) => vehicle.id === id) || null;
  };

  return (
    
      <div className="mx-auto mt-8 w-full rounded-md bg-white p-6 shadow-md md:w-1/2">
      {error && <p className="mb-4 text-red-500">{error}</p>}
      {success && <p className="mb-4 text-green-500">{success}</p>}{" "}
    
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-6 rounded-lg bg-white p-6"
      >
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          {routeId ? "Update Route" : "Add Route"}
        </h2>

        {/* Origin Field */}
        <div className="mb-4">
          <label
            htmlFor="originId"
            className="block text-sm font-medium text-gray-700"
          >
            Origin
          </label>
          <Select
            id="originId"
            value={
              safeFindLocation(originId)?.id
                ? {
                    value: safeFindLocation(originId).id,
                    label: safeFindLocation(originId).name,
                  }
                : null
            }
            onChange={(selectedOption) =>
              setOriginId(selectedOption?.value || null)
            }
            options={locations.map((location) => ({
              value: location.id,
              label: location.name,
            }))}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {/* Destination Field */}
        <div className="mb-4">
          <label
            htmlFor="destinationId"
            className="block text-sm font-medium text-gray-700"
          >
            Destination
          </label>
          <Select
            id="destinationId"
            value={
              safeFindLocation(destinationId)?.id
                ? {
                    value: safeFindLocation(destinationId).id,
                    label: safeFindLocation(destinationId).name,
                  }
                : null
            }
            onChange={(selectedOption) =>
              setDestinationId(selectedOption?.value || null)
            }
            options={locations.map((location) => ({
              value: location.id,
              label: location.name,
            }))}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {/* Vehicle Field */}
        <div className="mb-4">
          <label
            htmlFor="vehicleId"
            className="block text-sm font-medium text-gray-700"
          >
            Vehicle
          </label>
          <Select
            id="vehicleId"
            value={
              safeFindVehicle(vehicleId)?.id
                ? {
                    value: safeFindVehicle(vehicleId).id,
                    label: safeFindVehicle(vehicleId).name,
                  }
                : null
            }
            onChange={(selectedOption) =>
              setVehicleId(selectedOption?.value || null)
            }
            options={vehicles.map((vehicle) => ({
              value: vehicle.id,
              label: vehicle.name,
            }))}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {/* Departure & Arrival Time Fields */}
        <div className="mb-4 flex space-x-4">

        <div className="flex-1">
            <label
              htmlFor="arrivalTime"
              className="block text-sm font-medium text-gray-700"
            >
              Arrival Time
            </label>
            <input
              type="time"
              id="arrivalTime"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              required
              className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="departureTime"
              className="block text-sm font-medium text-gray-700"
            >
              Departure Time
            </label>
            <input
              type="time"
              id="departureTime"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              required
              className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm"
            />
          </div>

         
        </div>

        {/* Hidden Field for User ID (if needed) */}
        <input type="hidden" name="userId" value={userId} />

        {/* Form Actions (Cancel and Submit Buttons) */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            onClick={() => router.push("/dashboard/route")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="hover:bg-primary-dark rounded-md bg-primary px-6 py-2 text-white"
          >
            {routeId ? "Update Route" : "Add Route"}
          </button>
        </div>
      </form>
      </div>
   
  );
}
