export function Table({ children, className = "" }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  );
}

export function TableHeader({ children, className = "" }) {
  return (
    <thead className={`bg-gray-50 dark:bg-gray-800 ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "" }) {
  return (
    <tbody
      className={`divide-y divide-gray-200 dark:divide-gray-700 ${className}`}
    >
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "", onClick }) {
  return (
    <tr
      className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "" }) {
  return (
    <th
      className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "" }) {
  return (
    <td
      className={`px-4 py-3 text-sm text-gray-900 dark:text-gray-100 ${className}`}
    >
      {children}
    </td>
  );
}
