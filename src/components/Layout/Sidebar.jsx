"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  IndianRupee,
  BookOpen,
  UserCog,
  MessageSquare,
  Building2,
  Zap,
  X,
} from "lucide-react";
import { useOverdueStudents } from "@/hooks/api/useFees";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inquiries", href: "/inquiries", icon: MessageSquare },
  { name: "Diploma", href: "/students", icon: Users },
  { name: "Admissions", href: "/admission", icon: GraduationCap },
  { name: "Fees", href: "/fees", icon: IndianRupee, showBadge: true },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Short Courses", href: "/short-courses", icon: Zap },
  { name: "Staff", href: "/staff", icon: UserCog },
  { name: "Universities", href: "/universities", icon: Building2 },
];

export function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { data: overdueData } = useOverdueStudents();
  const overdueCount = overdueData?.data?.length || 0;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 h-screen bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700 
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-primary dark:text-primary-400">
              MAA Computers
            </h1>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
              Institute Management
            </p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 lg:p-4">
          <ul className="space-y-1 lg:space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              const showBadge = item.showBadge && overdueCount > 0;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-colors relative ${
                      isActive
                        ? "bg-primary dark:bg-primary-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium flex-1 text-sm lg:text-base">
                      {item.name}
                    </span>
                    {showBadge && (
                      <span className="flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full">
                        {overdueCount > 9 ? "9+" : overdueCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 lg:p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
          © 2024 MAA Computers
        </div>
      </div>
    </>
  );
}
