'use client';

import { addBooking } from "@/lib/booking";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, } from "react";

interface BookingConfirmProps {
    id: string;
    userid: string;
    fare: number;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

const BookingConfirm: React.FC<BookingConfirmProps> = ({
    id,
    userid,
    fare,

}:{
    id:string|undefined; 
    userid:string|undefined;
    fare:number|undefined;
}) => {
    const [numPassengers, setNumPassengers] = useState(1);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [seatNo, setSeatNo] = useState(1);
    const router = useRouter();
    const handlePassengerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value) || 1;
        setNumPassengers(value > 0 ? value : 1);
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
    };
    console.log(selectedDate);

    const handleSeatSelect = (seatNumber: number) => {
        setSeatNo(seatNumber);
    };


    const handleBook = async () => {
        if (!numPassengers || !selectedDate || !seatNo) {
            alert("Please select passengers and date.");
            return;
        }

        try {
            // API call to create a booking
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

            if (!response.ok) {
                throw new Error("Booking failed.");
            }

            const result = await response.json();
            console.log("Booking created:", result); 
            router.push(`/dashboard/payment?amount=${fare}&booking_id=${result?.id}&`);
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Failed to create booking. Please try again.");
        }
    };


    return (
        <>
            <div className="container p-8">
                {/* Number of Passengers and Date Selection */}
                <div className="flex items-center justify-center gap-20">
                    <div className="w-[30%] bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Number of Passengers
                        </h3>
                        <input
                            type="number"
                            value={1}
                            onChange={handlePassengerChange}
                            min="1"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="w-[30%] bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Select Date
                        </h3>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
                {/* Seat Selection */}
                <div className="mb-8 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Select Your Seat
                    </h3>
                    <div className="w-fit grid grid-cols-4 gap-2 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        {Array.from({ length: 20 }, (_, index) => {
                            const seatNumber = index + 1;
                            return (
                                <div
                                    key={seatNumber}
                                    onClick={() => handleSeatSelect(seatNumber)}
                                    // style={{
                                    //     marginRight: (index % 4 === 1) ? '16px' : '0', // Extra gap after the 2nd column
                                    // }}
                                    className={`w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer ${seatNo === seatNumber
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    {seatNumber}
                                </div>
                            );
                        })}
                    </div>


                </div>


                {/* Payment Button*/}
                <div className="flex justify-center items-center">
                    <button
                        className=" bg-zinc-800 text-white py-3 px-6 rounded-lg hover:bg-zinc-700 transition duration-200"
                        onClick={handleBook}
                    >
                        Proceed to pay ₹{fare}/-
                    </button>
                </div>

            </div>
        </>
    );
};

export default BookingConfirm;
