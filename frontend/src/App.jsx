import React from 'react'
import "./App.css";
import Home from './pages/HomePage/Home';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Register from './pages/Authentication/Register';
import Login from './pages/Authentication/Login';
import Generator from './pages/Generator/Generator';
import Workspace from './pages/Workspace/Workspace';
import WorkspaceDashboard from './pages/Workspace/WorkspaceDashboard';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import { Toaster } from 'react-hot-toast';
import { SidebarProvider } from "./Context/SidebarContext"
import CookiePolicy from './pages/Legal/CookiePolicy';
import Privacy from './pages/Legal/Privacy';
import Terms from './pages/Legal/Terms';
import { useEffect } from "react";

const TitleUpdater = () => {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') document.title = "Graphura AI | Free Caption & Hashtag Generator";
    else if (path === '/generator') document.title = "Generator | Graphura AI";
    else if (path === '/workspace') document.title = "My Workspaces | Graphura AI";
    else if (path.startsWith('/workspace/')) document.title = "Workspace Dashboard | Graphura AI";
    else if (path === '/login') document.title = "Login | Graphura AI";
    else if (path === '/register') document.title = "Register | Graphura AI";
    else if (path === '/admin' || path === '/admin/') document.title = "Admin Login | Graphura AI";
    else if (path === '/admin/dashboard') document.title = "Admin Dashboard | Graphura AI";
    else document.title = "Graphura AI";
  }, [location]);
  return null;
};

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("access");
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    // 2. WRAP YOUR APP IN THE PROVIDER
    <SidebarProvider>
      <div>
        <Toaster position="top-right" reverseOrder={false} /> 
        <TitleUpdater />
        <Routes>

          <Route path="/cookie" element={<CookiePolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* home / landing page */}
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          
          <Route path='/generator' element={<Generator />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          <Route 
            path='/workspace' 
            element={
              <ProtectedRoute>
                <Workspace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/workspace/:id' 
            element={
              <ProtectedRoute>
                <WorkspaceDashboard />
              </ProtectedRoute>
            } 
          /> 
        </Routes>
      </div>
    </SidebarProvider>
  )
}