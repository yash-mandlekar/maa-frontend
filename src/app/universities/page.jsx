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
  useUniversities,
  useCreateUniversity,
  useUpdateUniversity,
  useDeleteUniversity,
} from "@/hooks/api/useUniversities";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  MapPin,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function UniversitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const { data: universities, isLoading, error } = useUniversities();
  const createUniversity = useCreateUniversity();
  const updateUniversity = useUpdateUniversity();
  const deleteUniversity = useDeleteUniversity();

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this university?")) {
      try {
        await deleteUniversity.mutateAsync(id);
        toast.success("University deleted successfully");
      } catch (error) {
        toast.error("Failed to delete university");
      }
    }
  };

  const handleOpenEditModal = (university) => {
    setFormData({
      name: university.name || "",
      location: university.location || "",
    });
    setEditingId(university._id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setFormData({ name: "", location: "" });
    setEditingId(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setFormData({ name: "", location: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode && editingId) {
        await updateUniversity.mutateAsync({ id: editingId, ...formData });
        toast.success("University updated successfully");
      } else {
        await createUniversity.mutateAsync(formData);
        toast.success("University added successfully");
      }
      handleCloseModal();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} university`
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          Error loading universities: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  const filteredUniversities = universities?.filter((university) => {
    return (
      university.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const isPending = createUniversity.isPending || updateUniversity.isPending;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-primary rounded-lg p-4 sm:p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                Universities & Institutions
              </h1>
              <p className="text-primary-100 text-sm sm:text-base">
                MAA Computers &gt; Universities
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add University
            </button>
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-800">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1" />
            <div>
              <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-1">
                About Universities
              </h3>
              <p className="text-sm text-primary-700 dark:text-primary-300">
                Manage the list of universities and institutions that your
                courses are affiliated with. This information is used for
                student certifications and course accreditation.
              </p>
            </div>
          </div>
        </Card>

        {/* Search */}
        <Card>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search universities by name or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <Card className="border-primary-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-primary-600" />
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Total Universities
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-primary-600">
                {universities?.length || 0}
              </p>
            </div>
          </Card>
          <Card className="border-blue-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Unique Locations
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                {universities
                  ? new Set(
                      universities
                        .map((u) => u.location)
                        .filter((l) => l && l.trim())
                    ).size
                  : 0}
              </p>
            </div>
          </Card>
          <Card className="border-primary-200 col-span-2 md:col-span-1">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-primary-600" />
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Recently Added
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-primary-600">
                {universities?.slice(-7).length || 0}
              </p>
            </div>
          </Card>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredUniversities && filteredUniversities.length > 0 ? (
            filteredUniversities.map((university) => (
              <Card
                key={university._id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="space-y-4">
                  {/* University Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary text-white flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white truncate">
                        {university.name}
                      </h3>
                      {university.location && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {university.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t dark:border-gray-700">
                    <span>
                      Added:{" "}
                      {university.createdAt
                        ? new Date(university.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditModal(university)}
                      className="flex-1 px-3 py-2 text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(university._id)}
                      disabled={deleteUniversity.isPending}
                      className="px-3 py-2 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                  <p className="text-lg font-medium">No universities found</p>
                  <p className="text-sm mt-1">
                    Add your first university to get started
                  </p>
                  <button
                    onClick={handleOpenCreateModal}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add University
                  </button>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Add/Edit University Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
              <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  {isEditMode ? "Edit University" : "Add New University"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      University Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., University of Delhi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="e.g., New Delhi, India"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isPending
                      ? isEditMode
                        ? "Updating..."
                        : "Adding..."
                      : isEditMode
                      ? "Update University"
                      : "Add University"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
