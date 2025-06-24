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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import {
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useClassStore } from "@/app/store/useClassStore";
import { useTeacherStore } from "@/app/store/useTeacherStore";
import { useModalStore } from "@/app/store/useModalStore";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ClassTable() {
  const { classes, fetchClasses, loading, deleteClass, getClassById } =
    useClassStore();
  const { teachers, fetchTeachers } = useTeacherStore();
  const { open } = useModalStore();

  const [search, setSearch] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "students">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!selectedId) return;
    setIsDeleting(true);
    try {
      await deleteClass(selectedId);
      toast.success("Class deleted successfully");
    } catch {
      toast.error("Failed to delete class");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedId(null);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, [fetchClasses, fetchTeachers]);

  const filtered = useMemo(() => {
    const result = classes
      .filter((klass) => {
        const matchSearch = klass.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchTeacher =
          filterTeacher === "all" || klass.teacher?.id === filterTeacher;
        return matchSearch && matchTeacher;
      })
      .sort((a, b) => {
        const valA = sortBy === "name" ? a.name : a.students?.length || 0;
        const valB = sortBy === "name" ? b.name : b.students?.length || 0;

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });

    return result;
  }, [classes, search, filterTeacher, sortBy, sortDirection]);

  const handleEdit = async (id: string) => {
    await getClassById(id);
    const selected = classes.find((c) => c.id === id);
    if (selected) open({ type: "editClass", data: selected });
  };

  return (
    <>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <Input
              placeholder="Search class name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-1/2"
            />

            <Select value={filterTeacher} onValueChange={setFilterTeacher}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>
              <SelectContent className="bg-gray-950">
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
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
                  <TableHead>Class ID</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead
                    onClick={() => {
                      const isSame = sortBy === "students";
                      setSortBy("students");
                      setSortDirection(
                        isSame && sortDirection === "asc" ? "desc" : "asc"
                      );
                    }}
                    className="cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      Students
                      {sortBy === "students" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-6 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : filtered.length > 0 ? (
                  filtered.map((klass) => (
                    <TableRow key={klass.id}>
                      <TableCell>{klass.name}</TableCell>
                      <TableCell>{klass.trackingId}</TableCell>
                      <TableCell>
                        {klass.teacher ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2 cursor-pointer underline text-blue-600">
                                  <span>{klass.teacher.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {klass.teacher.role}
                                  </Badge>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-slate-800 text-sm max-w-sm space-y-1">
                                <div>
                                  <strong>Name:</strong> {klass.teacher.name}
                                </div>
                                <div>
                                  <strong>Email:</strong>{" "}
                                  {klass.teacher.email || "—"}
                                </div>

                                <div>
                                  <strong>Certification:</strong>{" "}
                                  {klass.teacher.certification || "—"}
                                </div>
                                <div>
                                  <strong>Experience:</strong>{" "}
                                  {klass.teacher.yearsOfExperience ?? "—"} years
                                </div>
                                <div>
                                  <strong>Bio:</strong>{" "}
                                  {klass.teacher.bio || "—"}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-pointer underline text-blue-600">
                                {klass.students?.length ?? 0}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-lg max-h-80  bg-gray-950 text-white p-4 rounded">
                              {klass.students && klass.students.length > 0 ? (
                                <ul className="text-xs space-y-2">
                                  {klass.students.map((student) => (
                                    <li key={student.id} className="space-y-1">
                                      <div>
                                        <strong>Student ID: </strong>
                                        {student.id}
                                      </div>
                                      <div>
                                        <strong>Student Name: </strong>
                                        {student.name ?? "—"}
                                      </div>
                                      <div>
                                        <strong>Phone: </strong>
                                        {student.parentPhone ?? "—"}
                                      </div>
                                      <div>
                                        <strong>Guardian: </strong>
                                        {student.guardianName ?? "—"}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span>No students</span>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                              onClick={() => handleEdit(klass.id)}
                              className="hover:bg-green-900/20 text-green-600 cursor-pointer rounded-md px-2 py-1 flex items-center space-x-2"
                            >
                              <Pencil className="h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedId(klass.id);
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
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No classes found
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
        title="Delete Class?"
        description="This action will permanently delete the class and all related data."
      />
    </>
  );
}
