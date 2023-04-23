import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminPage(props) {
const navigate=useNavigate()

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URI+'/is_admin',{withCredentials:true}).then((resp) => {
      console.log("AdminPage",resp)
      if (resp.data === true) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    });
  }, []);

  return (
    <>
      <table className="table">
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
          <tr>
            <td >1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td >2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td></td>
          </tr>
          {/* <tr>
            <th scope="row">3</th>
            <td colspan="2">Larry the Bird</td>
            <td>@twitter</td>
          </tr> */}
        </tbody>
      </table>
    </>
  );
}
export default AdminPage;
