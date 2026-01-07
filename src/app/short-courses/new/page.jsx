"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { useCreateShortCourse } from "@/hooks/api/useCourses";
import { Zap, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewShortCoursePage() {
  const router = useRouter();
  const createShortCourse = useCreateShortCourse();

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    courseDuration: "",
    courseFee: "",
    courseDescription: "",
  });

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
      await createShortCourse.mutateAsync({
        ...formData,
        courseDuration: Number(formData.courseDuration),
        courseFee: Number(formData.courseFee),
      });
      toast.success("Short-term course created successfully");
      router.push("/courses/short-term");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create short-term course"
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-primary rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Add New Short-Term Course
          </h1>
          <p className="text-primary-100">
            MAA Computers &gt; Short Courses &gt; New
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-purple-200 bg-purple-50">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-purple-600 mt-1" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-1">
                Short-Term Course Guidelines
              </h3>
              <p className="text-sm text-purple-700">
                Short-term courses are typically measured in weeks rather than
                months. These intensive programs focus on specific skills and
                are designed for quick learning outcomes.
              </p>
            </div>
          </div>
        </Card>

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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Web Development Bootcamp"
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
                  placeholder="e.g., WDB-101"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Weeks) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="courseDuration"
                  value={formData.courseDuration}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., 8"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter duration in weeks for short-term courses
                </p>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., 15000"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter course description, learning outcomes, and key topics..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => router.push("/short-courses")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={createShortCourse.isPending}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {createShortCourse.isPending
                  ? "Saving..."
                  : "Save Short Course"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
