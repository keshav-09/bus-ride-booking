"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Route = {
  id: string;
  originId: string;
  originName: string;
  destinationId: string;
  destinationName: string;
  vehicleId: string;
  vehicleName: string;
  arrivalTime: string;
  departureTime: string;
};

async function fetchRoutes(pageIndex: number, pageSize: number) {
  const response = await fetch(
    `/api/routes?page=${pageIndex}&limit=${pageSize}`,
  );
  if (!response.ok) {
    toast.error("Failed to fetch data");
    return { data: [], total: 0 };
  }
  return response.json();
}

async function deleteRoute(routeId: string) {
  const response = await fetch(`/api/routes/${routeId}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete route");
  }
}

export default function TransactionsList() {
  const [data, setData] = useState<Route[]>([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [routeId, setRouteId] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchRoutes(pageIndex, pageSize);
        console.log(result, "data ");
        setData(result.data);
        setTotal(result.total);
      } catch (err) {
        console.error(err);
        toast.error("Error loading data");
      }
    };
    fetchData();
  }, [pageIndex, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  const handleOpenDialog = (route: Route) => {
    setRouteId(route.id);
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setRouteId("");
  };

  const handleDelete = async (routeId: string) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await deleteRoute(routeId);
        setData((prevData) => prevData.filter((route) => route.id !== routeId));
        toast.success("Route deleted successfully!");
      } catch (error) {
        toast.error("An error occurred while deleting the route.");
      }
    }
  };

  const handleAdd = () => {
    router.push("/dashboard/route/create");
  };

  const handleEdit = (route: Route) => {
    router.push(`/dashboard/route/create/${route.id}`);
  };

  const columns: ColumnDef<Route>[] = [
    {
      accessorKey: "origin",
      header: "Origin",
      cell: ({ row }) => <div>{row.getValue("origin")?.name}</div>,
    },
    {
      accessorKey: "destination",
      header: "Destination",
      cell: ({ row }) => <div>{row.getValue("destination")?.name}</div>,
    },
    {
      accessorKey: "vehicle",
      header: "Vehicle",
      cell: ({ row }) => <div>{row.getValue("vehicle")?.name}</div>,
    },
    {
      accessorKey: "arrivalTime",
      header: "Arrival Time",
      cell: ({ row }) => <div>{row.getValue("arrivalTime")}</div>,
    },
    {
      accessorKey: "departureTime",
      header: "Departure Time",
      cell: ({ row }) => <div>{row.getValue("departureTime")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => handleOpenDialog(row.original)}
            variant="outline"
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button onClick={() => handleEdit(row.original)} variant="outline">
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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility: {
        actions: true,
      },
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <h2 className="mb-4 text-lg font-semibold">Route List</h2>

      <div className="mb-4 flex justify-end">
        <button
          onClick={handleAdd}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Add Route
        </button>
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
                      : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Displaying all data */}
        {/* <div>
          <h2>All Table Data:</h2>
          <pre>{JSON.stringify(table.getRowModel().rows, null, 2)}</pre>
        </div> */}
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm">
          Showing {Math.min((pageIndex - 1) * pageSize + 1, total)}–
          {Math.min(pageIndex * pageSize, total)} of {total} results
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
          {pageIndex > 3 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex(1)}
              >
                1
              </Button>
              {pageIndex > 4 && <span className="text-gray-500">...</span>}
            </>
          )}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = Math.max(1, pageIndex - 2) + i;
            if (page > totalPages) return null;
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
          {pageIndex < totalPages - 2 && (
            <>
              {pageIndex < totalPages - 3 && (
                <span className="text-gray-500">...</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
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

      {/* View Route Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-md bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold">View Route</h3>
            <div>
              {/* <p>
                <strong>Route ID:</strong> {routeId}
              </p> */}
              <p>
                <strong>Origin Name:</strong>{" "}
                {data.find((route) => route.id === routeId)?.origin?.name}
              </p>
              <p>
                <strong>Destination Name:</strong>{" "}
                {data.find((route) => route.id === routeId)?.destination?.name}
              </p>
              <p>
                <strong>Vehicle Name:</strong>{" "}
                {data.find((route) => route.id === routeId)?.vehicle?.name}
              </p>

              <p>
                <strong>Arrival Time:</strong>{" "}
                {data.find((route) => route.id === routeId)?.arrivalTime}
              </p>
              <p>
                <strong>Departure Time:</strong>{" "}
                {data.find((route) => route.id === routeId)?.departureTime}
              </p>
            </div>
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
