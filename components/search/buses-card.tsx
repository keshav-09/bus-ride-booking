import React from "react";
import { MoveRight } from "lucide-react";
import Link from "next/link";

interface AvailableBusCardProps {
    id: string
    busName: string;
    startLocation: string;
    startTime: string;
    endLocation: string;
    endTime: string;
    vehicleNumber: string;
    userStartLocation: string;
    userEndLocation: string;
    fare: number;
    type: string;
    availableSeats: number;
}

const AvailableBusCard: React.FC<AvailableBusCardProps> = ({
    id,
    busName,
    startLocation,
    startTime,
    endLocation,
    endTime,
    vehicleNumber,
    userStartLocation,
    userEndLocation,
    fare,
    type,
    availableSeats,
}) => {
    return (
        
        <Link href={`/booking/${id}`} className="mx-auto flex w-[500px] flex-col rounded-lg border bg-white px-10 py-4 shadow-md">
            <div className="mb-2 flex items-center justify-between gap-20 border-b pb-2">
                <h2 className="text-xl font-bold text-gray-800">{busName}</h2>
                <p className="text-sm text-gray-500">{vehicleNumber}</p>
            </div>

            <div className="mb-4">

                <div className="flex justify-between text-sm text-gray-600">
                    <div>
                        <p className="font-semibold text-gray-800">Start Location</p>
                        <p className="font-semibold">{startLocation}</p>
                        <p className="text-xs text-gray-700">{new Date(startTime).toLocaleTimeString()}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">End Location</p>
                        <p className="font-semibold">{endLocation}</p>
                        <p className="text-xs text-gray-700">{new Date(endTime).toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>

            <div className="mb-4 flex items-center justify-center border-b pb-4">
                <div className="text-sm">
                    <p className="font-semibold text-gray-800">Type</p>
                    <p>{type}</p>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="text-sm">
                    <p className="font-semibold text-gray-800">Start</p>
                    <p>{userStartLocation}</p>
                </div>
                <MoveRight />
                <div className="text-sm">
                    <p className="font-semibold text-gray-800">End</p>
                    <p>{userEndLocation}</p>
                </div>
                <div className="text-sm">
                    <p className="font-semibold text-gray-800">Fare</p>
                    <p className="font-bold text-green-600">₹{fare}</p>
                </div>
                <div className="text-sm">
                    <p className="font-semibold text-gray-800">Available Seats</p>
                    <p>20</p>
                </div>
            </div>
        </Link>
    );
};

export default AvailableBusCard;