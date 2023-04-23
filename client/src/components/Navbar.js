import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
import { useEffect } from "react";

function Navbar({verified,loggedin}) {

  const navigate = useNavigate();
  const handleLogout = (e) => {
    console.log(e);
    e.preventDefault();
    axios
      .get(process.env.REACT_APP_BACKEND_URI + "/logout", {
        withCredentials: true,
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log("handle logout error", err);
      });
  };

  return (
    <>
      <nav
        className="navbar navbar-dark bg-dark fixed-top"
        style={{ padding: "0" }}
      >
        <div className="container-fluid">
          <h1
            className="navbar-brand"
            style={{ fontFamily: "Oswald, sans-serif", fontSize: "35px" }}
          >
            🏴‍☠️🎯
          </h1>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasDarkNavbar"
            aria-controls="offcanvasDarkNavbar"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="offcanvas offcanvas-end text-bg-dark"
            tabIndex={-1}
            id="offcanvasDarkNavbar"
            aria-labelledby="offcanvasDarkNavbarLabel"
            style={{ maxWidth: "15%" }}
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                Menu
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close" //just acts like alternate name in image tag
              />
            </div>

            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link to="/about"
                    className="nav-link"
                    
                  >
                   About
                  </Link>
                </li>
                <li className="nav-item" data-bs-dismiss="offcanvas">
                      <Link to="/admin" className="nav-link">
                        Admin page
                      </Link>
                    </li>
                    <li className="nav-item" data-bs-dismiss="offcanvas">
                      <a
                        className="nav-link"
                        href="just for warning"
                        onClick={handleLogout}
                      >
                        Log Out
                      </a>
                    </li>

                {/* {verified ? 
                  
                    <li className="nav-item" data-bs-dismiss="offcanvas">
                      <Link to="/admin" className="nav-link">
                        Admin page
                      </Link>
                    </li>

                    
                
                : 
                  <></>
                }
                {
                  loggedin?
                  <li className="nav-item" data-bs-dismiss="offcanvas">
                      <a
                        className="nav-link"
                        href="just for warning"
                        onClick={handleLogout}
                      >
                        Log Out
                      </a>
                    </li>
                    :
                    <></>
                } */}
                
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
