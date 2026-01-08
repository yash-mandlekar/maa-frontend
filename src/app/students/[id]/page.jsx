"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { useStudent } from "@/hooks/api/useStudents";
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
} from "lucide-react";
import { format } from "date-fns";

export default function StudentDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { data: student, isLoading, error } = useStudent(unwrappedParams.id);

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
            <button
              onClick={() => router.push("/students")}
              className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Students
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
                    ? format(new Date(studentData.dateOfBirth), "dd MMM yyyy")
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
