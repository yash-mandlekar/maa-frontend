"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { useSearchStudents } from "@/hooks/api/useStudents";
import { useCreateFee } from "@/hooks/api/useFees";
import {
  IndianRupee,
  Save,
  X,
  Calendar,
  CreditCard,
  User,
  BookOpen,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export default function NewFeePage() {
  const router = useRouter();
  const createFee = useCreateFee();
  const dropdownRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { data: searchResults, isLoading: isSearching } =
    useSearchStudents(searchQuery);

  const [formData, setFormData] = useState({
    studentType: "student",
    student: "",
    amount: "",
    paymentMode: "cash",
    paymentDate: new Date().toISOString().split("T")[0],
    semester: "",
    academicYear: "",
    feeType: "Tuition Fee",
    status: "Paid",
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setFormData((prev) => ({
      ...prev,
      student: student._id,
      studentType: student.type,
    }));
    setSearchQuery("");
    setShowDropdown(false);
  };

  const clearSelectedStudent = () => {
    setSelectedStudent(null);
    setFormData((prev) => ({
      ...prev,
      student: "",
      studentType: "student",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.student) {
      toast.error("Please select a student");
      return;
    }

    const amount = Number(formData.amount);
    if (!amount || amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

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
              <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Student <span className="text-red-500">*</span>
                </label>

                {selectedStudent ? (
                  <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedStudent.displayName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedStudent.courseName} •{" "}
                        {selectedStudent.type === "student"
                          ? "Student"
                          : "Admission"}{" "}
                        • {selectedStudent.contactNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearSelectedStudent}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Search by name or contact number..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>

                    {/* Search Results Dropdown */}
                    {showDropdown && searchQuery.length >= 2 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {isSearching ? (
                          <div className="p-3 text-center text-gray-500">
                            Searching...
                          </div>
                        ) : searchResults?.data?.length > 0 ? (
                          searchResults.data.map((student) => (
                            <button
                              key={student._id}
                              type="button"
                              onClick={() => handleStudentSelect(student)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            >
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {student.displayName}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {student.courseName} •{" "}
                                {student.type === "student"
                                  ? "Student"
                                  : "Admission"}{" "}
                                • {student.contactNumber}
                              </p>
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-center text-gray-500">
                            No students found
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
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
