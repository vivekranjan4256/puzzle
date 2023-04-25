import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import UrlNotFound from './components/UrlNotFound'
import UnauthorizedAccess from "./components/UnauthorizedAccess";
function App() {
  const [verified, setVerified] = useState(false);
  const [loggedin,setloggedin]=useState(false);
  return (
    <>
      <Router>
        {/* any component which uses routes mentioned in this router must be in here */}
        <Navbar verified={verified} loggedin={loggedin} setVerified={setVerified} setloggedin={setloggedin}/>
        <Routes>
        <Route path="*" element={<UrlNotFound />} />
          <Route path="/" element={<Home />} />

          <Route path="/admin" element={verified?<AdminPage />:<UnauthorizedAccess/>}/>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/play" element={<GamePage setVerified={setVerified} setloggedin={setloggedin}/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
