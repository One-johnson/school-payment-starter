import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import { MoreVertical } from "lucide-react";
import { useClassStore } from "@/app/store/useClassStore";
import { useTeacherStore } from "@/app/store/useTeacherStore";
import { useModalStore } from "@/app/store/useModalStore";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function ClassTable() {
  const { classes, fetchClasses, loading, deleteClass, getClassById } =
    useClassStore();
  const { teachers, fetchTeachers } = useTeacherStore();
  const { open } = useModalStore();

  const [search, setSearch] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("all");

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, [fetchClasses, fetchTeachers]);

  const filtered = useMemo(() => {
    return classes.filter((klass) => {
      const matchSearch = klass.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchTeacher =
        filterTeacher === "all" || klass.teacher?.id === filterTeacher;
      return matchSearch && matchTeacher;
    });
  }, [classes, search, filterTeacher]);

  const handleEdit = async (id: string) => {
    await getClassById(id); // loads selectedClass
    const selected = classes.find((c) => c.id === id);
    if (selected) open({ type: "editClass", data: selected });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClass(id);
      toast.success("Class deleted successfully");
    } catch {
      toast.error("Failed to delete class");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Classes</CardTitle>
      </CardHeader>
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
            <SelectContent>
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
                <TableHead>Name</TableHead>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Students</TableHead>
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
                        <div className="flex items-center gap-2">
                          <span>{klass.teacher.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {klass.teacher.role}
                          </Badge>
                        </div>
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
                          <TooltipContent className="max-w-lg bg-slate-800">
                            {klass.students?.length ? (
                              <ul className="text-sm space-y-1">
                                {klass.students.map((s) => (
                                  <li key={s.id}>{s.name}</li>
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
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(klass.id)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(klass.id)}
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
                    No classes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
