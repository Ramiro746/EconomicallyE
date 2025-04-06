import React from 'react';
import './styles.css'
import { useNavigate } from 'react-router-dom';
import Login from "../Components/Login.jsx";

const Homepage = () => {
    const navigate = useNavigate();

    return (
        <div className= "container">
            <div className="header">
                <button onClick={() => navigate('/login')} >Login</button>
                <button onClick={() => navigate('/register')} >Register</button>
            </div>
            <div className="content">
                <h1>Bienvenido a EconomicallyE</h1>
                <p>Tu plataforma para mejorar tu salud financiera.</p>
            </div>
        </div>
    );
};

export default Homepage;
