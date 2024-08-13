import React from "react";
import { Link, useNavigate } from "react-router-dom";

const DoctorSecNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/doctorsec/login");
    // Add any additional logout logic here
  };

  return (
    <header className="bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Link to="/">
              <div className="flex items-center">
                <img
                  src="https://res.cloudinary.com/dtjg2hgky/image/upload/v1692714857/logofinal_bxukkn.png"
                  alt="Logo"
                  className="h-14" // Increased size of the logo
                />
              </div>
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DoctorSecNavbar;
