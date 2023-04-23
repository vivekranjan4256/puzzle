import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";

function App() {
  const [verified, setVerified] = useState(false);
  
  return (
    <>
      <Router>
        {/* any component which uses routes mentioned in this router must be in here */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/play" element={<GamePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
