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
import { useShortCourses, useDeleteCourse } from "@/hooks/api/useCourses";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  IndianRupee,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ShortTermCoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: courses, isLoading, error } = useShortCourses();
  const deleteCourse = useDeleteCourse();

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this short-term course?")) {
      try {
        await deleteCourse.mutateAsync(id);
        toast.success("Short-term course deleted successfully");
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
          Error loading short-term courses: {error.message}
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
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Short-Term Courses
            </h1>
            <p className="text-primary-100">MAA Computers &gt; Short Courses</p>
          </div>
          <button
            onClick={() => router.push("/short-courses/new")}
            className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Short Course
          </button>
        </div>

        {/* Info Card */}
        <Card className="border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-800">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1" />
            <div>
              <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-1">
                About Short-Term Courses
              </h3>
              <p className="text-sm text-primary-700 dark:text-primary-300">
                Short-term courses are intensive programs designed for quick
                skill development. These courses typically range from a few
                weeks to a few months and focus on specific skills or
                technologies.
              </p>
            </div>
          </div>
        </Card>

        {/* Search */}
        <Card>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search short-term courses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-primary-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Short Courses
                </p>
              </div>
              <p className="text-2xl font-bold text-primary-600">
                {courses?.length || 0}
              </p>
            </div>
          </Card>
          <Card className="border-blue-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg. Duration
                </p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {courses?.length > 0
                  ? Math.round(
                      courses.reduce(
                        (acc, c) => acc + (c.courseDuration || 0),
                        0
                      ) / courses.length
                    )
                  : 0}{" "}
                weeks
              </p>
            </div>
          </Card>
          <Card className="border-green-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <IndianRupee className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg. Fee
                </p>
              </div>
              <p className="text-2xl font-bold text-green-600">
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

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Card
                key={course._id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="space-y-4">
                  {/* Course Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {course.courseName}
                        </h3>
                        {course.courseCode && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {course.courseCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Duration
                      </span>
                      <Badge variant="info">
                        {course.courseDuration} weeks
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        Fee
                      </span>
                      <span className="font-semibold text-green-600">
                        ₹{course.courseFee?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {course.courseDescription && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {course.courseDescription}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t dark:border-gray-700">
                    <button
                      onClick={() =>
                        router.push(`/short-courses/${course._id}`)
                      }
                      className="flex-1 px-3 py-2 text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      disabled={deleteCourse.isPending}
                      className="px-3 py-2 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Zap className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                  <p className="text-lg font-medium">
                    No short-term courses found
                  </p>
                  <p className="text-sm mt-1">
                    Add your first short-term course to get started
                  </p>
                  <button
                    onClick={() => router.push("/short-courses/new")}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Short Course
                  </button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
