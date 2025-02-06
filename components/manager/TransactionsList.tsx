"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  faEdit,
  faEye,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";



export type Manager = {
  id: string;
  name: string;
  email: string;
};


async function fetchManagers(pageIndex: number, pageSize: number) {
  const response = await fetch(
    `/api/managers?page=${pageIndex}&limit=${pageSize}`,
  );
  if (!response.ok) {
    toast.error("Failed to fetch data");
  }
  return response.json();
}



async function deleteManager(managerId: string) {
  const response = await fetch(`/api/managers/${managerId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete manager");
  }
}

export default function TransactionsList() {
  const [data, setData] = useState<Manager[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [managerId, setManagerId] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pageIndex, setPageIndex] = useState(1); 
  const [pageSize, setPageSize] = useState(10); 
  const [total, setTotal] = useState(0); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchManagers(pageIndex, pageSize);
        setData(result.data);
        setTotal(result.total); 
      } catch (err) {
        console.error(err);
        setError("Error loading data");
      }
    };

    fetchData();
  }, [pageIndex, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setManagerName("");
    setManagerEmail("");
    setError("");
    setSuccess("");
    setEditMode(false);
    setViewMode(false);
  };

  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   try {
  //     if (editMode) {
  //       const updatedData = await updateManager(managerId, managerName, managerEmail);
  //       setSuccess('Manager updated successfully');
  //       setData((prevData) => prevData.map(manager => manager.id === managerId ? updatedData : manager));
  //     } else {
  //       const newManager = await addManager(managerName, managerEmail);
  //       setSuccess('Manager added successfully');
  //       setData((prevData) => [...prevData, newManager]);
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     setError('An error occurred');
  //   } finally {
  //     handleCloseDialog();
  //   }
  // };

  const handleEdit = (manager: Manager) => {
    setEditMode(true);
    setManagerId(manager.id);
    setManagerName(manager.name);
    setManagerEmail(manager.email);
    setIsOpen(true);
  };

  const handleView = (manager: Manager) => {
    setViewMode(true);
    setManagerId(manager.id);
    setManagerName(manager.name);
    setManagerEmail(manager.email);
    setIsOpen(true);
  };

  const handleDelete = async (managerId: string) => {
    if (window.confirm("Are you sure you want to delete this manager?")) {
      try {
        await deleteManager(managerId);
        setData((prevData) =>
          prevData.filter((manager) => manager.id !== managerId),
        );
        toast.success("Manager deleted successfully!");
      } catch (error) {
        console.error("Error deleting manager:", error);
        toast.error("An error occurred while deleting the manager.");
      }
    }
  };

  const router = useRouter();
  const handleAdd = () => {
    router.push("/dashboard/manager/create"); // Navigate to the correct path
  };

  // const handleEditF = (manager: Manager) => {
  //   const encodedName = encodeURIComponent(manager.name);
  //   const encodedEmail = encodeURIComponent(manager.email);
  //   // Redirect to the edit page with the correct ID and query parameters
  //   router.push(`/dashboard/manager/create/${manager.id}?name=${encodedName}&email=${encodedEmail}`);
  // };
  const handleEditF = (manager: Manager) => {
    const query = new URLSearchParams({
      name: manager.name,
      email: manager.email,
    }).toString();

    const url = `/dashboard/manager/create/${manager.id}?${query}`;
    router.push(url);
  };

  const columns: ColumnDef<Manager>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button onClick={() => handleView(row.original)} variant="outline">
            <FontAwesomeIcon icon={faEye} />
          </Button>
          {/* <Button onClick={() => handleEdit(row.original)} variant="outline">
            <FontAwesomeIcon icon={faEdit} />
          </Button> */}
          <Button onClick={() => handleEditF(row.original)} variant="outline">
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
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <h2 className="mb-4 text-lg font-semibold">Manager List</h2>

      <div className="mb-4 flex justify-end">
        {/* <button
          onClick={handleOpenDialog}
          className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background select-none bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 rounded-md "
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Manager
        </button> */}
        <button
          onClick={handleAdd}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Add Manager
        </button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
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
      </div>

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
          {Array.from(
            { length: Math.min(5, totalPages) },
            (_, i) => {
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
            },
          )}
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
      {isOpen && (
        <div className="bg-/50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-96 rounded-md bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold">View Manager</h3>
            <p>
              <strong>Name:</strong> {managerName}
            </p>
            <p>
              <strong>Email:</strong> {managerEmail}
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
