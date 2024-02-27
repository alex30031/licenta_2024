import Login from './Components/LoginPage/Login';
import Homepage from './Pages/Homepage'
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"

function App() {
  return (
   <Router>
    <Routes>
      <Route path="/home" element={<Homepage/>}/>
      <Route path="/" element = {<Login/>} />
    </Routes>
   </Router>
  );
}

export default App;
