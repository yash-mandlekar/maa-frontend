/**
 * Centralized Theme Configuration
 *
 * This file contains reusable theme utilities and styles to ensure
 * consistency across the dashboard.
 */

export const theme = {
  // Page Header Styles
  pageHeader: {
    base: "bg-primary rounded-lg p-6 text-white",
    withActions:
      "bg-primary rounded-lg p-6 text-white flex justify-between items-center",
    breadcrumb: "text-primary-100",
  },

  // Button Styles
  buttons: {
    primary:
      "px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-50",
    secondary:
      "px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2",
    danger:
      "px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50",
  },

  // Form Input Styles
  input: {
    base: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
    error:
      "w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent",
  },

  // Card Styles
  card: {
    base: "bg-white rounded-lg shadow-sm border border-gray-200 p-6",
    hover:
      "bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow",
  },

  // Badge Styles
  badge: {
    primary:
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800",
    success:
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
    warning:
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
    danger:
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800",
    info: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
  },

  // Statistics Card Styles
  stats: {
    card: "border-primary-200",
    value: "text-2xl font-bold text-primary-600",
  },
};

// Helper function to combine classNames
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
