"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller, FormProvider } from "react-hook-form"
import { useSession } from "next-auth/react"
import { addLocation } from "@/lib/location" // Make sure the import is correct

type FareFormValues = {
  name: string;
};
type LocationResponse =
  | { id: string; name: string } // success response
  | { error: string; details: any }; // error response



export default function AddLocationPage() {
  const router = useRouter()

  const methods = useForm<FareFormValues>({
    defaultValues: {
      name: '',
    },
  })

  const { control, handleSubmit, formState: { errors } } = methods

  const onSubmit = async (data: FareFormValues) => {
    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      // Check if the response is valid and has a status of 200 or 201
      if (!response.ok) {
        const errorResponse = await response.json();
        return;
      }
  
      // Try to parse JSON if the response is okay
      const result = await response.json();
      router.push("/location"); // Redirect to locations page after adding
    } catch (error) {
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto py-8">
        <h1 className="mb-4 text-3xl font-bold">Add Location</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Location Name is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"  // Corrected to 'text' for the HTML input type
                  id="name"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push("/location")}
              className="rounded-md bg-gray-300 px-4 py-2 text-black"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
