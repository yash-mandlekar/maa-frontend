"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { useAdmission } from "@/hooks/api/useAdmissions";
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
} from "lucide-react";
import { format } from "date-fns";

export default function AdmissionDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const {
    data: admission,
    isLoading,
    error,
  } = useAdmission(unwrappedParams.id);

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
            <button
              onClick={() => router.push("/admission")}
              className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Admissions
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    ? format(new Date(admissionData.dateOfBirth), "dd MMM yyyy")
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
