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

export default function App() {
  return (
    <div>
      {/* Initialize the UI Alerts */}
      <SidebarProvider>
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          {/* home / landing page */}
          <Route path='/' element={<Home />} />

          {/* register page */}
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />

          {/* Generator Page  */}
          <Route path='/generator' element={<Generator />} />

          <Route path='/workspace' element={<Workspace />} />

          <Route path='/workspace/:id' element={<WorkspaceDashboard />} />
        </Routes>
      </SidebarProvider>
    </div>
  )
}
