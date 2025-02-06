import { prisma } from "./db";

// -----------------------------------------------------------------------------
// To Get All Bookings - Function
// -----------------------------------------------------------------------------
export const getUserTicketsById = async (id: string) => {
    try {
        const tickets = await prisma.booking.findMany({
            where: {
                userId: id,
            },
            include: {
                route: {
                    include: {
                        vehicle: true,
                        origin: true,
                        destination: true,
                    }
                },
                user: true,
                origin: true,
                destination: true,
                fare: true,
            }
        })
        return tickets;
    } catch {
        return [];
    }
}
