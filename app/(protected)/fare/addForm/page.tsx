import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";

import AddFarePage from "@/components/fare/addFareForm"
export const metadata = constructMetadata({
  title: "Manager – Next Template",
  description: "Manager page for only manage management.",
});

// Server-side rendering using async function
export default async function AdminPage() {
  // Authenticate the user
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch the manager data from the API
  const pageIndex = 1; // Initial page index
  const pageSize = 10; // Records per page

  try {
    return (
      <div className="flex flex-col gap-5">
        <AddFarePage

        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching managers data:", error);
    // Optionally, render an error page or message
    return (
      <div className="text-center text-red-500">
        Failed to load data. Please try again later.
      </div>
    );
  }
}