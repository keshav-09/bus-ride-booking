"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  faEdit,
  faEye,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Vehicle = {
  id: string;
  name: string;
  number: string;
  seats: number;
  type: string;
};

// API Functions
async function fetchVehicles(pageIndex: number, pageSize: number) {
  const response = await fetch(
    `/api/vehicle?page=${pageIndex}&limit=${pageSize}`,
  );
  if (!response.ok) {
    toast.error("Failed to fetch vehicles");
    return { data: [], total: 0 };
  }
  return response.json();
}

async function deleteVehicle(vehicleId: string) {
  const response = await fetch(`/api/vehicle/${vehicleId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete vehicle");
}

export default function VehicleList() {
  const [data, setData] = useState<Vehicle[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchVehicles(pageIndex, pageSize);
        console.log("Fetched Data:", result); 
        setData(result.data);
        setTotal(result.total);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        toast.error("Error loading vehicles");
      }
    };
    fetchData();
  }, [pageIndex, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  const handleDelete = async (vehicleId: string) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle(vehicleId);
        setData((prevData) =>
          prevData.filter((vehicle) => vehicle.id !== vehicleId),
        );
        toast.success("Vehicle deleted successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete vehicle.");
      }
    }
  };

  const handleView = (vehicle: Vehicle) => {
    setVehicle(vehicle);
    setViewMode(true);
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setViewMode(false);
    setVehicle(null);
  };

  const columns: ColumnDef<Vehicle>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "number", header: "Number" },
    { accessorKey: "seats", header: "Seats" },
    { accessorKey: "type", header: "Type" },
    {
      id: "actions", 
      header: "Actions", 
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button onClick={() => handleView(row.original)} variant="outline">
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            onClick={() =>
              router.push(`/dashboard/vehicle/edit/${row.original.id}`)
            }
            variant="outline"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button
            onClick={() => handleDelete(row.original.id)}
            variant="outline"
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination: { pageIndex, pageSize } },
  });

  return (
    <div className="w-full">
      <h2 className="mb-4 text-lg font-semibold">Vehicle List</h2>

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => router.push("/dashboard/vehicle/create")}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Vehicle
        </button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.name}</TableCell>
                  <TableCell>{vehicle.number}</TableCell>
                  <TableCell>{vehicle.seats}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleView(vehicle)}
                        variant="outline"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                      <Button
                        onClick={() =>
                          router.push(`/dashboard/vehicle/create/${vehicle.id}`)
                        }
                        variant="outline"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(vehicle.id)}
                        variant="outline"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No vehicles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm">
          Showing {Math.min((pageIndex - 1) * pageSize + 1, total)}–
          {Math.min(pageIndex * pageSize, total)} of {total} vehicles
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
            disabled={pageIndex === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPageIndex((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={pageIndex === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {isOpen && viewMode && vehicle && (
        <div className="bg-/50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-96 rounded-md bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold">View Vehicle</h3>
            <p>
              <strong>Name:</strong> {vehicle.name}
            </p>
            <p>
              <strong>Number:</strong> {vehicle.number}
            </p>
            <p>
              <strong>Seats:</strong> {vehicle.seats}
            </p>
            <p>
              <strong>Type:</strong> {vehicle.type}
            </p>
            <div className="mt-6 text-right">
              <button
                className="rounded-md bg-gray-500 px-4 py-2 text-white"
                onClick={handleCloseDialog}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
