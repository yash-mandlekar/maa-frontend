"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { useCreateInquiry } from "@/hooks/api/useInquiries";
import { useCourses, useShortCourses } from "@/hooks/api/useCourses";
import { MessageSquare, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewInquiryPage() {
  const router = useRouter();
  const createInquiry = useCreateInquiry();
  const { data: diplomaCourses } = useCourses();
  const { data: admissionCourses } = useShortCourses();

  const [formData, setFormData] = useState({
    inquiryType: "student", // Default to diploma
    firstName: "",
    lastName: "",
    email: "",
    fatherName: "",
    contactNumber: "",
    courseId: "",
    courseName: "",
    qualification: "",
    address: "",
  });

  // Determine which courses to show based on inquiry type
  const availableCourses =
    formData.inquiryType === "admission" ? admissionCourses : diplomaCourses;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Reset course selection when inquiry type changes
      if (name === "inquiryType") {
        newData.courseId = "";
        newData.courseName = "";
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Find the selected course name
      const selectedCourse = availableCourses?.find(
        (c) => c._id === formData.courseId
      );

      await createInquiry.mutateAsync({
        inquiryType: formData.inquiryType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        fatherName: formData.fatherName,
        contactNumber: formData.contactNumber,
        course: formData.courseId,
        courseModelType:
          formData.inquiryType === "admission" ? "ShortCourse" : "Course",
        qualification: formData.qualification,
        address: formData.address,
      });
      toast.success("Inquiry created successfully");
      router.push("/inquiries");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create inquiry");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-primary rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Add New Enquiry
          </h1>
          <p className="text-primary-100">
            MAA Computers &gt; Inquiries &gt; New
          </p>
        </div>

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Inquiry Type Radio Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Inquiry Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="inquiryType"
                    value="student"
                    checked={formData.inquiryType === "student"}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    Diploma
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="inquiryType"
                    value="admission"
                    checked={formData.inquiryType === "admission"}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    Admission
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter First Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Student Surname */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student Surname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter Last Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter Email Address"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Father/Husband Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name of Father / Husband{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                  placeholder="Enter Name Of Father / Husband"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Contact Number */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number / WhatsApp Number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter Contact Number"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Course Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Course <span className="text-red-500">*</span>
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Choose a course...</option>
                  {availableCourses?.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.inquiryType === "admission"
                    ? "Showing short-term courses for admission"
                    : "Showing diploma courses"}
                </p>
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  placeholder="Enter Qualification"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Permanent Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Address"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={() => router.push("/inquiries")}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={createInquiry.isPending}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {createInquiry.isPending ? "Saving..." : "Create Enquiry"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
