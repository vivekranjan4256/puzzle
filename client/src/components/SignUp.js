import axios from "axios";
import {useNavigate} from 'react-router-dom';

import '../styles.css'

function SignUp() {
    const navigate=useNavigate()

  const registerUser = (e) => {
    e.preventDefault();
    axios.post(process.env.REACT_APP_BACKEND_URI+"/register", {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    })
    .then(()=>{navigate('/play')})
    .catch((err)=>(console.log('register fn axios',err)));

    e.target.name.value="";
    e.target.email.value="";
    e.target.password.value=""
  };

  return (
    <div className="container mt-5">
      <h1>Register</h1>
      <br />
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <form onSubmit={registerUser}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Name"
                />
              </div>
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
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
