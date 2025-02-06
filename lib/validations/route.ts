import * as z from "zod";

export const routeSchema = z.object({
  originId: z.string().min(1, "Origin ID is required"),
  destinationId: z.string().min(1, "Destination ID is required"),
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  departureTime: z.string().min(1, "Departure time is required")  // Expecting HH:mm:ss format as string
    .regex(/^([0-9]{2}):([0-9]{2})(:([0-9]{2}))?$/, "Invalid time format. Expected HH:mm:ss or HH:mm"),
  arrivalTime: z.string().min(1, "Arrival time is required")  // Expecting HH:mm:ss format as string
    .regex(/^([0-9]{2}):([0-9]{2})(:([0-9]{2}))?$/, "Invalid time format. Expected HH:mm:ss or HH:mm"),
    userId: z.string().min(1, "Created by User ID is required"),
});
