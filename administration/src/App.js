import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import VerifiedPatients from "./pages/VerifiedPatients";
import Assistant from "./pages/Assistant";
import Doctor from "./pages/Doctor";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/verified-patients" element={<VerifiedPatients />} />
      <Route path="/assistant" element={<Assistant />} />
      <Route path="/doctor" element={<Doctor />} />
      </Routes>
    </Router>
  );
}

export default App;
