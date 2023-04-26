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
import axios from 'axios'
// import Cookies from "js-cookie";

function App() {

  const [verified, setVerified] = useState(false);
  const [loggedin,setloggedin]=useState(false);

  // verification is done on this and game page
  useEffect(() => {
    // console.log(typeof(Cookies.get('puzzle_cookie')))
    axios
      .get(process.env.REACT_APP_BACKEND_URI + "/is_logged",{
      // puzzle_cookie: Cookies.get('puzzle_cookie')
      withCredentials: true
      })
      .then(async (resp) => {
        console.log('is_logged resp',resp)
        if (resp.data===true) {
          setloggedin(true)
         
          await axios
            .get(process.env.REACT_APP_BACKEND_URI + "/is_admin", {
              withCredentials: true,
            })
            .then((respo) => {
              console.log('is_admin respo ',respo, respo.data);

              if (respo.data === true) {
                setVerified(true);
              } 
            });
        }
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <Router>
        {/* any component which uses routes mentioned in this router must be in here */}
        <Navbar verified={verified} loggedin={loggedin} setVerified={setVerified} setloggedin={setloggedin}/>
        <Routes>
        <Route path="*" element={<UrlNotFound />} />
          <Route path="/" element={<Home loggedin={loggedin}/>} />

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
