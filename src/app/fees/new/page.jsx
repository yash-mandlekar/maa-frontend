"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { useStudents } from "@/hooks/api/useStudents";
import { useAdmissions } from "@/hooks/api/useAdmissions";
import { useCreateFee } from "@/hooks/api/useFees";
import {
  IndianRupee,
  Save,
  X,
  Calendar,
  CreditCard,
  User,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

export default function NewFeePage() {
  const router = useRouter();
  const { data: studentsData } = useStudents({ limit: 1000 });
  const { data: admissionsData } = useAdmissions({ limit: 1000 });
  const createFee = useCreateFee();

  const [formData, setFormData] = useState({
    studentType: "student", // "student" or "admission"
    student: "",
    amount: "",
    paymentMode: "cash",
    paymentDate: new Date().toISOString().split("T")[0],
    semester: "",
    academicYear: "",
    feeType: "Tuition Fee",
    status: "Paid",
  });

  // Combine students and admissions for selection
  const allStudents = [
    ...(studentsData?.data?.map((s) => ({
      ...s,
      type: "student",
      displayName: `${s.firstName} ${s.lastName} (Student)`,
    })) || []),
    ...(admissionsData?.data?.map((a) => ({
      ...a,
      type: "admission",
      displayName: `${a.firstName} ${a.lastName} (Admission)`,
    })) || []),
  ];

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
      await createFee.mutateAsync({
        student: formData.student,
        amount: Number(formData.amount),
        registrationPaymentMode: formData.paymentMode,
        payDate: formData.paymentDate,
        semester: formData.semester ? Number(formData.semester) : undefined,
        academicYear: formData.academicYear,
        feeType: formData.feeType,
        payment: Number(formData.amount),
      });

      toast.success("Fee payment recorded successfully");
      router.push("/fees");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to record fee payment"
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-primary rounded-lg p-6 text-white dark:bg-primary-600">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <IndianRupee className="w-6 h-6" />
            Record Fee Payment
          </h1>
          <p className="text-primary-100">
            MAA Computers &gt; Fees &gt; New Payment
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Selection */}
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Student Information
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Student <span className="text-red-500">*</span>
                </label>
                <select
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">Choose a student...</option>
                  {allStudents.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.displayName} -{" "}
                      {student.course?.courseName || "N/A"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Payment Details */}
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-primary" />
                Payment Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fee Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="feeType"
                  value={formData.feeType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="Tuition Fee">Tuition Fee</option>
                  <option value="Registration Fee">Registration Fee</option>
                  <option value="Admission Fee">Admission Fee</option>
                  <option value="Examination Fee">Examination Fee</option>
                  <option value="Library Fee">Library Fee</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Mode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Academic Details */}
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Academic Details (Optional)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Semester
                </label>
                <input
                  type="number"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  min="1"
                  max="8"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="e.g., 1, 2, 3..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Academic Year
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="e.g., 2024-2025"
                />
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <Card>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push("/fees")}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={createFee.isPending}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {createFee.isPending ? "Recording..." : "Record Payment"}
              </button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
