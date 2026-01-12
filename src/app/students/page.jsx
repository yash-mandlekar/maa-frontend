"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useStudents, useDeleteStudent } from "@/hooks/api/useStudents";
import { toast } from "sonner";

export default function StudentsPage() {
  const [searchName, setSearchName] = useState("");
  const [searchContact, setSearchContact] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useStudents({
    name: searchName,
    contactNumber: searchContact,
    startDate,
    endDate,
    page,
    limit: 10,
  });

  const deleteStudent = useDeleteStudent();

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent.mutateAsync(id);
        toast.success("Student deleted successfully");
      } catch (error) {
        toast.error("Failed to delete student");
      }
    }
  };

  const handleClearFilters = () => {
    setSearchName("");
    setSearchContact("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-primary rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-primary-100">MAA Computers &gt; Students</p>
        </div>

        {/* Search and Add */}
        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <Input
                label="Search by Name"
                placeholder="Enter student name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <Input
                label="Search by Contact"
                placeholder="Enter contact number"
                value={searchContact}
                onChange={(e) => setSearchContact(e.target.value)}
              />
              <Input
                label="From Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="To Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center">
              <Button variant="secondary" onClick={handleClearFilters}>
                Clear Filters
              </Button>
              <Link href="/students/new">
                <Button>Add New Student</Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Students Table */}
        <Card title="Student List">
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        S.No.
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Name
                      </th>
                     
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Course
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Joining Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data?.data && data.data.length > 0 ? (
                      data.data.map((student, index) => (
                        <tr
                          key={student._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {(page - 1) * 10 + index + 1}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {student.firstName} {student.lastName}
                          </td>
                         
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {student.contactNumber}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {student.course?.courseCode || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {student.joiningDate
                              ? new Date(
                                  student.joiningDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <Link href={`/students/${student._id}`}>
                                <Button
                                  variant="secondary"
                                  className="text-xs px-2 py-1"
                                >
                                  View
                                </Button>
                              </Link>
                              <Button
                                variant="danger"
                                className="text-xs px-2 py-1"
                                onClick={() => handleDelete(student._id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No students found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data?.pagination && (
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {data.data.length} of {data.pagination.totalItems}{" "}
                    students
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm">
                      Page {page} of {data.pagination.totalPages}
                    </span>
                    <Button
                      variant="secondary"
                      disabled={page === data.pagination.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
