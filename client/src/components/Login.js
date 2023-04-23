import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles.css";

function Login() {
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
   await axios
      .post(process.env.REACT_APP_BACKEND_URI+"/login", {
        email: e.target.email.value,
        password: e.target.password.value
      },{withCredentials:true})
      .then((incoming_data) => {
        console.log('loginUser fn',incoming_data)
       
        if (incoming_data)
        {
          navigate("/play");
        }
      })
      .catch((err) => console.log("register fn axios", err));

      e.target.email.value="";
      e.target.password.value=""
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
