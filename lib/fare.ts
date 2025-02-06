import { prisma } from "@/lib/db";
import { fareSchema } from "./validations/fare";

export const getFareById = async (id: string) => {
    try {
        const fare = await prisma.fare.findUnique({
            where: { id },
            include: {
                route: {
                    include: {
                        vehicle: true,
                        bookings: true,
                        origin: true,
                        destination: true,
                    }
                },
                origin: true,
                destination: true,
                
            }
        })
        return fare;
    } catch {
        return null;
    }
}

export const getAllFares = async ({ page = 1, limit = 10 }: { page: number, limit: number }) => {
    try {
      const total = await prisma.fare.count();  // Count the total number of fares
      const fares = await prisma.fare.findMany({
        include: {
            route: {
                include: {
                    vehicle: true,
                    origin: true,
                    destination: true,
                }
            },
            origin: true,
            destination: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      return { fares, total };  // Return both fares and total
    } catch {
      return { fares: [], total: 0 };
    }
  };

export const getFaresByFilter = async ({ origin, destination }: { origin: string, destination: string }) => {
    try {
      const total = await prisma.fare.count({
        where: {
            fromLocationId: origin,
            toLocationId: destination,
        }
      });  // Count the total number of fares
      const fares = await prisma.fare.findMany({
        include: {
            route: {
                include: {
                    vehicle: true,
                    origin: true,
                    destination: true,
                }
            },
            origin: true,
            destination: true,
        },
        where: {
            fromLocationId: origin,
            toLocationId: destination,
        }
      });
      return { fares, total };  // Return both fares and total
    } catch {
      return { fares: [], total: 0 };
    }
  };

// -----------------------------------------------------------------------------
// To Add Fare - Function
// -----------------------------------------------------------------------------
export const addFare = async (data: any) => {
    try {
        const validatedData = fareSchema.parse(data)

        const fare = await prisma.fare.create({
            data: validatedData,
        })

        return fare

    } catch (error) {
        //Checking validation Error
        if (error instanceof Error && "issues" in error) {
            return {
                error: "Invalid Input",
                details: error.issues,
            }
        }

        return {
            error: "Failed to Add Fare",
            details: error.message,
        }
    }
}

// -----------------------------------------------------------------------------
// To Update Fare - Function
// -----------------------------------------------------------------------------
export const updateFare = async (id: string, data: any) => {
    try {
        const validatedData = fareSchema.partial().parse(data)

        const updatedFare = await prisma.fare.update({
            where: { id },
            data: validatedData,
        })

        return updatedFare;
    } catch (error) {
        if (error instanceof Error && "issues" in error) {
            return {
                error: "Invalid Input",
                details: error.issues,
            }
        }

        return {
            error: "Failed to update data",
            details: error.message,
        }
    }
}

// -----------------------------------------------------------------------------
// To Delete Fare - Function
// -----------------------------------------------------------------------------
export const deleteFare = async (id: string) => {
    try {
        // Check that if Fare exist
        const fareToDelete = await prisma.fare.findUnique({
            where: { id }
        })
        if (!fareToDelete) {
            return { error: "Fare not found" }
        }

        // Delete the Fare 
        await prisma.fare.delete({ where: { id } })
        return { success: true, message: "Fare delete successfully" };
    } catch (error) {
        return { error: "Failed to Delete Fare", details: error.message }
    }
}