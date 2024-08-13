import "./App.css";
import React, { useState } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

// import AdminAuth from "./Pages/AdminAuth";
import EmployeeRegistration from "./Pages/EmployeeRegistration";
import UpdateEmployeePage from "./Pages/UpdateEmployeePage";
import AdminHomePage from "./Pages/AdminHomePage";
import AdminLogin from "./Pages/AdminLogin";
import DoctorSecretaryLogin from "./Pages/DoctorSecretaryLogin";
import DoctorSecHomePage from "./Pages/DoctorSecHomePage";
import DoctorSecretaryAppointment from "./Pages/DoctorSecretaryAppointment";
import RolesAssignmentPage from "./Pages/RolesAssignmentPage";
import CreateSlotPage from "./Pages/CreateSlotPage";
import DoctorLogin from "./Pages/DoctorLogin";
import LandingPage from "./Pages/LandingPage";
import LoginUser from "./Pages/LoginUser";
import RegisterUser from "./Pages/RegisterUser";
import UserHomePage from "./Pages/UserHomePage";
import DoctorAppointment from "./Pages/DoctorAppointment";
import DoctorHomePage from "./Pages/DoctorHomePage";
import BookAppointment from "./Pages/BookAppointment";
import EmployeeDetails from "./Pages/EmployeeDetails";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="user/login" element={<LoginUser />} />
          <Route path="user/register" element={<RegisterUser />} />
          <Route path="/employee/register" element={<EmployeeRegistration />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctorsec/login" element={<DoctorSecretaryLogin />} />

          <Route
            path="/admin/home"
            element={
              // <ProtectedRouteAdmin>
              <AdminHomePage />
              // </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/admin/employee-details"
            element={
              <ProtectedRouteAdmin>
                <EmployeeDetails />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/admin/update-employee/:id"
            element={
              <ProtectedRouteAdmin>
                <UpdateEmployeePage />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <ProtectedRouteAdmin>
                <RolesAssignmentPage />
              </ProtectedRouteAdmin>
            }
          />

          <Route
            path="/doctorSec/create-slot"
            element={
              <ProtectedRouteDoctorSec>
                <CreateSlotPage />
              </ProtectedRouteDoctorSec>
            }
          />
          <Route
            path="/doctorsec/appointments"
            element={
              <ProtectedRouteDoctorSec>
                <DoctorSecretaryAppointment />
              </ProtectedRouteDoctorSec>
            }
          />
          <Route
            path="/doctorSec/home"
            element={
              <ProtectedRouteDoctorSec>
                <DoctorSecHomePage />
              </ProtectedRouteDoctorSec>
            }
          />

          <Route
            path="/appointment"
            element={
              <ProtectedRoutePatient>
                <BookAppointment />
              </ProtectedRoutePatient>
            }
          />
          <Route
            path="/user/home"
            element={
              <ProtectedRoutePatient>
                <UserHomePage />
              </ProtectedRoutePatient>
            }
          />

          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRouteDoctor>
                <DoctorAppointment />
              </ProtectedRouteDoctor>
            }
          />
          <Route
            path="/doctor/home"
            element={
              <ProtectedRouteDoctor>
                <DoctorHomePage />
              </ProtectedRouteDoctor>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRouteDoctor>
                <DoctorAppointment />
              </ProtectedRouteDoctor>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

export const ProtectedRoutePatient = ({ children }) => {
  const isAuthorised = localStorage.getItem("user_authorised") === "true";
  if (isAuthorised) {
    return children;
  } else {
    return <Navigate to="/user/login" />;
  }
};
export const ProtectedRouteDoctorSec = ({ children }) => {
  const isAuthorised =
    localStorage.getItem("doctor_sec_authorised") === "true" ||
    localStorage.getItem("admin_authorised") === "true";
  if (isAuthorised) {
    return children;
  } else {
    return <Navigate to="/doctorsec/login" />;
  }
};
export const ProtectedRouteAdmin = ({ children }) => {
  const isAuthorised = localStorage.getItem("admin_authorised") === "true";
  if (isAuthorised) {
    return children;
  } else {
    return <Navigate to="/admin/login" />;
  }
};
export const ProtectedRouteDoctor = ({ children }) => {
  const isAuthorised = localStorage.getItem("doctor_authorised") === "true";
  if (isAuthorised) {
    return children;
  } else {
    return <Navigate to="/doctor/login" />;
  }
};
