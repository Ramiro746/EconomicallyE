import React, { useState, useEffect } from 'react';
import './styles.css'
import { useNavigate } from 'react-router-dom';
import GastosChart from "../Components/GastosChart/GastosChart.jsx";
import AhorroChart from "../Components/AhorroChart/AhorroChart.jsx";
import InversionesChart from "../Components/InversionesChart/InversionesChart.jsx";
import FormUser from "../Components/FormUser/FormUser.jsx";
import LoginForm from "../Components/Login/LoginForm.jsx";
import SpiralAnimation from "../Components/Logo/Logo";
import CreditCardAnimation from "../Components/CreditCard/credit-card-animation.jsx";


const Homepage = () => {
    const [modalOpen, setModalOpen] = useState(null); // 'login' o 'register'
    const [isClosing, setIsClosing] = useState(false);
    const [user, setUser] = useState(null);
    const [graficoActivo, setGraficoActivo] = useState('gastos');
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Función para abrir específicamente el modal de login
    const openLoginModal = () => {
        setModalOpen('login');
    };

    // Función para abrir específicamente el modal de registro
    const openRegisterModal = () => {
        setModalOpen('register');
    };

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

    const signOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setModalOpen(null);
            setIsClosing(false);
        }, 500);
    };

    const handleStartNow = () => {
        if (user) {
            navigate('/advice-form');
        } else {
            openLoginModal(); // Usamos la función específica para login
        }
    };

    return (
        <div className="container">
            <header>
                <div className="container-logo">
                    <SpiralAnimation/>
                    <h3>EconomicallyE</h3>
                </div>
                <div className="items">
                    <button onClick={() => navigate(`/perfil/${user.id}`)}>Cuenta</button>
                    <h4>Ahorro</h4>
                    <h4>Resumen</h4>
                </div>
                {!user && (
                    <div className="header-buttons">
                        <button onClick={openLoginModal} className="login-btn">Login</button>
                        <button onClick={openRegisterModal} className="register-btn">Register</button>
                    </div>
                )}
                {user && (
                    <div className="header-buttons">
                        <button onClick={signOut}>Sign-Out</button>
                    </div>
                )}
            </header>

            <section className="content">
                <div>
                    <h1>
                        {user ? `¡Bienvenido de vuelta, ${user.name}` : 'Bienvenido a EconomicallyE'}
                    </h1>
                    <h2>El impulso para tus sueños</h2>
                    <p> {user ?
                        'Continúa mejorando tu salud financiera con nosotros.' :
                        'Tu plataforma para mejorar tu salud financiera.'
                    }</p>
                </div>
                <div className="cta-section">
                    <button onClick={handleStartNow} className="btn btn-primary">
                        Comienza Ahora
                    </button>

                </div>
            </section>


            <section className="cta-section">
                <div className="w-full flex justify-center items-center mt-8">
                    <CreditCardAnimation/>
                </div>
            </section>


            <section className="information">
                <h1>Visualiza tu situacion financiera</h1>
                <h3>Nuestras herramientas te ayudan a tomar decisiones mejor informadas</h3>
                <div className="buttons">
                    <button className="botones" onClick={() => setGraficoActivo('gastos')}>Analisis de gastos</button>
                    <button className="botones" onClick={() => setGraficoActivo('ahorro')}>Tendencias de ahorro</button>
                    <button className="botones" onClick={() => setGraficoActivo('inversiones')}>Rendimiento de
                        inversiones
                    </button>
                </div>

                <div className="grafico">
                    {renderGrafico()}
                </div>
            </section>

            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className={`modal-content ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal} aria-label="Cerrar modal">
                            &times;
                        </button>
                        {modalOpen === 'login' ?
                            <LoginForm closeModal={closeModal}/> :
                            <FormUser
                                onRegisterSuccess={() => {
                                    closeModal();
                                    setTimeout(() => openLoginModal(), 100); // Pequeño delay para mejor UX
                                }}
                                closeModal={closeModal}
                            />
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default Homepage;