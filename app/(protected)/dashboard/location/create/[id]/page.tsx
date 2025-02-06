
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import EditFrom from "@/components/location/EditForm";

export const metadata = constructMetadata({
  title: "Location – Next Template",
  description: "Location page for only manage management.",
});

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const pageIndex = 1;
  const pageSize = 10; 

  try {
   

    return (
      <div className="flex flex-col gap-5">
       <EditFrom />
      </div>
    );
  } catch (error) {
    console.error("Error fetching location data:", error);
    return (
      <div className="text-center text-red-500">
        Failed to load data. Please try again later.
      </div>
    );
  }
}
