import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import EditVehicleForm from "@/components/vehicle/EditForm"; // A component for editing vehicles
import { getVehicleById } from "@/lib/vehicle"; // Fetch a vehicle by ID

export const metadata = constructMetadata({
  title: "Vehicle Edit – Admin Dashboard",
  description: "Edit vehicle details for the management system.",
});

// Server-side rendering using async function
export default async function VehicleEditPage({
  params,
}: {
  params: { id: string };
}) {
  // Authenticate the user
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
    return null; // Ensure nothing further is rendered after redirect
  }

  // Extract vehicle ID from params
  const { id } = params;
  let vehicle: { number: string; id: string; name: string; type: string; seats: number; } | null = null;

  try {
    // Fetch the vehicle details
    vehicle = await getVehicleById(id);

    if (!vehicle) {
      return (
        <div className="text-center text-red-500">
          Vehicle not found. Please check the ID or try again later.
        </div>
      );
    }
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    return (
      <div className="text-center text-red-500">
        Failed to load vehicle data. Please try again later.
      </div>
    );
  }

  // Render the edit form
  return (
    <div className="flex flex-col gap-5 p-4">
      <h1 className="text-xl font-semibold">Edit Vehicle</h1>
      <EditVehicleForm vehicle={vehicle} />
    </div>
  );
}
