"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { useStudent, useUpdateStudent } from "@/hooks/api/useStudents";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  BookOpen,
  Building2,
  ArrowLeft,
  IndianRupee,
  Edit,
  Save,
  X,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function StudentDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { data: student, isLoading, error } = useStudent(unwrappedParams.id);
  const updateStudent = useUpdateStudent();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        contactNumber: student.contactNumber || "",
        whatsappNumber: student.whatsappNumber || "",
        fatherName: student.fatherName || "",
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: student.gender || "",
        address: student.address || "",
        qualification: student.qualification || "",
        due: student.due || "",
        dueDate: student.dueDate
          ? new Date(student.dueDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateStudent.mutateAsync({
        id: unwrappedParams.id,
        data: formData,
      });
      toast.success("Student updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update student");
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      contactNumber: student.contactNumber || "",
      whatsappNumber: student.whatsappNumber || "",
      fatherName: student.fatherName || "",
      dateOfBirth: student.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: student.gender || "",
      address: student.address || "",
      qualification: student.qualification || "",
      due: student.due || "",
      dueDate: student.dueDate
        ? new Date(student.dueDate).toISOString().split("T")[0]
        : "",
    });
    setIsEditing(false);
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

  if (error || !student) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600">
          Error loading student details: {error?.message || "Student not found"}
        </div>
      </DashboardLayout>
    );
  }

  const studentData = student;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-primary dark:bg-primary-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <User className="w-6 h-6" />
                Student Details
              </h1>
              <p className="text-primary-100">
                MAA Computers &gt; Students &gt; {studentData.firstName}{" "}
                {studentData.lastName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateStudent.isPending}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {updateStudent.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    Edit
                  </button>
                  <button
                    onClick={() => router.push("/students")}
                    className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Students
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Last Updated Info */}
        {studentData.updatedAt && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>
              Last updated:{" "}
              {format(new Date(studentData.updatedAt), "dd MMM yyyy, hh:mm a")}
            </span>
          </div>
        )}

        {/* Basic Information */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Father/Husband Name
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="due"
                    value={formData.due}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter due amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Full Name
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {studentData.firstName} {studentData.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {studentData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Contact Number
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {studentData.contactNumber}
                    </p>
                  </div>
                </div>

                {studentData.whatsappNumber && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        WhatsApp Number
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {studentData.whatsappNumber}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Father/Husband Name
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {studentData.fatherName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Date of Birth
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {studentData.dateOfBirth
                        ? format(
                            new Date(studentData.dateOfBirth),
                            "dd MMM yyyy"
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Gender
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {studentData.gender}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Address
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {studentData.address}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Academic Information */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Academic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Course
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {studentData.course?.courseName || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Qualification
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {studentData.qualification || "N/A"}
                </p>
              </div>
            </div>

            {studentData.university && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    University
                  </p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {studentData.university}
                  </p>
                </div>
              </div>
            )}

            {studentData.session && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Session
                  </p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {studentData.session}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Information */}
        {(studentData.installment || studentData.due) && (
          <Card>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {studentData.installment && (
                <div className="flex items-start gap-3">
                  <IndianRupee className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Installment
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      ₹{studentData.installment}
                    </p>
                  </div>
                </div>
              )}

              {studentData.due && (
                <div className="flex items-start gap-3">
                  <IndianRupee className="w-5 h-5 text-red-600 dark:text-red-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Due Amount
                    </p>
                    <p className="font-medium text-red-600 dark:text-red-400">
                      ₹{studentData.due}
                    </p>
                  </div>
                </div>
              )}

              {studentData.dueDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Due Date
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {format(new Date(studentData.dueDate), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Registration Details */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Registration Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Registration Date
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {studentData.createdAt
                    ? format(
                        new Date(studentData.createdAt),
                        "dd MMM yyyy, hh:mm a"
                      )
                    : "N/A"}
                </p>
              </div>
            </div>

            {studentData.R_no && (
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Registration Number
                  </p>
                  <Badge variant="info">{studentData.R_no}</Badge>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
