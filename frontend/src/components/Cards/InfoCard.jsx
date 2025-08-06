import React from "react";

const InfoCard = ({ icon: Icon, label = "", value = "", color = "bg-gray-400" }) => {
  return (
    <div className="flex items-center gap-3">
      {Icon && <Icon className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />}
      
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 md:w-3 md:h-3 ${color} rounded-full`} />
        <p className="text-xs md:text-sm text-gray-600">
          <span className="text-sm md:text-base font-medium text-black">{value}</span>{" "}
          {label}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
