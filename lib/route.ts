import { prisma } from "@/lib/db";
import { routeSchema } from "./validations/route";

// -----------------------------------------------------------------------------
// To Get Route By ID - Function
// -----------------------------------------------------------------------------
export const getRouteById = async (id: string) => {
    try {
        const route = await prisma.route.findUnique({
            where: { id },
            include: {
                vehicle: true,
                origin: true,
                destination: true,
            }
        })
        return route;
    } catch {
        return null;
    }
}

// -----------------------------------------------------------------------------
// To Get All Routes - Function
// -----------------------------------------------------------------------------
export const getAllRoutes = async () => {
    try {
        const routes = await prisma.route.findMany({
            include: {
                origin: true,
                destination: true,
                vehicle: true,
            }
        }
        );
        return routes;
    } catch {
        return [];
    }
}

// -----------------------------------------------------------------------------
// To Add Route - Function
// -----------------------------------------------------------------------------
// export const addRoute = async (data: any) => {
//     try {
//         const validatedData = routeSchema.parse(data)

//         const route = await prisma.route.create({
//             data: validatedData,
//         })

//         return route

//     } catch (error) {
//         //Checking validation Error
//         if (error instanceof Error && "issues" in error) {
//             return {
//                 error: "Invalid Input",
//                 details: error.issues,
//             }
//         }

//         return {
//             error: "Failed to Add Route",
//             details: error.message,
//         }
//     }
// }
export const addRoute = async (data: any) => {
    try {
      const validatedData = routeSchema.parse(data);
  
      const route = await prisma.route.create({
        data: {
          departureTime: validatedData.departureTime,
          arrivalTime: validatedData.arrivalTime,
          origin: {
            connect: { id: validatedData.originId },  // Connect the existing origin by ID
          },
          destination: {
            connect: { id: validatedData.destinationId }, // Connect the existing destination by ID
          },
          vehicle: {
            connect: { id: validatedData.vehicleId }, // Connect the existing vehicle by ID
          },
          createdBy: {
            connect: { id: "cm64uuwy100009rov0pnycdyg" }, // Static User ID for createdBy
          },
        },
      });
  
      return route;
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        return {
          error: "Invalid Input",
          details: error.issues,
        };
      }
  
      return {
        error: "Failed to Add Route",
        details: error.message,
      };
    }
  };
  
  

// -----------------------------------------------------------------------------
// To Update Route - Function
// -----------------------------------------------------------------------------
// export const updateRoute = async (id: string, data: any) => {
//     try {
//         const validatedData = routeSchema.partial().parse(data)

//         // Corrected the model to 'route' instead of 'location'
//         const updatedRoute = await prisma.route.update({
//             where: { id },
//             data: validatedData,
//         })

//         return updatedRoute;
//     } catch (error) {
//         if (error instanceof Error && "issues" in error) {
//             return {
//                 error: "Invalid Input",
//                 details: error.issues,
//             }
//         }

//         return {
//             error: "Failed to update data",
//             details: error.message,
//         }
//     }
// }

export const updateRoute = async (id: string, data: any) => {
  try {
    const validatedData = routeSchema.partial().parse(data);

    // Prepare the data for updating the route
    const updateData: any = {};

    if (validatedData.originId) updateData.origin = { connect: { id: validatedData.originId } };
    if (validatedData.destinationId) updateData.destination = { connect: { id: validatedData.destinationId } };
    if (validatedData.vehicleId) updateData.vehicle = { connect: { id: validatedData.vehicleId } };

    // Use the provided string times directly (as strings)
    if (validatedData.departureTime) updateData.departureTime = validatedData.departureTime;
    if (validatedData.arrivalTime) updateData.arrivalTime = validatedData.arrivalTime;

    const updatedRoute = await prisma.route.update({
      where: { id },
      data: updateData,
    });

    return updatedRoute;
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return {
        error: "Invalid Input",
        details: error.issues,
      };
    }
    return {
      error: "Failed to update data",
      details: error.message,
    };
  }
};


// -----------------------------------------------------------------------------
// To Delete Route - Function
// -----------------------------------------------------------------------------
export const deleteRoute = async (id: string) => {
    try {
        // Check that if Route exist
        const routeToDelete = await prisma.route.findUnique({
            where: { id }
        })
        if (!routeToDelete) {
            return { error: "Route not found" }
        }

        // Delete the Route 
        await prisma.route.delete({ where: { id } })
        return { success: true, message: "Route delete successfully" };

    } catch (error) {
        return { error: "Failed to Delete Route", details: error.message }
    }
}