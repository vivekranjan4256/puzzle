import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";

function App() {
  const [verified, setVerified] = useState(true);
  
  return (
    <>
      <Router>
        {/* any component which uses routes mentioned in this router must be in here */}
        <Navbar verified={verified}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/play" element={<GamePage setVerified={setVerified} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
