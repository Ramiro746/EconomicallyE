import React, { useState, useEffect } from 'react';
import './styles.css'
import { useNavigate } from 'react-router-dom';
import GastosChart from "../Components/GastosChart/GastosChart.jsx";
import InversionesChart from "../Components/InversionesChart/InversionesChart.jsx";
import FormUser from "../Components/FormUser/FormUser.jsx";
import LoginForm from "../Components/Login/LoginForm.jsx";
import SpiralAnimation from "../Components/Logo/Logo";
import CreditCardAnimation from "../Components/CreditCard/credit-card-animation.jsx";
import FinancialDashboard from "../Components/FinancialDashboard.jsx";



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
            const section = document.getElementById('form');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' }); // desplazamiento suave
            }
        } else {
            openLoginModal();
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
                    <button>Ahorro</button>
                    <button>Resumen</button>
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


            <section className="information" id="form">

                <div>
                    <FinancialDashboard/>
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