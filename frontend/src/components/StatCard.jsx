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
        <div className="flex-1 min-w-0">
          <p className="text-muted dark:text-slate-400 text-xs sm:text-sm font-medium truncate">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-dark dark:text-white mt-1 sm:mt-2 truncate">
            {value}
          </h3>
          {change && (
            <div
              className={`flex items-center gap-1 text-xs sm:text-sm font-medium mt-1 ${
                changeType === "increase" ? "text-green-600" : "text-red-600"
              }`}>
              {changeType === "increase" ? (
                <TrendingUp size={14} className="sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown size={14} className="sm:w-4 sm:h-4" />
              )}
              {change}
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0 ml-3`}>
          <Icon size={24} className={`sm:w-7 sm:h-7 ${color}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
