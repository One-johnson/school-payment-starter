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
import { Badge } from "@/components/ui/badge";

import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useTeacherStore } from "@/app/store/useTeacherStore";
import { useClassStore } from "@/app/store/useClassStore";
import { useModalStore } from "@/app/store/useModalStore";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "sonner";

export default function TeacherTable() {
  const { teachers, fetchTeachers, deleteTeacher, loading } = useTeacherStore();
  const { classes, fetchClasses } = useClassStore();
  const { open } = useModalStore();

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "experience">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!selectedId) return;
    setIsDeleting(true);
    try {
      await deleteTeacher(selectedId);
      toast.success("Teacher deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedId(null);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, [fetchTeachers, fetchClasses]);

  const filtered = useMemo(() => {
    return teachers
      .filter((t) => {
        const matchesSearch = t.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesClass =
          filterClass === "all" ||
          t.teacher?.teaches?.some((c) => c.id === filterClass);
        return matchesSearch && matchesClass;
      })
      .sort((a, b) => {
        const valA =
          sortBy === "name" ? a.name : a.teacher?.yearsOfExperience || 0;
        const valB =
          sortBy === "name" ? b.name : b.teacher?.yearsOfExperience || 0;
        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [teachers, search, filterClass, sortBy, sortDir]);

  const handleEdit = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (teacher) {
      open({ type: "editTeacher", teacherData: teacher });
    }
  };

  return (
    <>
      <Card>
        <CardHeader />
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <Input
              placeholder="Search teacher name..."
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
                      setSortDir(isSame && sortDir === "asc" ? "desc" : "asc");
                    }}
                    className="cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortBy === "name" &&
                        (sortDir === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Classes</TableHead>
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
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-28" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-6 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : filtered.length > 0 ? (
                  filtered.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {t.name}
                          <Badge variant="outline" className="text-xs">
                            {t.role}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{t.email}</TableCell>
                      <TableCell>
                        {t.teacher?.yearsOfExperience ?? "—"}
                      </TableCell>
                      <TableCell>
                        {t.teacher?.teaches?.length ? (
                          <span className="text-sm text-muted-foreground">
                            {t.teacher.teaches.map((c) => c.name).join(", ")}
                          </span>
                        ) : (
                          "—"
                        )}
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
                            className="bg-gray-950"
                          >
                            <DropdownMenuItem onClick={() => handleEdit(t.id)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedId(t.id);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              Delete
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
                      No teachers found
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
        title="Delete Teacher?"
        description="This action will permanently delete the teacher and their assignments."
      />
    </>
  );
}
