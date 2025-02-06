import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { getAllVehicles } from "@/lib/vehicle"; // Import the vehicle function
import TransactionsList from "@/components/vehicle/MasterList"; // Assuming this is your vehicle list component

export const metadata = constructMetadata({
  title: "Vehicle Management – Next Template",
  description: "Vehicle management page for admin users.",
});

// Server-side rendering using async function
export default async function AdminPage() {
  // Authenticate the user
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch the vehicle data from the API with pagination
  const pageIndex = 1; // Initial page index
  const pageSize = 10; // Records per page

  try {
    // Fetch vehicles from the API (with pagination logic)
    const { vehicles, total } = await getAllVehicles(pageIndex, pageSize);

    return (
      <div className="flex flex-col gap-5">
        <TransactionsList vehicles={vehicles} total={total} pageIndex={pageIndex} pageSize={pageSize} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching vehicles data:", error);
    // Optionally, render an error page or message
    return (
      <div className="text-center text-red-500">
        Failed to load data. Please try again later.
      </div>
    );
  }
}
