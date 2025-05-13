import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Assistant from "./pages/Assistant";
import Doctor from "./pages/Doctor";
import DoctorQueue from "./pages/DoctorQueue";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  useEffect(() => {
    const handleClickOutside = () => {
      toast.dismiss(); // Dismiss all toasts
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/doctor-queue/:doctorId" element={<DoctorQueue />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        closeOnClick
        pauseOnHover
      />
    </Router>
  );
}

export default App;
