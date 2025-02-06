import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import AddForm from "@/components/vehicle/AddForm"; 

export const metadata = constructMetadata({
  title: "Add Vehicle – Next Template",
  description: "Page to add a new vehicle.",
});

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

 

  try {
    return (
      <div className="flex flex-col gap-5">
        <AddForm />
      </div>
    );
  } catch (error) {
    console.error("Error loading add vehicle form:", error);
    return (
      <div className="text-center text-red-500">
        Failed to load form. Please try again later.
      </div>
    );
  }
}
