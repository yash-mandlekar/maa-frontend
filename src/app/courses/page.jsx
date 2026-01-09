"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { useCourses, useDeleteCourse } from "@/hooks/api/useCourses";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  IndianRupee,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: courses, isLoading, error } = useCourses();
  const deleteCourse = useDeleteCourse();

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse.mutateAsync(id);
        toast.success("Course deleted successfully");
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600">
          Error loading courses: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  const filteredCourses = courses?.filter((course) => {
    return (
      course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-primary rounded-lg p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Courses Management</h1>
            <p className="text-primary-100">MAA Computers &gt; Courses</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/short-courses")}
              className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Short Courses
            </button>
            <button
              onClick={() => router.push("/courses/new")}
              className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Course
            </button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-blue-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">Total Courses</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {courses?.length || 0}
              </p>
            </div>
          </Card>
          <Card className="border-green-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600">Avg. Duration</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {courses?.length > 0
                  ? Math.round(
                      courses.reduce(
                        (acc, c) => acc + (parseInt(c.courseDuration) || 0),
                        0
                      ) / courses.length
                    )
                  : 0}{" "}
                months
              </p>
            </div>
          </Card>
          <Card className="border-purple-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <IndianRupee className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-gray-600">Avg. Fee</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                ₹
                {courses?.length > 0
                  ? Math.round(
                      courses.reduce((acc, c) => acc + (c.courseFee || 0), 0) /
                        courses.length
                    ).toLocaleString()
                  : 0}
              </p>
            </div>
          </Card>
        </div>

        {/* Courses Table */}
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              All Courses
            </h2>
          </div>
          <Table>
            <TableHeader>
              <tr>
                <TableHead>S.No.</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duration
                </TableHead>
                <TableHead>
                  <IndianRupee className="w-4 h-4 inline mr-1" />
                  Fee
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredCourses && filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <TableRow key={course._id}>
                    <TableCell className="text-primary font-semibold">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{course.courseName}</p>
                          <p className="text-xs text-gray-500">
                            {course.courseCode || "N/A"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">
                        {course.courseDuration} months
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ₹{course.courseFee?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate">
                      {course.courseDescription || "No description"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/courses/${course._id}`)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                          disabled={deleteCourse.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="6"
                    className="text-center py-8 text-gray-500"
                  >
                    No courses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
