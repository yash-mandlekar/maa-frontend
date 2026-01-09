"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { useAdmission, useUpdateAdmission } from "@/hooks/api/useAdmissions";
import {
  User,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  BookOpen,
  ArrowLeft,
  IndianRupee,
  Users,
  Edit,
  Save,
  X,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdmissionDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const {
    data: admission,
    isLoading,
    error,
  } = useAdmission(unwrappedParams.id);
  const updateAdmission = useUpdateAdmission();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (admission?.data) {
      const data = admission.data;
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        contactNumber: data.contactNumber || "",
        fatherName: data.fatherName || "",
        motherName: data.motherName || "",
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: data.gender || "",
        qualification: data.qualification || "",
        address: data.address || "",
        due: data.due || "",
        dueDate: data.dueDate
          ? new Date(data.dueDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [admission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateAdmission.mutateAsync({
        id: unwrappedParams.id,
        ...formData,
      });
      toast.success("Admission updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update admission"
      );
    }
  };

  const handleCancel = () => {
    if (admission?.data) {
      const data = admission.data;
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        contactNumber: data.contactNumber || "",
        fatherName: data.fatherName || "",
        motherName: data.motherName || "",
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: data.gender || "",
        qualification: data.qualification || "",
        address: data.address || "",
        due: data.due || "",
        dueDate: data.dueDate
          ? new Date(data.dueDate).toISOString().split("T")[0]
          : "",
      });
    }
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

  if (error || !admission) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600">
          Error loading admission details:{" "}
          {error?.message || "Admission not found"}
        </div>
      </DashboardLayout>
    );
  }

  const admissionData = admission.data;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-primary dark:bg-primary-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                Admission Details
              </h1>
              <p className="text-primary-100">
                MAA Computers &gt; Admissions &gt; {admissionData.firstName}{" "}
                {admissionData.lastName}
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
                    disabled={updateAdmission.isPending}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {updateAdmission.isPending ? "Saving..." : "Save Changes"}
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
                    onClick={() => router.push("/admission")}
                    className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Admissions
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Last Updated Info */}
        {admissionData.updatedAt && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>
              Last updated:{" "}
              {format(
                new Date(admissionData.updatedAt),
                "dd MMM yyyy, hh:mm a"
              )}
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
                    Father's Name
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
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
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
                <div>
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
                      {admissionData.firstName} {admissionData.lastName}
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
                      {admissionData.contactNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Father's Name
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {admissionData.fatherName}
                    </p>
                  </div>
                </div>

                {admissionData.motherName && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mother's Name
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {admissionData.motherName}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Date of Birth
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {admissionData.dateOfBirth
                        ? format(
                            new Date(admissionData.dateOfBirth),
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
                      {admissionData.gender}
                    </p>
                  </div>
                </div>

                {admissionData.qualification && (
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qualification
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {admissionData.qualification}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Address
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {admissionData.address}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Course Information */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Course Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Course
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {admissionData.course?.courseName || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Joining Date
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {admissionData.joiningDate
                    ? format(new Date(admissionData.joiningDate), "dd MMM yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Information */}
        {(admissionData.registrationPayment ||
          admissionData.installment ||
          admissionData.due) && (
          <Card>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {admissionData.registrationPaymentMode && (
                <div className="flex items-start gap-3">
                  <IndianRupee className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payment Mode
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {admissionData.registrationPaymentMode}
                    </p>
                  </div>
                </div>
              )}

              {admissionData.registrationPayment && (
                <div className="flex items-start gap-3">
                  <IndianRupee className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Registration Payment
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      ₹{admissionData.registrationPayment}
                    </p>
                  </div>
                </div>
              )}

              {admissionData.installment && (
                <div className="flex items-start gap-3">
                  <IndianRupee className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Installment Plan
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {admissionData.installment}
                    </p>
                  </div>
                </div>
              )}

              {admissionData.due && (
                <div className="flex items-start gap-3">
                  <IndianRupee className="w-5 h-5 text-red-600 dark:text-red-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Due Amount
                    </p>
                    <p className="font-medium text-red-600 dark:text-red-400">
                      ₹{admissionData.due}
                    </p>
                  </div>
                </div>
              )}

              {admissionData.dueDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Due Date
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {format(new Date(admissionData.dueDate), "dd MMM yyyy")}
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
                  {admissionData.createdAt
                    ? format(
                        new Date(admissionData.createdAt),
                        "dd MMM yyyy, hh:mm a"
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
