"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import {
  useFees,
  useDownloadInvoice,
  useSendInvoiceWhatsApp,
  useOverdueStudents,
  useCreateFee,
} from "@/hooks/api/useFees";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { X, Save, DollarSign } from "lucide-react";

export default function FeesPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMode: "cash",
    paymentDate: new Date().toISOString().split("T")[0],
    feeType: "Tuition Fee",
  });

  const { data, isLoading } = useFees({ startDate, endDate });
  const { data: overdueData, isLoading: overdueLoading } = useOverdueStudents();
  const downloadInvoice = useDownloadInvoice();
  const sendWhatsApp = useSendInvoiceWhatsApp();
  const createFee = useCreateFee();

  const handleDownload = async (id) => {
    try {
      await downloadInvoice.mutateAsync(id);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  const handleSendWhatsApp = async (id) => {
    try {
      await sendWhatsApp.mutateAsync(id);
      toast.success("Invoice sent via WhatsApp");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send invoice");
    }
  };

  const handleOpenPaymentModal = (student) => {
    setSelectedStudent(student);
    setPaymentData({
      amount: student.due || "",
      paymentMode: "cash",
      paymentDate: new Date().toISOString().split("T")[0],
      feeType: "Tuition Fee",
    });
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedStudent(null);
    setPaymentData({
      amount: "",
      paymentMode: "cash",
      paymentDate: new Date().toISOString().split("T")[0],
      feeType: "Tuition Fee",
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      await createFee.mutateAsync({
        student: selectedStudent._id,
        studentModelType: selectedStudent.studentType, // "Student" or "Admission"
        amount: Number(paymentData.amount),
        registrationPaymentMode: paymentData.paymentMode,
        payDate: paymentData.paymentDate,
        feeType: paymentData.feeType,
        payment: Number(paymentData.amount),
      });

      toast.success("Fee payment recorded successfully");
      handleClosePaymentModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record payment");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-primary rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold">Fee Management</h1>
          <p className="text-primary-100">MAA Computers &gt; Fees</p>
        </div>

        <Card>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <Link href="/fees/new">
              <Button>Add New Payment</Button>
            </Link>
          </div>
        </Card>

        {/* Overdue Students Section */}
        <Card>
          <div className="border-b pb-3 mb-4">
            <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <span>⚠️</span>
              {overdueData?.data?.length === 1 ? "Student" : "Students"} with
              Overdue Fees
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {overdueData?.data?.length === 1 ? "Student" : "Students"} whose
              fee due date has passed
            </p>
          </div>
          {overdueLoading ? (
            <Spinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-50 dark:bg-red-900/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      S.No.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Student Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Due Amount
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Days Overdue
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {overdueData?.data && overdueData.data.length > 0 ? (
                    overdueData.data.map((student, index) => (
                      <tr
                        key={student._id}
                        className="hover:bg-red-50 dark:hover:bg-red-900/10"
                      >
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                            {student.studentType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {student.course?.courseName ||
                            student.course?.shortCourseName ||
                            "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {student.contactNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium">
                          {student.dueDate}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded font-semibold">
                            ₹{student.due}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className="px-2 py-1 bg-red-600 text-white rounded font-bold">
                            {student.daysOverdue} days
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex justify-center">
                            <Button
                              variant="success"
                              className="text-xs px-3 py-1"
                              onClick={() => handleOpenPaymentModal(student)}
                            >
                              💰 Pay Fee
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-2xl">✅</span>
                          <span>
                            No overdue fees - All payments are up to date!
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Fee Records">
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      S.No.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Fee Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Payment Mode
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((fee, index) => (
                      <tr
                        key={fee._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3 text-sm">
                          {fee.student?.firstName} {fee.student?.lastName}
                        </td>
                        <td className="px-4 py-3 text-sm">{fee.feeType}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded text-xs">
                            {fee.registrationPaymentMode}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(fee.payDate), "dd MMM yyyy")}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded font-semibold">
                            ₹{fee.payment}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="secondary"
                              className="text-xs px-2 py-1"
                              onClick={() => handleDownload(fee._id)}
                              disabled={downloadInvoice.isPending}
                            >
                              📄 Download
                            </Button>
                            <Button
                              variant="success"
                              className="text-xs px-2 py-1"
                              onClick={() => handleSendWhatsApp(fee._id)}
                              disabled={sendWhatsApp.isPending}
                            >
                              📱 WhatsApp
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        No fee records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Payment Modal */}
        {showPaymentModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold dark:text-gray-100">
                    Record Fee Payment
                  </h3>
                  <button
                    onClick={handleClosePaymentModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Student: {selectedStudent.firstName}{" "}
                    {selectedStudent.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Due Amount: ₹{selectedStudent.due}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Due Date: {selectedStudent.dueDate}
                  </p>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fee Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={paymentData.feeType}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          feeType: e.target.value,
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="Tuition Fee">Tuition Fee</option>
                      <option value="Registration Fee">Registration Fee</option>
                      <option value="Admission Fee">Admission Fee</option>
                      <option value="Examination Fee">Examination Fee</option>
                      <option value="Library Fee">Library Fee</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          amount: e.target.value,
                        })
                      }
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Mode <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={paymentData.paymentMode}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          paymentMode: e.target.value,
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={paymentData.paymentDate}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          paymentDate: e.target.value,
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClosePaymentModal}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createFee.isPending}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {createFee.isPending ? "Recording..." : "Record Payment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
