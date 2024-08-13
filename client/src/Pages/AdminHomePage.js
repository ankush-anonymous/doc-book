import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../Components/AdminNavbar";
import {
  faCalendarAlt,
  faFileMedical,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const AdminHomePage = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Employee Details",
      icon: faCalendarAlt,
      link: "/admin/employee-details",
    },
    {
      title: "Roles Management",
      icon: faFileMedical,
      link: "/admin/roles",
    },
    {
      title: "Create Slot",
      icon: faFileMedical,
      link: "/doctorSec/create-slot",
    },
    { title: "Your Profile", icon: faInfoCircle, link: "/admin/profile" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
    // Add any additional logout logic here
  };

  const handleCardClick = (link) => {
    navigate(link);
  };

  const inactivityTimeoutDuration = 15 * 60 * 1000; // 15 minutes * 60 seconds * 1000 milliseconds

  useEffect(() => {
    let inactivityTimeout;

    const resetInactivityTimeout = () => {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(logout, inactivityTimeoutDuration);
    };

    const logout = () => {
      localStorage.clear();
      navigate("/admin/login");
    };

    window.addEventListener("mousemove", resetInactivityTimeout);
    window.addEventListener("keydown", resetInactivityTimeout);

    resetInactivityTimeout();

    return () => {
      clearTimeout(inactivityTimeout);
      window.removeEventListener("mousemove", resetInactivityTimeout);
      window.removeEventListener("keydown", resetInactivityTimeout);
    };
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="bg-user_secondary min-h-screen text-black">
        <div className="container mx-auto text-3xl font-bold text-center pt-10 p-5">
          Home Page
        </div>
        <main className="container mx-auto py-8">
          <div className="flex flex-wrap justify-center">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white text-black shadow-lg rounded-lg mx-5 my-4 p-4 sm:p-6 md:p-8 w-64 sm:w-72 md:w-80 lg:w-80 hover:scale-105 hover:bg-slate-200 transition-transform"
                onClick={() => handleCardClick(card.link)}
              >
                <FontAwesomeIcon
                  icon={card.icon}
                  className="w-10 h-10  mx-auto mb-2 sm:mb-4" // Adjust the width and height here
                />
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                  {card.title}
                </h2>
              </div>
            ))}
          </div>
        </main>
      </div>
      <footer className="bg-white py-2 text-black bottom-0 text-center">
        &copy; {new Date().getFullYear()} Hospital Name
      </footer>
    </>
  );
};

export default AdminHomePage;
