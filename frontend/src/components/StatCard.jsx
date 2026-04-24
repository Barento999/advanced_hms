import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({
  icon: Icon,
  title,
  value,
  color,
  bgColor,
  change,
  changeType,
}) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted dark:text-slate-400 text-sm font-medium">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-dark dark:text-white mt-2">
            {value}
          </h3>
          {change && (
            <div
              className={`flex items-center gap-1 text-sm font-medium mt-1 ${
                changeType === "increase" ? "text-green-600" : "text-red-600"
              }`}>
              {changeType === "increase" ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              {change}
            </div>
          )}
        </div>
        <div
          className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon size={28} className={color} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
