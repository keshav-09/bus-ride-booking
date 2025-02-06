
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import ManagerForm from "@/components/route/ManagerForm";

export const metadata = constructMetadata({
  title: "Route – Next Template",
  description: "Route page for only manage management.",
});


export default async function AdminPage() {
  // Authenticate the user
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  const pageIndex = 1; 
  const pageSize = 10; 

  try {
   

    return (
      <div className="flex flex-col gap-5">
        
        <ManagerForm />
      </div>
    );
  } catch (error) {
    console.error("Error fetching routes data:", error);
    return (
      <div className="text-center text-red-500">
        Failed to load data. Please try again later.
      </div>
    );
  }
}
