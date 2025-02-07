"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface BookingConfirmProps {
    id: string | undefined;
    userid: string | undefined;
    fare: number | undefined;
    seats: number | undefined;
}

const BookingConfirm: React.FC<BookingConfirmProps> = ({ id, userid, fare, seats }) => {
    const [numPassengers, setNumPassengers] = useState(1);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [seatNo, setSeatNo] = useState(1);
    const [bookedSeats, setBookedSeats] = useState<number[]>([]); // Store booked seats
    const router = useRouter();

    useEffect(() => {
        // Fetch booked seats when the date changes
        const fetchBookedSeats = async () => {
            if (!selectedDate) return;
            try {
                const response = await fetch(`/api/booked-seats?date=${selectedDate}`);
                const data = await response.json();
                console.log("Selected Seats: ", data)
                setBookedSeats(data.bookedSeats || []); // Ensure it's an array
            } catch (error) {
                console.error("Error fetching booked seats:", error);
            }
        };
        fetchBookedSeats();
    }, [selectedDate]);

    const handleSeatSelect = (seatNumber: number) => {
        if (!bookedSeats.includes(seatNumber)) {
            setSeatNo(seatNumber);
        }
    };


    const handleBook = async () => {
        if (!numPassengers || !selectedDate || !seatNo) {
            alert("Please select passengers and date.");
            return;
        }

        try {
            const response = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fareId: id,
                    userId: userid,
                    date: selectedDate,
                    seatNo: seatNo,
                }),
            });

            if (!response.ok) throw new Error("Booking failed.");

            const result = await response.json();
            router.push(`/dashboard/payment?amount=${fare}&booking_id=${result?.id}`);
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Failed to create booking. Please try again.");
        }
    };

    return (
        <div className="container p-8">
            <div className="flex items-center justify-center gap-20">
                <div className="mb-8 w-[30%] rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
                    <h3 className="mb-2 text-xl font-semibold text-gray-700">
                        Number of Passengers
                    </h3>
                    <input
                        type="number"
                        value={1}
                        min="1"
                        className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-8 w-[30%] rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
                    <h3 className="mb-2 text-xl font-semibold text-gray-700">Select Date</h3>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            {/* Seat Selection */}
            <div className="mb-8 flex flex-col items-center justify-center">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Select Your Seat</h3>
                <div className="grid w-fit grid-cols-4 gap-2 rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
                    {Array.from({ length: seats ?? 0 }, (_, index) => {
                        const seatNumber = index + 1;
                        const isBooked = bookedSeats.includes(seatNumber); // Check booked seats

                        return (
                            <div
                                key={seatNumber}
                                onClick={() => !isBooked && handleSeatSelect(seatNumber)}
                                className={`flex size-12 cursor-pointer items-center justify-center rounded-lg
                                    ${seatNo === seatNumber ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
                                    ${isBooked ? "cursor-not-allowed disabled bg-red-500 text-white opacity-50" : ""}
                                `}
                            >
                                {seatNumber}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Payment Button */}
            <div className="flex items-center justify-center">
                <button
                    className="rounded-lg bg-zinc-800 px-6 py-3 text-white transition duration-200 hover:bg-zinc-700"
                    onClick={handleBook}
                >
                    Proceed to pay ₹{fare}/-
                </button>
            </div>
        </div>
    );
};

export default BookingConfirm;





