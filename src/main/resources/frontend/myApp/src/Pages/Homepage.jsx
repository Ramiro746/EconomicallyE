import React, { useState } from 'react';
import './styles.css'
import {Link, useNavigate} from 'react-router-dom';
import Login from "../Components/Login/Login.jsx";
import GastosChart from "../Components/GastosChart/GastosChart.jsx";
import AhorroChart from "../Components/AhorroChart/AhorroChart.jsx";
import InversionesChart from "../Components/InversionesChart/InversionesChart.jsx";

const Homepage = () => {
    const navigate = useNavigate();
    const [graficoActivo, setGraficoActivo] = useState('gastos');

    const renderGrafico = () => {
        switch (graficoActivo) {
            case 'gastos':
                return <GastosChart />;
            case 'ahorro':
                return <AhorroChart />;
            case 'inversiones':
                return <InversionesChart />;
            default:
                return null;
        }
    };

    return (
        <div className="container">
            <section className="header">
                <div className="container-logo">
                    <img src="/uzumaki.png" alt="EconomicallyE Logo" width={120} height={120}/>
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
            </section>

            <section className="content">
                <div>
                    <h1>Bienvenido a EconomicallyE</h1>
                    <h2>El impulso para tus sueños</h2>
                    <p>Tu plataforma para mejorar tu salud financiera.</p>
                </div>

                <div className="cta-section">

                    <button onClick={() => navigate("/FormUser")} className="cta-btn">
                        Comienza Ahora
                    </button>
                </div>
            </section>

            <section className="information">
                <h1>Visualiza tu situacion financiera</h1>
                <h3>Nuestras herramientas te ayudan a tomar decisiones mejor informadas</h3>
                <div className="buttons">
                    <button className="botones" onClick={() => setGraficoActivo('gastos')}>Analisis de gastos</button>
                    <button className="botones" onClick={() => setGraficoActivo('ahorro')}>Tendencias de ahorro</button>
                    <button className="botones" onClick={() => setGraficoActivo('inversiones')}>Rendimiento de inversiones</button>
                </div>

                <div className="grafico">
                    {renderGrafico()}
                </div>
            </section>

        </div>
    );
};

export default Homepage;
