import logo from './logo';
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";

import './App.css';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';

function App() {
  return (
    <div className="">
      <BrowserRouter>
      <Routes>
  <Route path="/signUp" element={ <SignUp/>} />
  <Route path="/" element={ <Login/>} />

  </Routes>
  </BrowserRouter>

     
    
      
    </div>
  );
}

export default App;
