"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { useStaffMember, useUpdateStaff } from "@/hooks/api/useStaff";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  ArrowLeft,
  Edit,
  Save,
  X,
  Clock,
  Hash,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function StaffDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const {
    data: staffMember,
    isLoading,
    error,
  } = useStaffMember(unwrappedParams.id);
  const updateStaff = useUpdateStaff();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (staffMember) {
      setFormData({
        firstName: staffMember.firstName || "",
        lastName: staffMember.lastName || "",
        email: staffMember.email || "",
        contactNumber: staffMember.contactNumber || "",
        role: staffMember.role || "staff",
        department: staffMember.department || "",
        staffId: staffMember.staffId || "",
        address: staffMember.address || "",
      });
    }
  }, [staffMember]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateStaff.mutateAsync({
        id: unwrappedParams.id,
        ...formData,
      });
      toast.success("Staff member updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update staff member"
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: staffMember.firstName || "",
      lastName: staffMember.lastName || "",
      email: staffMember.email || "",
      contactNumber: staffMember.contactNumber || "",
      role: staffMember.role || "staff",
      department: staffMember.department || "",
      staffId: staffMember.staffId || "",
      address: staffMember.address || "",
    });
    setIsEditing(false);
  };

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !staffMember) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600">
          Error loading staff details:{" "}
          {error?.message || "Staff member not found"}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-primary dark:bg-primary-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <User className="w-6 h-6" />
                Staff Details
              </h1>
              <p className="text-primary-100">
                MAA Computers &gt; Staff &gt; {staffMember.firstName}{" "}
                {staffMember.lastName}
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
                    disabled={updateStaff.isPending}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {updateStaff.isPending ? "Saving..." : "Save Changes"}
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
                    onClick={() => router.push("/staff")}
                    className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Staff
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Last Updated Info */}
        {staffMember.updatedAt && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>
              Last updated:{" "}
              {format(new Date(staffMember.updatedAt), "dd MMM yyyy, hh:mm a")}
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
                    Staff ID
                  </label>
                  <input
                    type="text"
                    name="staffId"
                    value={formData.staffId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="staff">Staff</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                    <option value="accountant">Accountant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
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
                      {staffMember.firstName} {staffMember.lastName}
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
                      {staffMember.email}
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
                      {staffMember.contactNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Hash className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Staff ID
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {staffMember.staffId || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Role
                    </p>
                    <div className="mt-1">{getRoleBadge(staffMember.role)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Department
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {staffMember.department || "N/A"}
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
                      {staffMember.address || "N/A"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Registration Details */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Registration Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary dark:text-primary-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Created At
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {staffMember.createdAt
                    ? format(
                        new Date(staffMember.createdAt),
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
