import logo from './logo';
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";

import './App.css';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import EvangelistPage from "./pages/Evangelist-page/evangelist-page";
import UserProfilePage from "./pages/user-profile-page/user-profile-page";
import React from 'react';

function App() {
  return (
    <div className="">
      <BrowserRouter>
      <Routes>
  <Route path="/signUp" element={ <SignUp/>} />
  <Route path="/" element={ <Login/>} />
  <Route path="/ui/evangelist-page" element={ <EvangelistPage/>}

  />
  <Route path="/ui/evangelist-page/user-profile" element={ <UserProfilePage/>} />

  </Routes>
  </BrowserRouter>

     
    
      
    </div>
  );
}

export default App;
