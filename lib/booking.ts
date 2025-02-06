import { prisma } from "@/lib/db"
import { bookingSchema } from "./validations/booking";

// -----------------------------------------------------------------------------
// To Get Bbooking By ID - Function
// -----------------------------------------------------------------------------
export const getBookingById = async (id: string) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                route: true,
                user: true,
                origin: true,
                destination: true,
                fare: true,
            }
        })
        return booking;
    } catch {
        return null;
    }
}

// -----------------------------------------------------------------------------
// To Get All Bookings - Function
// -----------------------------------------------------------------------------
export const getAllBookings = async () => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                route: true,
                user: true,
                origin: true,
                destination: true,
                fare: true,
            }
        })
        return bookings;
    } catch {
        return [];
    }
}


// -----------------------------------------------------------------------------
// To Add booking - Function
// -----------------------------------------------------------------------------
export const addBooking = async (data: any) => {
    try {
        // Validate input data using the Zod schema
        const validatedData = bookingSchema.parse(data);

        // Create a new booking in the database
        const newBooking = await prisma.booking.create({
            data: validatedData,
        });

        return newBooking;
    } catch (error) {
        console.log(error);
        // Handle validation errors
        if (error instanceof Error && "issues" in error) {
            return { error: "Validation failed", details: error.issues };
        }

        // Handle other errors
        return { error: "Failed to add booking", details: error.message };
    }
};
// -----------------------------------------------------------------------------
// To Update booking - Function
// -----------------------------------------------------------------------------
export const updateBooking = async (id: string, data: any) => {
    try {
        const validatedData = bookingSchema.partial().parse(data)

        const updatedbooking = await prisma.booking.update({
            where: { id },
            data: validatedData,
        })

        return updatedbooking;
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
// To Delete Booking - Function
// -----------------------------------------------------------------------------
export const deleteBooking = async (id: string) => {
    try {
        // Check that if Route exist
        const bookingToDelete = await prisma.booking.findUnique({
            where: { id }
        })
        if (!bookingToDelete) {
            return { error: "Booking not found" }
        }

        // Delete the Route 
        await prisma.booking.delete({ where: { id } })
        return { success: true, message: "Booking delete successfully" };
    } catch (error) {
        return { error: "Failed to Delete Booking", details: error.message }
    }
}