"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller, FormProvider } from "react-hook-form"
import { useSession } from "next-auth/react"

type FareFormValues = {
  route: string;
  fromLocation: string;
  toLocation: string;
  price: string;
};

export default function AddFarePage() {
  const router = useRouter()

  const methods = useForm<FareFormValues>({
    defaultValues: {
      route: '',
      fromLocation: '',
      toLocation: '',
      price: '',
    },
  })

  const { control, handleSubmit, formState: { errors } } = methods
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [routes, setRoutes] = useState<any[]>([]) 
  const [locations, setLocations] = useState<any[]>([]) 

  useEffect(() => {
    fetchRoutes();
    fetchLocations(); // Fetch locations for dropdowns
  }, []);
  
  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/fare'); // API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data,"vasb")
      setRoutes(data);
    } catch (error) {
    }
  };

  // Fetch locations from API for dropdown
  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/fare/fareLocation'); // API endpoint to fetch locations
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLocations(data);
    } catch (error) {
    }
  };
  
  const onSubmit = async (data: FareFormValues) => {
    try {
      if (!userId) {
        return
      }

      const fareData = {
        routeId: data.route,
        fromLocationId: data.fromLocation,
        toLocationId: data.toLocation,
        price: parseFloat(data.price),
        createdByUserId: userId,
      }


      const response = await fetch("/api/fare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fareData),
      })
      

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      router.push("/fare")
    } catch (error) {
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="mx-auto mt-8 w-full rounded-md bg-white p-6 shadow-md md:w-1/2">
        <h1 className="mb-4 text-3xl font-bold">Add Fare</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Route Dropdown */}
          <div>
            <label
              htmlFor="route"
              className="block text-sm font-medium text-gray-700"
            >
              Route
            </label>
            <Controller
              name="route"
              control={control}
              render={({ field }) => (
                <select
                  id="route"
                  {...field}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select Route</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.origin?.name && route.destination?.name
                        ? `${route.origin.name}(${route.arrivalTime}) to ${route.destination.name}(${route.departureTime})-(${route.vehicle.name})`
                        : `Route ${route.id}`}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.route && (
              <p className="text-sm text-red-600">Route is required</p>
            )}
          </div>

          {/* From Location Dropdown */}
          <div>
            <label
              htmlFor="fromLocation"
              className="block text-sm font-medium text-gray-700"
            >
              From Location
            </label>
            <Controller
              name="fromLocation"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="fromLocation"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select From Location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.fromLocation && (
              <p className="text-sm text-red-600">From Location is required</p>
            )}
          </div>

          {/* To Location Dropdown */}
          <div>
            <label
              htmlFor="toLocation"
              className="block text-sm font-medium text-gray-700"
            >
              To Location
            </label>
            <Controller
              name="toLocation"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="toLocation"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select To Location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.toLocation && (
              <p className="text-sm text-red-600">To Location is required</p>
            )}
          </div>

          {/* Price Input */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  id="price"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              )}
            />
            {errors.price && (
              <p className="text-sm text-red-600">Price is required</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push("/fare")}
              className="rounded-md bg-gray-300 px-4 py-2 text-black"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
