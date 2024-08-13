import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
    // Add any additional logout logic here
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <header className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-600 hover:text-gray-800 p-2 rounded-md"
              onClick={toggleSidebar}
            >
              <GiHamburgerMenu />
            </button>
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

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="h-screen w-64 bg-gray-800 text-white fixed left-0 top-0 overflow-y-auto">
          <div className="flex justify-end p-4">
            <button className="text-white">
              <AiOutlineClose onClick={toggleSidebar} />
            </button>
          </div>
          <div className="flex items-center justify-center h-16">
            <img
              src="https://res.cloudinary.com/dtjg2hgky/image/upload/v1692714857/logofinal_bxukkn.png"
              alt="Logo"
              className="h-10" // Adjusted logo size
            />
          </div>
          <ul className="space-y-4 mt-8 px-12 py-6">
            <li className="py-3">
              <Link to="/admin/home" className="block hover:text-gray-300">
                Home
              </Link>
            </li>
            <li className="py-3">
              <Link
                to="/admin/employee-details"
                className="block hover:text-gray-300"
              >
                Employee Details
              </Link>
            </li>
            <li className="py-3">
              <Link to="/admin/roles" className="block hover:text-gray-300">
                Roles Assignment
              </Link>
            </li>
            <li className="py-3">
              <Link
                to="/doctorSec/create-slot"
                className="block hover:text-gray-300"
              >
                Create Slot
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
