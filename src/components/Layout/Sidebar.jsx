"use client";

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
} from "lucide-react";
import { useOverdueStudents } from "@/hooks/api/useFees";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inquiries", href: "/inquiries", icon: MessageSquare },
  { name: "Students", href: "/students", icon: Users },
  { name: "Admissions", href: "/admission", icon: GraduationCap },
  { name: "Fees", href: "/fees", icon: IndianRupee, showBadge: true },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Short Courses", href: "/short-courses", icon: Zap },
  { name: "Staff", href: "/staff", icon: UserCog },
  { name: "Universities", href: "/universities", icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: overdueData } = useOverdueStudents();
  const overdueCount = overdueData?.data?.length || 0;

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-primary dark:text-primary-400">
          MAA Computers
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Institute Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            const showBadge = item.showBadge && overdueCount > 0;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                    isActive
                      ? "bg-primary dark:bg-primary-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium flex-1">{item.name}</span>
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
        © 2024 MAA Computers
      </div>
    </div>
  );
}
