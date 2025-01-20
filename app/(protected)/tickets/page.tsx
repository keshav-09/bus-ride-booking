import { getAllBookings } from "@/lib/booking"
import { getCurrentUser } from "@/lib/session";
import { getUserTicketsById } from "@/lib/ticket";
import { MoveRight } from "lucide-react";

const TicketsPage = async () => {

    const user = await getCurrentUser();
    const response = await getUserTicketsById(user?.id);
    const tickets = response;

    return (
        <div>

            {
                tickets.map((ticket) => {
                    return (
                        <div>
                            <div>
                                <div className="bg-white py-10 px-20 rounded-lg shadow-lg mb-6 border border-gray-200">
                                    <div className="flex justify-between">
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-4 uppercase">
                                            {ticket.user.name}
                                        </h3>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                            {ticket.route.vehicle.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-start justify-center gap-10 py-8 border-t">
                                        <div>
                                            <p className="text-zinc-600">From:</p>
                                            <h2 className="text-2xl font-bold text-zinc-800">{ticket.route.origin.name}</h2>
                                            <p className="text-zinc-700"></p>
                                            <p className="text-zinc-700">
                                                {new Date(ticket.route.departureTime).toLocaleString()}
                                            </p>
                                        </div>
                                        <MoveRight className="my-auto" />
                                        <div>
                                            <p className="text-zinc-600">To:</p>
                                            <h2 className="text-2xl font-bold text-zinc-800">
                                                {ticket.route.destination.name}
                                            </h2>
                                            <p className="text-zinc-700">{new Date(ticket.date).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between border-t py-4">
                                        <div>
                                            <p className="text-sm text-zinc-700">Vehicle No:</p>
                                            <p className="text-md font-semibold">{ticket.route.vehicle.number}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-700">Seat No:</p>
                                            <p className="text-md font-semibold">{ticket.seatNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-700">Vehicle Type:</p>
                                            <p className="text-md font-semibold">{ticket.route.vehicle.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-700">Total Fare:</p>
                                            <p className="text-md font-semibold">
                                                ₹{ticket.fare.price}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-700">Total Fare:</p>
                                            <p className="text-md font-semibold">
                                                {ticket.bookingStatus}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )

                })
            }
        </div>

    )
}

export default TicketsPage;