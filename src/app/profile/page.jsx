"use client";

import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import useAuthStore from "@/store/authStore";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-primary rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-primary-100">MAA Computers &gt; Profile</p>
        </div>

        {/* Profile Card */}
        <Card>
          <div className="p-6">
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {user?.username || "User"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {user?.role || "Staff"} Account
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Username
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {user?.username || "N/A"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email Address
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {user?.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Role
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {user?.role || "Staff"}
                  </p>
                </div>
              </div>

              {/* Account Status */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Account Status
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    <p className="text-lg font-medium text-green-600 dark:text-green-400">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
              Quick Actions
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="/settings/whatsapp"
                className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              >
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    WhatsApp Settings
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Configure WhatsApp
                  </p>
                </div>
              </a>
              <a
                href="/dashboard"
                className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              >
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Dashboard
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View overview
                  </p>
                </div>
              </a>
              <a
                href="/fees"
                className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
              >
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Fee Management
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage fees
                  </p>
                </div>
              </a>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
