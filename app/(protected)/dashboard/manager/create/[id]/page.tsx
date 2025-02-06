
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import TransactionsList from "@/components/manager/TransactionsList";
import EditForm from "@/components/manager/EditForm";

export const metadata = constructMetadata({
  title: "Manager – Next Template",
  description: "Manager page for only manage management.",
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
       <EditForm />
      </div>
    );
  } catch (error) {
    console.error("Error fetching managers data:", error);
   
    return (
      <div className="text-center text-red-500">
        Failed to load data. Please try again later.
      </div>
    );
  }
}
