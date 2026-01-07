"use client";

import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import {
  useInquiry,
  useAcceptInquiry,
  useRejectInquiry,
  useDeleteInquiry,
} from "@/hooks/api/useInquiries";
import { format } from "date-fns";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  GraduationCap,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { data, isLoading, error } = useInquiry(id);
  const acceptInquiry = useAcceptInquiry();
  const rejectInquiry = useRejectInquiry();
  const deleteInquiry = useDeleteInquiry();

  const handleAccept = async () => {
    try {
      await acceptInquiry.mutateAsync(id);
      toast.success("Inquiry accepted successfully");

      // Prepare inquiry data for form pre-filling
      const queryParams = new URLSearchParams({
        firstName: data.data.firstName || "",
        lastName: data.data.lastName || "",
        email: data.data.email || "",
        fatherName: data.data.fatherName || "",
        contactNumber: data.data.contactNumber || "",
        qualification: data.data.qualification || "",
        address: data.data.address || "",
        course: data.data.course?._id || "",
        courseModelType: data.data.courseModelType || "",
      }).toString();

      // Redirect to appropriate form based on inquiryType
      if (data.data.inquiryType === "student") {
        router.push(`/students/new?${queryParams}`);
      } else if (data.data.inquiryType === "admission") {
        router.push(`/admission?${queryParams}`);
      }
    } catch (error) {
      toast.error("Failed to accept inquiry");
    }
  };

  const handleReject = async () => {
    if (confirm("Are you sure you want to reject this inquiry?")) {
      try {
        await rejectInquiry.mutateAsync(id);
        toast.success("Inquiry rejected successfully");
        router.push("/inquiries");
      } catch (error) {
        toast.error("Failed to reject inquiry");
      }
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteInquiry.mutateAsync(id);
        toast.success("Inquiry deleted successfully");
        router.push("/inquiries");
      } catch (error) {
        toast.error("Failed to delete inquiry");
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
          Error loading inquiry: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  const inquiry = data?.data;

  if (!inquiry) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600">Inquiry not found</div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = () => {
    if (inquiry.rejected) {
      return <Badge variant="danger">Rejected</Badge>;
    } else if (inquiry.registered) {
      return <Badge variant="success">Accepted</Badge>;
    } else {
      return <Badge variant="warning">Pending</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-primary rounded-lg p-6 text-white dark:bg-primary-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/inquiries")}
                className="p-2 hover:bg-primary-600 dark:hover:bg-primary-700 rounded-lg transition-colors"
                title="Back to Inquiries"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Inquiry Details</h1>
                <p className="text-primary-100">
                  MAA Computers &gt; Inquiries &gt; View
                </p>
              </div>
            </div>
            <div>{getStatusBadge()}</div>
          </div>
        </div>

        {/* Action Buttons */}
        {!inquiry.rejected && !inquiry.registered && (
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              disabled={acceptInquiry.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              Accept Inquiry
            </button>
            <button
              onClick={handleReject}
              disabled={rejectInquiry.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-4 h-4" />
              Reject Inquiry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Full Name
                </label>
                <p className="text-base font-medium dark:text-gray-200">
                  {inquiry.firstName} {inquiry.lastName}
                </p>
              </div>
              {inquiry.fatherName && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Father's Name
                  </label>
                  <p className="text-base font-medium dark:text-gray-200">
                    {inquiry.fatherName}
                  </p>
                </div>
              )}
              {inquiry.qualification && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Qualification
                  </label>
                  <p className="text-base font-medium dark:text-gray-200">
                    {inquiry.qualification}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Contact Information */}
          <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Number
                </label>
                <p className="text-base font-medium dark:text-gray-200">
                  {inquiry.contactNumber}
                </p>
              </div>
              {inquiry.email && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <p className="text-base font-medium dark:text-gray-200">
                    {inquiry.email}
                  </p>
                </div>
              )}
              {inquiry.address && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </label>
                  <p className="text-base font-medium dark:text-gray-200">
                    {inquiry.address}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Course & Inquiry Details */}
          <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Course Information
            </h2>
            <div className="space-y-4">
              {inquiry.course && (
                <>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Course Type
                    </label>
                    <div className="mt-1">
                      <Badge variant="info">
                        {inquiry.courseModelType === "ShortCourse"
                          ? "Short Course"
                          : "Diploma Course"}
                      </Badge>
                    </div>
                  </div>
                  {inquiry.courseModelType === "Course" &&
                    inquiry.course.courseCode && (
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Course Code
                        </label>
                        <p className="text-base font-medium dark:text-gray-200">
                          {inquiry.course.courseCode}
                        </p>
                      </div>
                    )}
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Course Name
                    </label>
                    <p className="text-base font-medium dark:text-gray-200">
                      {inquiry.course.courseName}
                    </p>
                  </div>
                  {inquiry.course.duration && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        Duration
                      </label>
                      <p className="text-base font-medium dark:text-gray-200">
                        {inquiry.course.duration}
                      </p>
                    </div>
                  )}
                </>
              )}
              {!inquiry.course && (
                <p className="text-gray-500 dark:text-gray-400">
                  No course selected
                </p>
              )}
            </div>
          </Card>

          {/* Inquiry Metadata */}
          <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Inquiry Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Inquiry Type
                </label>
                <div className="mt-1">
                  <Badge variant="info">
                    {inquiry.inquiryType === "student" ? (
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        Student
                      </span>
                    ) : inquiry.inquiryType === "admission" ? (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Admission
                      </span>
                    ) : (
                      inquiry.inquiryType
                    )}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Created At
                </label>
                <p className="text-base font-medium dark:text-gray-200">
                  {inquiry.createdAt
                    ? format(
                        new Date(inquiry.createdAt),
                        "dd MMM yyyy, hh:mm a"
                      )
                    : "N/A"}
                </p>
              </div>
              {inquiry.updatedAt && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Last Updated
                  </label>
                  <p className="text-base font-medium dark:text-gray-200">
                    {format(
                      new Date(inquiry.updatedAt),
                      "dd MMM yyyy, hh:mm a"
                    )}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Status
                </label>
                <div className="mt-1">{getStatusBadge()}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Notes Section */}
        {inquiry.notes && (
          <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Additional Notes
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {inquiry.notes}
            </p>
          </Card>
        )}

        {/* Delete Action */}
        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            disabled={deleteInquiry.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Delete Inquiry
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
