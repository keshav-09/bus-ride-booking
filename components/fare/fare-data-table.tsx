'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";

export function DataTableDemo() {
  const [data, setData] = useState<Fare[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [fromLocation, setfromLocation] = useState("");
  const [toLocation, settoLocation] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const router = useRouter();

  const totalPages = Math.ceil(total / pageSize);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/api/fare/List-fare?page=${pageIndex}&limit=${pageSize}`
      );
      if (!response.ok) throw new Error("Failed to fetch fares");
      const { data, total } = await response.json();  

      const formattedData = data.map((fare: any) => ({
        id: fare.id,
        routeId: fare.routeId,
        fromLocation: fare.origin?.name || fare.fromLocationId,
        toLocation: fare.destination?.name || fare.toLocationId,
        price: fare.price,
        departureTime:fare.route.departureTime,
      }));
      setData(formattedData);
      setTotal(total);  
    } catch (error) {
      setError("Failed to fetch fares");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/fare/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setData((prevData) => prevData.filter(fare => fare.id !== id));
        toast.success('Location deleted successfully!');
      } else {
        setError('Failed to delete fare');
      }
    } catch (error) {
      setError('An error occurred while deleting');
    }
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setfromLocation("");
    settoLocation("");
    setError("");
    setEditMode(false);
    setViewMode(false);
  };

  type Fare = {
    id: string;
    routeId: string;
    fromLocationId: string;
    toLocationId: string;
    fromLocation?: string; 
    toLocation?: string;   
    price: number;
    departureTime: number;
  };

  const handleEditF = async (updatedFare: Fare) => {
    setData((prevData) =>
      prevData.map((fare) =>
        fare.id === updatedFare.id ? { ...fare, ...updatedFare } : fare
      )
    );

    const url = `/fare/create/${updatedFare.id}`;
    const params = new URLSearchParams({
      fromLocation: updatedFare.fromLocation || "",
      toLocation: updatedFare.toLocation || "",
      price: updatedFare.price.toString(),
    }).toString();

    const response = await fetch(`/api/fare/${updatedFare.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFare),
    });

    if (response.ok) {
      fetchData();
    } else {
      setError("Failed to update fare");
    }

    router.push(`${url}?${params}`);
  };

  const columns: ColumnDef<Fare>[] = [
    {
      accessorKey: "routeId",
      header: "Route",
    },
    {
      accessorKey: "fromLocation",
      header: "From Location",
    },
    {
      accessorKey: "toLocation",
      header: "To Location",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "actions",
      header: "Actions",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex items-center justify-end py-4">
        <Button className="max-w-sm" onClick={() => router.push("/fare/addForm")}>
          Add Fare
        </Button>
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
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((fare) => (
                <TableRow key={fare.id}>
                   <TableCell>
                  {fare.fromLocation && fare.toLocation
                    ? `${fare.fromLocation} to ${fare.toLocation} - Departs at ${fare.departureTime}`
                    : "N/A"}
                </TableCell>       
                  <TableCell>{fare.fromLocation}</TableCell>
                  <TableCell>{fare.toLocation}</TableCell>
                  <TableCell>{fare.price}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="link"
                        onClick={() => {
                          setfromLocation(fare.fromLocation || "");
                          settoLocation(fare.toLocation || "");
                          setViewMode(true);
                          setIsOpen(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                      <Button variant="link" onClick={() => handleDelete(fare.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm">
          Showing {Math.min((pageIndex - 1) * pageSize + 1, total)}–{Math.min(pageIndex * pageSize, total)} of {total} results
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
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                variant={pageIndex === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPageIndex(page)}
              >
                {page}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages))}
            disabled={pageIndex === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-md bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold">
              {viewMode ? "View Fare" : editMode ? "Edit Fare" : ""}
            </h3>
            {viewMode && (
              <>
                <p>
                  <strong>From Location:</strong> {fromLocation}
                </p>
                <p>
                  <strong>To Location:</strong> {toLocation}
                </p>
              </>
            )}
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