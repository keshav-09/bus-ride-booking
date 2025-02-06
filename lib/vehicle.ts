import { prisma } from "@/lib/db";
import { vehicleSchema } from "./validations/vehicle";

// -----------------------------------------------------------------------------
// To Get Vehicle By ID - Function
// -----------------------------------------------------------------------------
export const getVehicleById = async (id: string) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });
    return vehicle;
  } catch {
    return null;
  }
};

// -----------------------------------------------------------------------------
// To Get All Vehicles with Pagination - Function
// -----------------------------------------------------------------------------
export const getAllVehicles = async (page: number, limit: number) => {
    try {
      const vehicles = await prisma.vehicle.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      const total = await prisma.vehicle.count();
      return { vehicles, total };
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      return { vehicles: [], total: 0 };
    }
  };
  

// -----------------------------------------------------------------------------
// To Add Vehicle - Function
// -----------------------------------------------------------------------------
export const addVehicle = async (data: unknown) => {
    try {
      const validatedData = vehicleSchema.parse(data);
  
      const vehicle = await prisma.vehicle.create({
        data: validatedData,
      });
  
      return vehicle;
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        return {
          error: "Validation Error",
          details: error.issues,
        };
      }
  
      return {
        error: "Failed to Add Vehicle",
        details: error.message,
      };
    }
  };
  

// -----------------------------------------------------------------------------
// To Update Vehicle - Function
// -----------------------------------------------------------------------------
export const updateVehicle = async (id: string, data: any) => {
  try {
    const validatedData = vehicleSchema.partial().parse(data);

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: validatedData,
    });

    return updatedVehicle;
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return {
        error: "Invalid Data Input",
        details: error.issues,
      };
    }

    return {
      error: "Failed to Update Vehicle",
      details: error.message,
    };
  }
};

// -----------------------------------------------------------------------------
// To Delete Vehicle - Function
// -----------------------------------------------------------------------------
export const deleteVehicle = async (id: string) => {
  try {
    // Check that the vehicle exists
    const vehicleToDelete = await prisma.vehicle.findUnique({
      where: { id },
    });
    if (!vehicleToDelete) {
      return { error: "Vehicle not found" };
    }

    // Delete the vehicle
    await prisma.vehicle.delete({ where: { id } });
    return { success: true, message: "Vehicle deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete vehicle", details: error.message };
  }
};
