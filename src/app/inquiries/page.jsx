"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import {
  useInquiries,
  useAcceptInquiry,
  useRejectInquiry,
  useDeleteInquiry,
} from "@/hooks/api/useInquiries";
import { format } from "date-fns";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Phone,
  Mail,
  User,
  Plus,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

export default function InquiriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: inquiries, isLoading, error } = useInquiries();
  const acceptInquiry = useAcceptInquiry();
  const rejectInquiry = useRejectInquiry();
  const deleteInquiry = useDeleteInquiry();

  const handleAccept = async (inquiry) => {
    try {
      await acceptInquiry.mutateAsync(inquiry._id);
      toast.success("Inquiry accepted successfully");

      // Prepare inquiry data for form pre-filling
      const queryParams = new URLSearchParams({
        firstName: inquiry.firstName || "",
        lastName: inquiry.lastName || "",
        email: inquiry.email || "",
        fatherName: inquiry.fatherName || "",
        contactNumber: inquiry.contactNumber || "",
        qualification: inquiry.qualification || "",
        address: inquiry.address || "",
        course: inquiry.course?._id || "",
        courseModelType: inquiry.courseModelType || "",
      }).toString();

      // Redirect to appropriate form based on inquiryType
      if (inquiry.inquiryType === "student") {
        router.push(`/students/new?${queryParams}`);
      } else if (inquiry.inquiryType === "admission") {
        router.push(`/admission/new?${queryParams}`);
      }
    } catch (error) {
      toast.error("Failed to accept inquiry");
    }
  };

  const handleReject = async (id) => {
    if (confirm("Are you sure you want to reject this inquiry?")) {
      try {
        await rejectInquiry.mutateAsync(id);
        toast.success("Inquiry rejected successfully");
      } catch (error) {
        toast.error("Failed to reject inquiry");
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteInquiry.mutateAsync(id);
        toast.success("Inquiry deleted successfully");
      } catch (error) {
        toast.error("Failed to delete inquiry");
      }
    }
  };

  const downloadInquiriesXLSX = (status = "all") => {
    // Filter inquiries based on status
    let dataToDownload = inquiries?.data || [];

    if (status !== "all") {
      dataToDownload = dataToDownload.filter((inquiry) => {
        if (status === "pending") {
          return !inquiry.rejected && !inquiry.registered;
        } else if (status === "accepted") {
          return inquiry.registered;
        } else if (status === "rejected") {
          return inquiry.rejected;
        }
        return true;
      });
    }

    // Format data for Excel
    const formattedData = dataToDownload.map((inquiry, index) => ({
      "Sr. No.": index + 1,
      "First Name": inquiry.firstName || "",
      "Last Name": inquiry.lastName || "",
      Email: inquiry.email || "",
      "Contact Number": inquiry.contactNumber || "",
      "Father Name": inquiry.fatherName || "",
      Qualification: inquiry.qualification || "",
      Address: inquiry.address || "",
      "Course Type":
        inquiry.courseModelType === "ShortCourse"
          ? "Short Course"
          : "Diploma Course",
      Course:
        inquiry.courseModelType === "ShortCourse"
          ? inquiry.course?.courseName || "N/A"
          : inquiry.course?.courseCode || "N/A",
      "Inquiry Type": inquiry.inquiryType || "",
      Status: inquiry.rejected
        ? "Rejected"
        : inquiry.registered
        ? "Accepted"
        : "Pending",
      "Created Date": inquiry.createdAt
        ? format(new Date(inquiry.createdAt), "dd MMM yyyy, hh:mm a")
        : "",
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(formattedData);

    // Set column widths
    ws["!cols"] = [
      { wch: 8 }, // Sr. No.
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 25 }, // Email
      { wch: 15 }, // Contact Number
      { wch: 20 }, // Father Name
      { wch: 20 }, // Qualification
      { wch: 30 }, // Address
      { wch: 15 }, // Course Type
      { wch: 20 }, // Course
      { wch: 12 }, // Inquiry Type
      { wch: 10 }, // Status
      { wch: 20 }, // Created Date
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    const sheetName =
      status === "all"
        ? "All Inquiries"
        : `${status.charAt(0).toUpperCase() + status.slice(1)} Inquiries`;

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate filename
    const fileName = `inquiries_${status}_${format(
      new Date(),
      "yyyy-MM-dd_HHmmss"
    )}.xlsx`;

    // Download file
    XLSX.writeFile(wb, fileName);
    toast.success(`Downloaded ${dataToDownload.length} inquiries successfully`);
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
          Error loading inquiries: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  const filteredInquiries = inquiries?.data?.filter((inquiry) => {
    const matchesSearch =
      inquiry.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.contactNumber?.includes(searchTerm);

    // Determine status based on rejected and registered fields
    let inquiryStatus = "pending";
    if (inquiry.rejected) {
      inquiryStatus = "rejected";
    } else if (inquiry.registered) {
      inquiryStatus = "accepted";
    }

    const matchesStatus =
      statusFilter === "all" || inquiryStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (inquiry) => {
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
            <div>
              <h1 className="text-2xl font-bold">Inquiries Management</h1>
              <p className="text-primary-100">MAA Computers &gt; Inquiries</p>
            </div>
            <div className="flex gap-3">
              {/* Download Dropdown */}
              <div className="relative group">
                <button className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download XLSX
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-2">
                    <button
                      onClick={() => downloadInquiriesXLSX("all")}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      All Inquiries
                    </button>
                    <button
                      onClick={() => downloadInquiriesXLSX("pending")}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Pending Only
                    </button>
                    <button
                      onClick={() => downloadInquiriesXLSX("accepted")}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Accepted Only
                    </button>
                    <button
                      onClick={() => downloadInquiriesXLSX("rejected")}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Rejected Only
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push("/inquiries/new")}
                className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Enquiry
              </button>
            </div>
          </div>
        </div>
        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none dark:bg-gray-700 dark:text-gray-100"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary-200 dark:border-primary-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Inquiries
                </p>
                <p className="text-2xl font-bold text-primary dark:text-primary-400">
                  {inquiries?.data?.length || 0}
                </p>
              </div>
              <User className="w-8 h-8 text-primary dark:text-primary-400" />
            </div>
          </Card>

          <Card className="border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {inquiries?.data?.filter((i) => !i.rejected && !i.registered)
                    .length || 0}
                </p>
              </div>
              <Phone className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Accepted
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {inquiries?.data?.filter((i) => i.registered).length || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rejected
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {inquiries?.data?.filter((i) => i.rejected).length || 0}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </Card>
        </div>

        {/* Inquiries Table */}
        <Card>
          <Table>
            <TableHeader>
              <tr>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course Interest</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredInquiries && filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry, index) => (
                  <TableRow key={inquiry._id}>
                    <TableCell className="text-primary dark:text-primary-400 font-semibold">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary dark:bg-primary-600 text-white flex items-center justify-center text-xs">
                          {inquiry.firstName?.charAt(0).toUpperCase()}
                        </div>
                        <span>
                          {inquiry.firstName} {inquiry.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {inquiry.contactNumber}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {inquiry.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">
                        {inquiry.courseModelType === "ShortCourse"
                          ? inquiry.course?.courseName || "N/A"
                          : inquiry.course?.courseCode || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {inquiry.createdAt
                        ? format(new Date(inquiry.createdAt), "dd MMM yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell>{getStatusBadge(inquiry)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            router.push(`/inquiries/${inquiry._id}`)
                          }
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!inquiry.rejected && !inquiry.registered && (
                          <>
                            <button
                              onClick={() => handleAccept(inquiry)}
                              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                              title="Accept"
                              disabled={acceptInquiry.isPending}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(inquiry._id)}
                              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Reject"
                              disabled={rejectInquiry.isPending}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(inquiry._id)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Delete"
                          disabled={deleteInquiry.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="8"
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    No inquiries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
