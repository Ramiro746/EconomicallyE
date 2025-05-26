import React, { useState, useEffect } from 'react';
import './styles.css'
import { useNavigate } from 'react-router-dom';
import FloatingShapes from "./Fondo/HeroGeometric.jsx"
import GastosChart from "../Components/GastosChart/GastosChart.jsx";
import InversionesChart from "../Components/InversionesChart/InversionesChart.jsx";
import FormUser from "../Components/FormUser/FormUser.jsx";
import LoginForm from "../Components/Login/LoginForm.jsx";
import SpiralAnimation from "../Components/Logo/Logo";
import CreditCardAnimation from "../Components/CreditCard/credit-card-animation.jsx";
import FinancialDashboard from "../Components/FinancialDashboard.jsx";
import { motion } from "framer-motion"

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            delay: 0.3 + i * 0.2,
            ease: [0.25, 0.4, 0.25, 1],
        },
    }),
};

const Homepage = () => {
    const [modalOpen, setModalOpen] = useState(null); // 'login' o 'register'
    const [isClosing, setIsClosing] = useState(false);
    const [user, setUser] = useState(null);
    const [graficoActivo, setGraficoActivo] = useState('gastos');
    const [hasCompletedFirstForm, setHasCompletedFirstForm] = useState(false);
    const [loadingAdviceHistory, setLoadingAdviceHistory] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const userParsed = JSON.parse(userData);
            setUser(userParsed);
            // Verificar si el usuario tiene consejos en su historial
            checkUserAdviceHistory(userParsed.id);
        }
    }, []);

    const checkUserAdviceHistory = async (userId) => {
        setLoadingAdviceHistory(true);
        try {
            const token = localStorage.getItem('token'); // ✅ Obtener token del localStorage

            if (!token) {
                console.error('No se encontró token de autenticación');
                setHasCompletedFirstForm(false);
                return;
            }

            // ✅ Verificar historial de consejos directamente
            const response = await fetch(`http://localhost:8080/api/advice/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const adviceHistory = await response.json();
                console.log('Historial de consejos:', adviceHistory);
                // Si tiene al menos un consejo, significa que ya completó el formulario inicial
                setHasCompletedFirstForm(adviceHistory.length > 0);
            } else {
                console.error('Error al obtener historial de consejos:', response.status);
                setHasCompletedFirstForm(false);
            }
        } catch (error) {
            console.error('Error al verificar historial de consejos:', error);
            // En caso de error, asumimos que no ha completado el formulario
            setHasCompletedFirstForm(false);
        } finally {
            setLoadingAdviceHistory(false);
        }
    };

    // Función para marcar que el formulario fue completado (ahora también actualiza el estado)
    const markFirstFormAsCompleted = () => {
        setHasCompletedFirstForm(true);
    };

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
        setHasCompletedFirstForm(false);
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
            <FloatingShapes />
            <header>
                <div className="container-logo">
                    <SpiralAnimation/>
                    <h3>EconomicallyE</h3>
                </div>
                {user && (
                    <div className="items">
                        <button onClick={() => navigate(`/perfil/${user.id}`)}>Cuenta</button>
                        <button onClick={() => navigate(`/editarInfo/${user.id}`)}>Editar</button>
                        <button onClick={() => navigate(`/dashboard/${user.id}`)}>Progreso</button>
                    </div>
                )}
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
                    <motion.h1
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUpVariants}
                    >
                        {user ? `¡Bienvenido de vuelta, ${user.name}!` : 'Bienvenido a EconomicallyE'}
                    </motion.h1>

                    <motion.h2
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUpVariants}
                    >
                        El impulso para tus sueños
                    </motion.h2>

                    <motion.p
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUpVariants}
                    >
                        {user
                            ? 'Continúa mejorando tu salud financiera con nosotros.'
                            : 'Tu plataforma para mejorar tu salud financiera.'}
                    </motion.p>
                </div>
                <div className="cta-section">
                    <motion.button onClick={handleStartNow} className="btn btn-primary"
                                   custom={1}
                                   initial="hidden"
                                   animate="visible"
                                   variants={fadeUpVariants}>
                        Comienza Ahora
                    </motion.button>
                </div>
            </section>

            <section className="cta-section">
                <div className="w-full flex justify-center items-center mt-8">
                    <CreditCardAnimation/>
                </div>
            </section>

            {/* Loading state */}
            {user && loadingAdviceHistory && (
                <section className="information">
                    <div className="text-center p-4">
                        <p>Verificando tu progreso...</p>
                    </div>
                </section>
            )}

            {/* Solo mostrar FinancialDashboard si el usuario está logueado, NO ha completado su primer formulario y no está cargando */}
            {user && !hasCompletedFirstForm && !loadingAdviceHistory && (
                <section className="information" id="form">
                    <div>
                        <FinancialDashboard onFormCompleted={markFirstFormAsCompleted} />
                    </div>
                </section>
            )}

            {/* Mensaje cuando ya completó el formulario */}
            {user && hasCompletedFirstForm && !loadingAdviceHistory && (
                <section className="information">
                    <div className="text-center p-4">
                        <h3>¡Ya tienes consejos generados! 🎉</h3>
                        <p>Puedes ver tu historial de consejos en tu perfil.</p>
                        <button
                            onClick={() => navigate(`/historial-consejos/${user.id}`)}
                            className="btn btn-primary mt-3"
                        >
                            Ver Historial de Consejos
                        </button>
                    </div>
                </section>
            )}

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