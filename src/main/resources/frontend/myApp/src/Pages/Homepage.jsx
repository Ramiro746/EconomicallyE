import React from 'react';
import './styles.css'
import { useNavigate } from 'react-router-dom';
import Login from "../Components/Login/Login.jsx";

const Homepage = () => {
    const navigate = useNavigate();

    return (
        <div className= "container">
            <div className="header">
                <div className="container-logo">
                    <img src="/uzumaki.png" alt="EconomicallyE Logo" width={120} height={120} />
                    <h3>EconomicallyE</h3>
                </div>
                <div className="items">
                    <h4>Cuenta</h4>
                    <h4>Ahorro</h4>
                    <h4>Resumen</h4>
                </div>
                <div className="header-buttons">
                    <button onClick={() => navigate('/login')} className="login-btn">Login</button>
                    <button onClick={() => navigate('/register')} className="register-btn">Register</button>
                </div>
            </div>
            <div className="content">
                <div>

                    <h1>Bienvenido a EconomicallyE</h1>
                    <p>Tu plataforma para mejorar tu salud financiera.</p>
                </div>

                <div className="cta-section">
                    <button onClick={() => navigate("/register")} className="cta-btn">
                        Comienza Ahora
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
