"use client";

import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { useDashboard } from "@/hooks/api/useDashboard";
import { format } from "date-fns";
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  Users,
  BookOpen,
  TrendingUp,
  IndianRupee,
  Phone,
  CreditCard,
  Eye,
} from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

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
          Error loading dashboard: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  const { totalStudents, totalCourses, fees, recentTransactions } = data || {};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-primary rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-primary-100">MAA Computers &gt; Dashboard</p>
        </div>

        {/* Fee Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Today's Collection"
            value={`₹${fees?.today?.toLocaleString() || 0}`}
            subtitle={format(new Date(), "dd MMMM yyyy")}
            icon={Calendar}
            color="green"
          />
          <StatsCard
            title="Monthly Collection"
            value={`₹${fees?.month?.toLocaleString() || 0}`}
            subtitle={format(new Date(), "MMMM yyyy")}
            icon={CalendarDays}
            color="blue"
          />
          <StatsCard
            title="Yearly Collection"
            value={`₹${fees?.year?.toLocaleString() || 0}`}
            subtitle={new Date().getFullYear()}
            icon={CalendarRange}
            color="yellow"
          />
        </div>

        {/* Students and Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="Diploma"
            value={totalStudents || 0}
            subtitle="Total Diploma Students"
            icon={Users}
            color="cyan"
          />
          <StatsCard
            title="Courses"
            value={totalCourses || 0}
            subtitle="Total Courses"
            icon={BookOpen}
            color="purple"
          />
        </div>

        {/* Recent Transactions */}
        <Card>
          <div className="mb-4">
            <h5 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Payment Transactions
            </h5>
          </div>
          <Table>
            <TableHeader>
              <tr>
                <TableHead>S.No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>
                  <Phone className="w-4 h-4 inline mr-1" />
                  Contact
                </TableHead>
                <TableHead>
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  Payment Method
                </TableHead>
                <TableHead>
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date
                </TableHead>
                <TableHead className="text-right">
                  <IndianRupee className="w-4 h-4 inline mr-1" />
                  Amount
                </TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.slice(0, 5).map((fee, index) => (
                  <TableRow key={fee._id}>
                    <TableCell className="text-primary font-semibold">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                          {fee.student?.firstName?.charAt(0).toUpperCase()}
                        </div>
                        <span>{fee.student?.firstName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {fee.student?.contactNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {fee.registrationPaymentMode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {format(new Date(fee.payDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="success" className="font-semibold">
                        ₹{fee.payment}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="6"
                    className="text-center py-8 text-gray-500"
                  >
                    No payment records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {recentTransactions && recentTransactions.length > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <span>
                Showing recent {Math.min(5, recentTransactions.length)}{" "}
                transactions
              </span>
              <a
                href="/fees"
                className="text-primary hover:underline flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                View All Transactions →
              </a>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
