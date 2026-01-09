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
import { useStaff, useDeleteStaff } from "@/hooks/api/useStaff";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Phone,
  Mail,
  Briefcase,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function StaffPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: staff, isLoading, error } = useStaff();
  const deleteStaff = useDeleteStaff();

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaff.mutateAsync(id);
        toast.success("Staff member deleted successfully");
      } catch (error) {
        toast.error("Failed to delete staff member");
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
          Error loading staff: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  const filteredStaff = staff?.filter((member) => {
    return (
      member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.contactNumber?.includes(searchTerm) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: "danger",
      teacher: "primary",
      staff: "secondary",
      accountant: "success",
    };
    return (
      <Badge variant={roleColors[role?.toLowerCase()] || "default"}>
        {role || "N/A"}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-primary rounded-lg p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <p className="text-primary-100">MAA Computers &gt; Staff</p>
          </div>
          <button
            onClick={() => router.push("/staff/new")}
            className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Staff
          </button>
        </div>

        {/* Search */}
        <Card>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search staff by name, email, phone, or role..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">Total Staff</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {staff?.length || 0}
              </p>
            </div>
          </Card>
          <Card className="border-green-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600">Teachers</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {staff?.filter((s) => s.role?.toLowerCase() === "teacher")
                  .length || 0}
              </p>
            </div>
          </Card>
          <Card className="border-purple-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-gray-600">Admin</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {staff?.filter((s) => s.role?.toLowerCase() === "admin")
                  .length || 0}
              </p>
            </div>
          </Card>
          <Card className="border-yellow-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-gray-600">Other Staff</p>
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {staff?.filter(
                  (s) => !["admin", "teacher"].includes(s.role?.toLowerCase())
                ).length || 0}
              </p>
            </div>
          </Card>
        </div>

        {/* Staff Table */}
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              All Staff Members
            </h2>
          </div>
          <Table>
            <TableHeader>
              <tr>
                <TableHead>S.No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>
                  <Phone className="w-4 h-4 inline mr-1" />
                  Contact
                </TableHead>
                <TableHead>
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </TableHead>
                <TableHead>
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Role
                </TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredStaff && filteredStaff.length > 0 ? (
                filteredStaff.map((member, index) => (
                  <TableRow key={member._id}>
                    <TableCell className="text-primary font-semibold">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                          {member.firstName?.charAt(0).toUpperCase()}
                          {member.lastName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {member.staffId || "N/A"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {member.contactNumber}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {member.email}
                    </TableCell>
                    <TableCell>{getRoleBadge(member.role)}</TableCell>
                    <TableCell className="text-gray-600">
                      {member.department || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/staff/${member._id}`)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/staff/${member._id}`)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                          disabled={deleteStaff.isPending}
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
                    colSpan="7"
                    className="text-center py-8 text-gray-500"
                  >
                    No staff members found
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
