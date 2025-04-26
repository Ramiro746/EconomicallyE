import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from "./Components/Login/Login.jsx";
import FormUser from "./Components/FormUser/FormUser.jsx";
import Register from "./Components/Register/Register.jsx";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/formUser" element={<FormUser/>} />
            </Routes>
        </Router>
    );
}

export default App
