"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

async function updateManager(
  managerId: string,
  managerName: string,
  managerEmail: string,
) {
  const response = await fetch(`/api/managers/${managerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: managerName, email: managerEmail }),
  });
  if (!response.ok) {
    toast.error("Failed to update manager");
  }
  return response.json();
}

export default function ManagerForm() {
  const [managerId, setManagerId] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
   
    const pathParts = window.location.pathname.split("/");
    const idFromPath = pathParts[pathParts.length - 1]; 
    setManagerId(idFromPath);

    // Extract query parameters for name and email
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (name) setManagerName(name);
    if (email) setManagerEmail(email);
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!managerId || managerId === "create") {
        toast.error("Valid manager ID is required.");
      }

      await updateManager(managerId, managerName, managerEmail);
      toast.success("Manager updated successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setTimeout(() => {
        router.push("/dashboard/manager");
      }, 1500); // Delay to show success message
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 w-full rounded-md bg-white p-6 shadow-md md:w-1/2">
      <h2 className="mb-4 text-lg font-semibold">Edit Manager</h2>

      {error && <p className="mb-4 text-red-500">{error}</p>}
      {success && <p className="mb-4 text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="managerName" className="block text-sm font-medium">
            Manager Name
          </label>
          <input
            type="text"
            id="managerName"
            className="w-full rounded-md border border-gray-300 p-2"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            placeholder="Enter Manager Name"
            required
          />
        </div>

        <div>
          <label htmlFor="managerEmail" className="block text-sm font-medium">
            Manager Email
          </label>
          <input
            type="email"
            id="managerEmail"
            className="w-full rounded-md border border-gray-300 p-2"
            value={managerEmail}
            onChange={(e) => setManagerEmail(e.target.value)}
            placeholder="Enter Manager Email"
            required
          />
        </div>

        <div className="mt-6 flex justify-between">
        <button
            type="button"
            className="rounded-md bg-gray-500 px-4 py-2 text-white"
            onClick={() => router.push("/dashboard/manager")} // Corrected path
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Manager"}
          </button>
        </div>
      </form>
    </div>
  );
}
