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
                                <div className="mb-6 rounded-lg border border-gray-200 bg-white px-20 py-10 shadow-lg">
                                    <div className="flex justify-between">
                                        <h3 className="mb-4 text-2xl font-semibold uppercase text-gray-800">
                                            {ticket.user.name}
                                        </h3>
                                        <h3 className="mb-4 text-xl font-semibold text-gray-800">
                                            {ticket.route.vehicle.name}
                                        </h3>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-10 border-t py-8 ">
                                        <div className="flex gap-10">
                                            <div>
                                                <p className="text-zinc-600">From:</p>
                                                <h2 className="text-2xl font-bold text-zinc-800">{ticket.route.origin.name}</h2>
                                                <p className="text-zinc-700"></p>
                                                <p className="text-zinc-700">
                                                    {new Date(ticket.route.departureTime).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <MoveRight className="my-auto" />
                                            <div>
                                                <p className="text-zinc-600">To:</p>
                                                <h2 className="text-2xl font-bold text-zinc-800">
                                                    {ticket.route.destination.name}
                                                </h2>
                                                <p className="text-zinc-700">{new Date(ticket.date).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-zinc-900 font-bold">Date:</p>
                                            <p className="text-zinc-700">{new Date(ticket.date).toLocaleDateString()}</p>
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
                                            <p className="text-sm text-zinc-700">Status:</p>
                                            <p className="text-md font-semibold">
                                                Successful
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