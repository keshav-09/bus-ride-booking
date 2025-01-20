import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { getAllLocations } from "@/lib/location";

export const metadata = constructMetadata({
  title: "Dashboard – Next Template",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Fetch locations directly within the component using the server-side function
  const locations = await getAllLocations();

  if (!locations || locations.length === 0) {
    return <p className="text-red-500 text-center">No locations found.</p>;
  }

  const handleSearch = async () => {
    const origin = (document.getElementById("origin") as HTMLSelectElement).value;
    const destination = (document.getElementById("destination") as HTMLSelectElement).value;

    if (!origin || !destination) {
      alert("Please select both origin and destination");
      return;
    }

    console.log(`Searching for buses from ${origin} to ${destination}`);
    // Add the code to search for buses based on the selected origin and destination

    try {
      const response = await fetch(`/api/fares/search?origin=${origin}&destination=${destination}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch buses.");
      }

      const result = await response.json();

      if (result && result.length > 0) {
        console.log("Available buses:", result);
        // Handle displaying the result (pass it to your component for rendering)
      } else {
        console.log("No buses found for the selected route.");
      }
    } catch (error) {
      console.error("Error searching buses:", error);
    }

  };

  return (
    <>
      <DashboardHeader
        heading="Search for Buses"
      />

      <div className="flex items-center justify-center ">
        <form method="get" className=" w-[60vw] h-[10vh] rounded-3xl flex" onClick={() => handleSearch()} >

          {/* Origin Dropdown */}
          <div className="w-[40%] h-full rounded-3xl">

            <select
              id="origin"
              name="origin"
              // defaultValue={origin || ""}
              className="w-full h-[100%] px-8 py-2 rounded-l-3xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md"
            >
              <option value="" disabled>
                Select Origin
              </option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Dropdown */}
          <div className="w-[40%] h-full bg-slate-500 rounded-3xl">

            <select
              id="desination"
              name="destination"
              className="w-full h-[100%] px-8 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md"
            >

              <option value="" disabled>
                Select Destination
              </option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-[20%] bg-zinc-900 text-lg text-white py-2 px-5 rounded-r-3xl hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2"

          >
            Search
          </button>

        </form>
      </div>

      <EmptyPlaceholder>

      </EmptyPlaceholder>
    </>
  );
}
