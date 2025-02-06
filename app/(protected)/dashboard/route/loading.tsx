import { DashboardHeader } from "@/components/dashboard/header";
import { SkeletonSection } from "@/components/shared/section-skeleton";

export default function DashboardSettingsLoading() {
  return (
    <>
      <DashboardHeader
        heading="Manager"
        text="Manager"
      />
      <div className="divide-y divide-muted pb-10">
        
      </div>
    </>
  );
}
