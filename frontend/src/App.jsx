import React from 'react'
import "./App.css";
import Home from './pages/HomePage/Home';
import { Routes, Route } from "react-router-dom";
import Register from './pages/Authentication/Register';
import Login from './pages/Authentication/Login';
import Generator from './pages/Generator/Generator';
import Workspace from './pages/Workspace/Workspace';
import WorkspaceDashboard from './pages/Workspace/WorkspaceDashboard';
import { Toaster } from 'react-hot-toast';
import { SidebarProvider } from "./Context/SidebarContext"

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
        
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          
          <Route path='/generator' element={<Generator />} />
          
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