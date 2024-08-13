import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PatientNavbar = () => {
  const navigate = useNavigate();

  // Check if user is authorized in localStorage
  const userAuthorized = localStorage.getItem("user_authorised") === "true";

  const handleLogout = () => {
    // Clear the user authorization status in localStorage
    localStorage.removeItem("user_authorised");

    // Redirect to the login page or any desired page
    navigate("/user/login");
  };

  return (
    <header className="bg-white py-4 shadow-sm relative z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
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
        <div className="flex items-center space-x-4 mr-4">
          {userAuthorized ? (
            <button
              className="bg-user_primary text-white md:text-xl hover:bg-gray-800 px-4 py-2 rounded-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                className="bg-user_primary text-white md:text-xl hover:bg-gray-800 px-4 py-2 rounded-md"
                onClick={() => {
                  navigate("/user/login");
                }}
              >
                Login
              </button>
              <button
                className="hidden md:block bg-user_primary text-white md:text-xl hover:bg-gray-800 px-4 py-2 rounded-md"
                onClick={() => {
                  navigate("/user/register");
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default PatientNavbar;
