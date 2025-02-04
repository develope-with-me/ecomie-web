import logo from './logo';
import {BrowserRouter, Routes, Route, Router} from "react-router-dom";

import './App.css';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import UserProfilePage from "./pages/user-profile-page/user-profile-page";
import React from 'react';
import EvangelistPage from "./pages/Evangelist-page/evangelist-page";
import UserAccount from "./pages/user-accounts/user-accounts";
import EcomistPage from './pages/Admin/Ecomist-page/Ecomist-adminPage';

function App() {
    return (
        <div className="">
            <BrowserRouter>
                <Routes>
                    <Route path="/signUp" element={<SignUp/>}/>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/ui/evangelist-page" element={<EvangelistPage/>}/>
                    <Route path="/ui/user-profile" element={<UserProfilePage/>}/>
                    <Route path="/ui/user-accounts" element={<UserAccount/>}/>
                    <Route path="/ui/EcomistPage" element={<EcomistPage/>}/>


                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default App;
