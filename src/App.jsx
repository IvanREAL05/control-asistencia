import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import React from "react";
import './App.css'
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Panel from "./components/Panel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </Router>
  );
}

export default App
