import * as z from "zod";

export const bookingSchema = z.object({
    routeId: z.string().min(1, "Route ID is required"),
    userId: z.string().min(1, "User ID is required"),
    fromLocationId: z.string().min(1, "From Locaiton ID is required"),
    toLocationId: z.string().min(1, "To Location ID is required"),
    date: z.string(),
    seatNumber: z.number().min(1, "Seat Number must be greater than 0"),
    bookingStatus: z.string(),
    paymentId: z.string().optional(),
    fareId: z.string().min(1, "Fare ID is required")
})