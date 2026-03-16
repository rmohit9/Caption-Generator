import React from 'react'
import "./App.css";
import Home from './pages/HomePage/Home';
import { Routes, Route } from "react-router-dom";
import Register from './pages/Authentication/Register';
import Login from './pages/Authentication/Login';
import Generator from './pages/Generator/Generator';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <div>
      {/* Initialize the UI Alerts */}
      <Toaster position="top-right" reverseOrder={false} /> 
      
      <Routes>
        {/* home / landing page */}
        <Route path='/' element={<Home />} />

        {/* register page */}
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />

        {/* Generator Page  */}

        <Route path='/generator' element={<Generator />} />
      </Routes>
    </div>
  )
}
