const StatCard = ({ icon: Icon, title, value, color, bgColor }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-dark mt-2">{value}</h3>
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
