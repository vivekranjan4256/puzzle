import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "../styles.css";

function Login() {
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    await axios
      .post(
        process.env.REACT_APP_BACKEND_URI + "/login",
        {
          email: e.target.email.value,
          password: e.target.password.value,
        }
      )
      .then((incoming) => {
        console.log("loginUser fn", incoming);

        if (incoming.data.check) {
          Cookies.set("puzzle_cookie", incoming.data.puzzle_cookie, {
            expires: 2 / 24,
          }); //for 2/24 of a day
          navigate("/play");
        }
      })
      .catch((err) => console.log("login fn axios", err));

    e.target.email.value = "";
    e.target.password.value = "";
  };

  return (
    <div className="container mt-5">
      <h1>Login</h1>
      <br />
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <form onSubmit={loginUser}>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                />
              </div>
              <button type="submit" className="btn btn-dark">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
