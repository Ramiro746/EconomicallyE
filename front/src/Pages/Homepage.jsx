"use client"

import { useState, useEffect } from "react"
import "./styles.css"
import { useNavigate } from "react-router-dom"
import FloatingShapes from "./Fondo/HeroGeometric.jsx"
import FormUser from "../Components/FormUser/FormUser.jsx"
import LoginForm from "../Components/Login/LoginForm.jsx"
import SpiralAnimation from "../Components/Logo/Logo"
import CreditCardAnimation from "../Components/CreditCard/credit-card-animation.jsx"
import FinancialDashboard from "../Components/FinancialDashboard.jsx"
import { motion } from "framer-motion"
import Inflation from "../Components/Inflation/Inflation.jsx"
import { TrendingUp, DollarSign, PieChart } from "lucide-react"

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
}

const Homepage = () => {
    const [modalOpen, setModalOpen] = useState(null) // 'login' o 'register'
    const [isClosing, setIsClosing] = useState(false)
    const [user, setUser] = useState(null)
    const [graficoActivo, setGraficoActivo] = useState("gastos")
    const [hasCompletedFirstForm, setHasCompletedFirstForm] = useState(false)
    const [loadingAdviceHistory, setLoadingAdviceHistory] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            fetchUserData(token)
        }
    }, [])

    const fetchUserData = async (token) => {
        try {
            const res = await fetch("https://economicallye-1.onrender.com/api/users/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (res.ok) {
                const userData = await res.json()
                console.log("Usuario recibido:", userData)
                setUser(userData)
                checkUserAdviceHistory(userData.id)
            } else {
                console.error("Token inválido o expirado")
                signOut()
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error)
            signOut()
        }
    }

    const checkUserAdviceHistory = async (userId) => {
        setLoadingAdviceHistory(true)
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                console.error("No se encontró token de autenticación")
                setHasCompletedFirstForm(false)
                return
            }

            const response = await fetch(`https://economicallye-1.onrender.com/api/advice/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const adviceHistory = await response.json()
                console.log("Historial de consejos:", adviceHistory)
                setHasCompletedFirstForm(adviceHistory.length > 0)
            } else {
                console.error("Error al obtener historial de consejos:", response.status)
                setHasCompletedFirstForm(false)
            }
        } catch (error) {
            console.error("Error al verificar historial de consejos:", error)
            setHasCompletedFirstForm(false)
        } finally {
            setLoadingAdviceHistory(false)
        }
    }

    const markFirstFormAsCompleted = () => {
        setHasCompletedFirstForm(true)
    }

    const openLoginModal = (e) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        setIsClosing(false)
        setModalOpen("login")
    }

    const openRegisterModal = (e) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        setIsClosing(false)
        setModalOpen("register")
    }

    const signOut = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        setUser(null)
        setHasCompletedFirstForm(false)
        navigate("/")
    }

    const closeModal = (e) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        setIsClosing(true)
        setTimeout(() => {
            setModalOpen(null)
            setIsClosing(false)
        }, 300)
    }

    const switchModal = (modalType, e) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        console.log("Switching modal to:", modalType)
        setIsClosing(false)
        setModalOpen(modalType)
    }

    const handleStartNow = () => {
        if (user) {
            const section = document.getElementById("form")
            if (section) {
                section.scrollIntoView({ behavior: "smooth" })
            }
        } else {
            openLoginModal()
        }
    }

    return (
        <div className="container">
            <FloatingShapes/>
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
                        <button onClick={openLoginModal} className="login-btn">
                            Login
                        </button>
                        <button onClick={openRegisterModal} className="register-btn">
                            Register
                        </button>
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
                    <motion.h1 custom={0} initial="hidden" animate="visible" variants={fadeUpVariants}>
                        {user ? `¡Bienvenido de vuelta, ${user.name}!` : "Bienvenido a EconomicallyE"}
                    </motion.h1>

                    <motion.h2 custom={1} initial="hidden" animate="visible" variants={fadeUpVariants}>
                        El impulso para tus sueños
                    </motion.h2>

                    <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUpVariants}>
                        {user
                            ? "Continúa mejorando tu salud financiera con nosotros."
                            : "Tu plataforma para mejorar tu salud financiera."}
                    </motion.p>
                </div>
                <div className="cta-section">
                    <motion.button
                        onClick={handleStartNow}
                        className="btn btn-primary"
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUpVariants}
                    >
                        Comienza Ahora
                    </motion.button>
                </div>
            </section>

            {/* Nueva sección de características financieras integrada */}
            <section className="financial-features">
                <motion.div
                    className="features-container"
                    custom={3}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUpVariants}
                >
                    <div className="feature-header">
                        <h3>Herramientas que te ayudan a crecer</h3>
                        <p>Mantente informado sobre el panorama financiero actual</p>
                    </div>

                    <div className="features-grid">
                        {/* Tarjeta de crédito con contexto */}
                        <motion.div
                            className="feature-card"
                            custom={4}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariants}
                        >
                            <div className="feature-icon">
                                <DollarSign className="w-8 h-8"/>
                            </div>
                            <h4>Gestión Inteligente</h4>
                            <p>Optimiza tus gastos con nuestras herramientas avanzadas de análisis financiero</p>

                        </motion.div>

                        {/* Inflación integrada con contexto */}
                        <motion.div
                            className="feature-card"
                            custom={5}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariants}
                        >
                            <div className="feature-icon">
                                <TrendingUp className="w-8 h-8"/>
                            </div>
                            <h4>Monitoreo de Inflación</h4>
                            <p>Mantente al día con los indicadores económicos clave para proteger tu patrimonio</p>
                            <div className="feature-demo">
                                <Inflation/>
                            </div>
                        </motion.div>

                        {/* Tercera característica para balance */}
                        <motion.div
                            className="feature-card"
                            custom={6}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariants}
                        >
                            <div className="feature-icon">
                                <PieChart className="w-8 h-8"/>
                            </div>
                            <h4>Análisis Personalizado</h4>
                            <p>Recibe consejos adaptados a tu situación financiera específica</p>
                            <div className="feature-preview">
                                <div className="chart-placeholder">
                                    <div className="chart-bar" style={{height: "60%"}}></div>
                                    <div className="chart-bar" style={{height: "80%"}}></div>
                                    <div className="chart-bar" style={{height: "40%"}}></div>
                                    <div className="chart-bar" style={{height: "90%"}}></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </motion.div>
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
                        <FinancialDashboard onFormCompleted={markFirstFormAsCompleted}/>
                    </div>
                </section>
            )}

            <CreditCardAnimation/>

            {/* Mensaje cuando ya completó el formulario */}
            {user && hasCompletedFirstForm && !loadingAdviceHistory && (
                <section className="information">
                    <div className="text-center p-4">
                        <h3>¡Ya tienes consejos generados! 🎉</h3>
                        <p>Puedes ver tu historial de consejos en tu perfil.</p>
                        <button onClick={() => navigate(`/consejos/${user.id}`)} className="btn btn-primary mt-3">
                            Ver Historial de Consejos
                        </button>
                    </div>
                </section>
            )}

            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div
                        className={`modal-content ${isClosing ? "closing" : ""}`}
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                    >
                        <button className="modal-close" onClick={closeModal} aria-label="Cerrar modal">
                            &times;
                        </button>
                        {modalOpen === "login" ? (
                            <LoginForm
                                closeModal={closeModal}
                                openRegisterModal={(e) => {
                                    console.log("openRegisterModal called from LoginForm")
                                    switchModal("register", e)
                                }}
                            />
                        ) : (
                            <FormUser
                                onRegisterSuccess={() => {
                                    setTimeout(() => switchModal("login"), 1500)
                                }}
                                closeModal={closeModal}
                                openLoginModal={(e) => {
                                    console.log("openLoginModal called from FormUser")
                                    switchModal("login", e)
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Homepage