"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useModalStore } from "@/app/store/useModalStore";
import { useStudentStore } from "@/app/store/useStudentStore";
import { useClassStore } from "@/app/store/useClassStore";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "sonner";

export default function StudentTable() {
  const { students, fetchStudents, deleteStudent, loading } = useStudentStore();
  const { classes, fetchClasses } = useClassStore();
  const { open } = useModalStore();

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "email">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!selectedId) return;
    setIsDeleting(true);
    try {
      await deleteStudent(selectedId);
      toast.success("Student deleted successfully");
    } catch {
      toast.error("Failed to delete student");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedId(null);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [fetchStudents, fetchClasses]);

  const filtered = useMemo(() => {
    return students
      .filter((student) => {
        const matchSearch = student.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchClass =
          filterClass === "all" || student.classId === filterClass;
        return matchSearch && matchClass;
      })
      .sort((a, b) => {
        const valA = sortBy === "name" ? a.name : a.email;
        const valB = sortBy === "name" ? b.name : b.email;
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [students, search, filterClass, sortBy, sortDirection]);

  return (
    <>
      <Card>
        <CardHeader />
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <Input
              placeholder="Search student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-1/2"
            />

            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent className="bg-gray-950">
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => {
                      const isSame = sortBy === "name";
                      setSortBy("name");
                      setSortDirection(
                        isSame && sortDirection === "asc" ? "desc" : "asc"
                      );
                    }}
                    className="cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortBy === "name" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Parent Phone</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Guardian Name</TableHead>
                  <TableHead>Repeating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        {Array(8)
                          .fill(0)
                          .map((_, j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                ) : filtered.length > 0 ? (
                  filtered.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.trackingId}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.parentPhone ?? "—"}</TableCell>
                      <TableCell>
                        {student.class ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="underline cursor-pointer text-blue-600">
                                  {student.class.name}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-950 p-4">
                                <div>
                                  <strong>Class ID: </strong>
                                  {student.class.trackingId}
                                </div>
                                <div>
                                  <strong>Teacher: </strong>
                                  {student.class.teacher?.name ?? "—"}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>{student.guardianName ?? "—"}</TableCell>
                      <TableCell>
                        {student.isRepeating ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button>
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-gray-950 p-1 rounded-md space-y-1 border border-gray-700"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                open({ type: "editStudent", data: student })
                              }
                              className="hover:bg-green-900/20 text-green-600 cursor-pointer rounded-md px-2 py-1 flex items-center space-x-2"
                            >
                              <Pencil className="h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedId(student.id);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600 hover:bg-red-900/20 cursor-pointer rounded-md px-2 py-1 flex items-center space-x-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground"
                    >
                      No students found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Student?"
        description="This will permanently remove the student from your system."
      />
    </>
  );
}
