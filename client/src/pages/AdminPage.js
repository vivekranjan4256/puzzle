import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const navigate = useNavigate();

  let [allusersinfo, setallusersinfo] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URI + "/is_admin", {
        withCredentials: true,
      })
      .then((resp) => {
        console.log("AdminPage", resp);
        if (resp.data === true) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      });
    allUserStats();
    console.log("saved state", allusersinfo);
  }, []);

  const allUserStats = async () => {
    axios
      .get(process.env.REACT_APP_BACKEND_URI + "/all_user_stats")
      .then((resp) => {
        setallusersinfo(resp.data);
        console.log("all user stats resp", resp.data);
      })
      .catch((err) => console.log("all user stats fn adminPage err", err));
  };

  return (
    <>
      <table className="table" style={{color:"black",fontSize:"2rem"}}>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Time Taken</th>
            <th scope="col">Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {allusersinfo.map((data, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>{data.time}</td>
                <td>{data.accuracy}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
export default AdminPage;
