import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/translate/i18n";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from 'react';
import AuthorizeRoute from "./guards/authentication/authorize-route";
import Navbar from '@/components/ui/Navbar';
import Home from "@/pages/Home";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import ConfirmAccount from "./pages/ConfirmAccount";
import Dashboard from "@/pages/Dashboard";
import Subscribe from "@/pages/Subscribe";
import ReportForm from "@/pages/ReportForm";
import Admin from "@/pages/Admin";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

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
                    <Route path="/auth/reset-password" element={<ResetPassword />} />
                    <Route path="/auth/confirm-account" element={<ConfirmAccount />} />
                    <Route path="/dashboard" element={<AuthorizeRoute><Dashboard /></AuthorizeRoute>} />
                    <Route path="/subscribe/:challengeId" element={<AuthorizeRoute><Subscribe /></AuthorizeRoute>} />
                    <Route path="/report/new/:subscriptionId" element={<AuthorizeRoute><ReportForm /></AuthorizeRoute>} />
                    <Route path="/report/edit/:reportId" element={<AuthorizeRoute><ReportForm /></AuthorizeRoute>} />
                    <Route path="/admin" element={<AuthorizeRoute><Admin /></AuthorizeRoute>} />

                    {/*<Route path="/ui/EcomistPage" element={<EcomistPage/>}/>*/}

                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound/>} />
                </Routes>
            </BrowserRouter>
            </AuthProvider>
    </TooltipProvider>
    </QueryClientProvider>
);

export default App;