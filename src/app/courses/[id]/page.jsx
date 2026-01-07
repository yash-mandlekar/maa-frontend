"use client";

import { useState, useEffect, use } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useCourse, useUpdateCourse } from "@/hooks/api/useCourses";
import { BookOpen, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditCoursePage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: course, isLoading, error } = useCourse(id);
  const updateCourse = useUpdateCourse();

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    courseDuration: "",
    courseFee: "",
    courseDescription: "",
  });

  useEffect(() => {
    if (course) {
      setFormData({
        courseName: course.courseName || "",
        courseCode: course.courseCode || "",
        courseDuration: course.courseDuration || "",
        courseFee: course.courseFee || "",
        courseDescription: course.courseDescription || "",
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateCourse.mutateAsync({
        id,
        ...formData,
        courseDuration: Number(formData.courseDuration),
        courseFee: Number(formData.courseFee),
      });
      toast.success("Course updated successfully");
      router.push("/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update course");
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
          Error loading course: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-primary rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Edit Course
          </h1>
          <p className="text-primary-100">
            MAA Computers &gt; Courses &gt; Edit
          </p>
        </div>

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Diploma in Computer Applications"
                />
              </div>

              {/* Course Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Code
                </label>
                <input
                  type="text"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., DCA-101"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Months) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="courseDuration"
                  value={formData.courseDuration}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 12"
                />
              </div>

              {/* Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Fee (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="courseFee"
                  value={formData.courseFee}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 25000"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description
              </label>
              <textarea
                name="courseDescription"
                value={formData.courseDescription}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter course description..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => router.push("/courses")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateCourse.isPending}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {updateCourse.isPending ? "Updating..." : "Update Course"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
