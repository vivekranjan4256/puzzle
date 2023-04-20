import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import InputBoxes from "./pages/GamePage";
import SignUp from "./components/SignUp";
function App() {
  return (
    <Router>
    <Routes>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/play' element={<InputBoxes/>}/>
    </Routes>
   
    </Router>
  );
}

export default App;
