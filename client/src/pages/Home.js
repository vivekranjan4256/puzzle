import { Link } from "react-router-dom";
import '../styles.css'
function Home() {
  return (
    <div className="jumbotron centered">
      <div className="container">
        <i className="fas fa-key fa-6x"></i>
        <h1 className="display-3">Treasure Hunt</h1>
        <p className="lead">Jump into the world of mysteris and let the adeventure begin!</p>
        <hr />
        <Link to="/signup" className="btn btn-light btn-lg">
          Register
          </Link>
        <Link to='/login' className="btn btn-dark btn-lg">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;
