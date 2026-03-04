import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/translate/i18n";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Subscribe from "@/pages/Subscribe";
import ReportForm from "@/pages/ReportForm";
import Admin from "@/pages/Admin";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();
const isAuthenticated = false;

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/subscribe/:challengeId" element={<Subscribe />} />
                    <Route path="/report/new/:subscriptionId" element={<ReportForm />} />
                    <Route path="/report/edit/:reportId" element={<ReportForm />} />
                    <Route path="/admin" element={<Admin />} />

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
            </AuthProvider>
    </TooltipProvider>
    </QueryClientProvider>
);

export default App;