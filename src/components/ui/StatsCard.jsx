import { Card } from "./Card";

export function StatsCard({
  title,
  value,
  icon: Icon,
  subtitle,
  color = "blue",
  className = "",
}) {
  const colorClasses = {
    blue: {
      border: "border-blue-200",
      text: "text-blue-600",
      bg: "bg-blue-50",
    },
    green: {
      border: "border-green-200",
      text: "text-green-600",
      bg: "bg-green-50",
    },
    yellow: {
      border: "border-yellow-200",
      text: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    purple: {
      border: "border-purple-200",
      text: "text-purple-600",
      bg: "bg-purple-50",
    },
    cyan: {
      border: "border-cyan-200",
      text: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    red: {
      border: "border-red-200",
      text: "text-red-600",
      bg: "bg-red-50",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <Card className={`${colors.border} ${className}`}>
      <div className="text-center">
        <h3
          className={`${colors.text} font-semibold mb-2 flex items-center justify-center gap-2`}
        >
          {Icon && <Icon className="w-5 h-5" />}
          {title}
        </h3>
        <div className={`${colors.bg} rounded-lg p-4`}>
          <p className={`text-3xl font-bold ${colors.text} mb-1`}>{value}</p>
          {subtitle && <small className="text-gray-600">{subtitle}</small>}
        </div>
      </div>
    </Card>
  );
}
