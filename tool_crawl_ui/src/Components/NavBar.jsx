import React from "react";
import logoBanner from "../assets/logoBanner.png";
import logoBYT from "../assets/logoBYT.png";
import logoBTTTT from "../assets/logoBTTTT.png";
import logoAlive from "../assets/logoAlive.png";
const NavBar = () => {
  return (
    <div className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-[50px] max-h-[32px]">
          <img
            src={logoBanner}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col items-center text-[15px] font-medium text-black">
          {/* Logo hàng trên */}
          <div className="flex items-center gap-3 mb-1">
            <img
              src={logoBYT}
              alt="icon1"
              className="max-w-[32px] max-h-[32px] object-contain"
            />
            <img
              src={logoBTTTT}
              alt="icon2"
              className="max-w-[70px] max-h-[80px] object-contain"
            />
            <img
              src={logoAlive}
              alt="icon3"
              className="max-w-[70px] max-h-[80px] object-contain"
            />
          </div>

          {/* Menu chữ bên dưới */}
          <div className="flex items-center">
            <ul className="flex gap-6 list-none p-0 m-0 text-black">
              <li className="px-2 text-gray-500">Home</li>
              <li className="px-2">Auto-detect Violations</li>
              <li className="px-2">Violance reviewed</li>
              <li className="px-2">Submit violations</li>
              <li className="px-2">Analysis</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-1.5 rounded-full">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
