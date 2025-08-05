import {BrowserRouter, Routes, Route} from "react-router-dom";

import './App.css';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import UserProfilePage from "./pages/user-profile-page/user-profile-page";
import React from 'react';
import EvangelistPage from "./pages/Evangelist-page/evangelist-page";
import UserAccount from "./pages/user-accounts/user-accounts";
import EcomistPage from './pages/Admin/Ecomist-page/Ecomist-adminPage';
import EvangelistStatisticsPage from "./pages/evangelist-statistics-page/evangelist-statistics-page";
import AuthorizeRoute from "./guards/authentication/authorize-route";
import Navbar from '@/components/ui/Navbar';
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

function App() {
    const isAuthenticated = false;

    return (
        <div className="">
            
            <BrowserRouter>
            <div><Navbar/></div>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/signUp" element={<SignUp/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/ui/evangelist-page" element={<EvangelistPage/>}/>
                    <Route path="/ui/user-profile" element={<UserProfilePage/>}/>
                    <Route path="/ui/user-accounts"
                           element={
                               // <AuthorizeRoute isAuthenticated={isAuthenticated}>
                                   <UserAccount/>
                               // </AuthorizeRoute>
                           }
                    />
                    {/*<Route path="/ui/EcomistPage" element={<EcomistPage/>}/>*/}

                    <Route path="/ui/statistics" element={<EvangelistStatisticsPage/>}/>
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound/>} />
                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default App;
