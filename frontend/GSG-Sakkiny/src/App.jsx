import React from "react";
import {
  Login,
  Signup,
  Error404,
  Home,
  ApartmentDetails,
  Dashboard,
  AccountSettings,
  AddApartment,
  EditApartment,
  ApartmentRentalContract,
} from "./views";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";
import RequireAuth from "./components/RequireAuth.js/RequireAuth";

const App = () => {
  return (
    <>
      <Toaster />
      <AuthProvider>
        <Routes>
          {/* Open Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/apartments/:apartmentId"
            element={<ApartmentDetails />}
          />

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/rent" element={<ApartmentRentalContract />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="*" element={<Error404 />} />
            <Route path="/addApartment" element={<AddApartment />} />
            <Route
              path="/editApartment/:apartmentId"
              element={<EditApartment />}
            />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </AuthProvider>
    </>
  );
};

export default App;
