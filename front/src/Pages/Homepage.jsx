"use client"

import { useState, useEffect } from "react"
import "./styles.css"
import "../Components/Footer/footer.css"
import { useNavigate } from "react-router-dom"
import FloatingShapes from "./Fondo/HeroGeometric.jsx"
import SpiralAnimation from "../Components/Logo/Logo"
import CreditCardAnimation from "../Components/CreditCard/credit-card-animation.jsx"
import FinancialDashboard from "../Components/FinancialDashboard.jsx"
import Footer from "../Components/Footer/footer.jsx"
import { motion } from "framer-motion"
import Inflation from "../Components/Inflation/Inflation.jsx"
import { TrendingUp, DollarSign, PieChart, Target, Brain, BarChart3 } from "lucide-react"
import ScrollNav from "../Components/Nav/ScrollNav.jsx"
import AuthModal from "../Components/NuevoModal/auth-modal.jsx"

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
    const [modalOpen, setModalOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [graficoActivo, setGraficoActivo] = useState("gastos")
    const [hasCompletedFirstForm, setHasCompletedFirstForm] = useState(false)
    const [loadingAdviceHistory, setLoadingAdviceHistory] = useState(false)
    // Nuevo estado para controlar la visibilidad del header
    const [headerVisible, setHeaderVisible] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            fetchUserData(token)
        }
    }, [])

    // Nuevo useEffect para manejar el scroll del header
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 150
            setHeaderVisible(!scrolled)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const fetchUserData = async (token) => {
        try {
            const res = await fetch("http://localhost:8080/api/users/me", {
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

            const response = await fetch(`http://localhost:8080/api/advice/${userId}`, {
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

    const openModal = (e) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        setModalOpen(true)
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
        setModalOpen(false)
    }

    const handleStartNow = () => {
        if (user) {
            const section = document.getElementById("form")
            if (section) {
                section.scrollIntoView({ behavior: "smooth" })
            }
        } else {
            openModal()
        }
    }

    // Configurar los enlaces para el ScrollNav
    const scrollNavLinks = [
        {
            href: "#inicio",
            label: "Inicio",
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        },
        ...(user
            ? [
                {
                    href: "#MiCuenta",
                    label: "Mi Cuenta",
                    onClick: () => navigate(`/perfil/${user.id}`),
                },
                {
                    href: "#",
                    label: "Dashboard",
                    onClick: () => navigate(`/dashboard/${user.id}`),
                },
                ...(hasCompletedFirstForm
                    ? [
                        {
                            href: "#Consejos",
                            label: "Consejos",
                            onClick: () => navigate(`/consejos/${user.id}`),
                        },
                    ]
                    : []),
            ]
            : []),
        {
            href: "#herramientas",
            label: "Herramientas",
            onClick: () => {
                const section = document.querySelector(".financial-features")
                if (section) {
                    section.scrollIntoView({ behavior: "smooth" })
                }
            },
        },
    ]

    return (
        <div className="container">
            {/* ScrollNav */}
            <ScrollNav
                links={scrollNavLinks}
                user={user}
                onSignOut={signOut}
                onOpenLogin={openModal}
                onOpenRegister={openModal}
            />

            <FloatingShapes />

            {/* Header principal con animación de desaparición */}
            <header className={`main-header ${headerVisible ? "header-visible" : "header-hidden"}`}>
                <div className="container-logo">
                    <SpiralAnimation />
                    <h3>EconomicallyE</h3>
                </div>
                {user && (
                    <div className="items">
                        <button onClick={() => navigate(`/perfil/${user.id}`)} className="header-nav-btn">Cuenta
                        </button>
                        <button onClick={() => navigate(`/dashboard/${user.id}`)} className="header-nav-btn">Progreso
                        </button>
                    </div>
                )}
                {!user && (
                    <div className="header-buttons">
                        <button onClick={openModal} className="login-btn">
                            Login
                        </button>
                        <button onClick={openModal} className="register-btn">
                            Register
                        </button>
                    </div>
                )}
                {user && (
                    <div className="header-buttons">
                        <button onClick={signOut} className="sign-out-btn">Sign-Out</button>

                    </div>
                )}
            </header>

            {/* Hero Section actualizada */}
            <section className="content" id="inicio">
                <div>
                    <motion.h1 custom={0} initial="hidden" animate="visible" variants={fadeUpVariants}>
                        {user ? `¡Bienvenido de vuelta, ${user.name}!` : "EconomicallyE"}
                    </motion.h1>

                    <motion.h2 custom={1} initial="hidden" animate="visible" variants={fadeUpVariants}>
                        {user ? "El impulso para tus sueños" : "Tu guía financiera inteligente"}
                    </motion.h2>

                    <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUpVariants}>
                        {user
                            ? "Continúa mejorando tu salud financiera con nosotros."
                            : "Ahorra con cabeza, planifica con IA. Transforma tus finanzas personales con consejos inteligentes basados en tus ingresos, gastos y metas."}
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

            {/* Nueva sección: ¿Qué es EconomicallyE? */}
            <section className="about-section">
                <motion.div
                    className="about-container"
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUpVariants}
                >
                    <div className="about-header">
                        <h3>¿Qué es EconomicallyE?</h3>
                        <p className="about-description">
                            EconomicallyE es una aplicación web diseñada para ayudarte a tomar el control de tus finanzas personales de forma sencilla e inteligente. A través de un análisis basado en tus ingresos, gastos y metas de ahorro, la aplicación genera recomendaciones personalizadas con el apoyo de inteligencia artificial.
                        </p>
                    </div>

                    <div className="about-features">
                        <motion.div
                            className="about-feature"
                            custom={3}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariants}
                        >
                            <div className="about-icon">
                                <Brain className="w-6 h-6" />
                            </div>
                            <div className="about-text">
                                <h4>Inteligencia Artificial</h4>
                                <p>Consejos personalizados generados con IA basados en tu situación financiera real</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="about-feature"
                            custom={4}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariants}
                        >
                            <div className="about-icon">
                                <Target className="w-6 h-6" />
                            </div>
                            <div className="about-text">
                                <h4>Metas Personalizadas</h4>
                                <p>Establece objetivos de ahorro adaptados a tus ingresos y gastos actuales</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="about-feature"
                            custom={5}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariants}
                        >
                            <div className="about-icon">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div className="about-text">
                                <h4>Seguimiento Completo</h4>
                                <p>Consulta tu índice de ahorro y sigue tu progreso financiero mes a mes</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            <section className="financial-features" id="herramientas">
                <motion.div
                    className="features-container"
                    custom={6}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUpVariants}
                >
                    <div className="feature-header">
                        <h3>Porque tus finanzas también merecen inteligencia</h3>
                        <p>Planifica, ahorra y crece con una plataforma que entiende tu economía y te guía paso a paso</p>
                    </div>

                    <div className="features-grid">
                        <motion.div
                            className="feature-card"
                            custom={7}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariants}
                        >
                            <div className="feature-icon">
                                <DollarSign className="w-8 h-8" />
                            </div>
                            <h4>Gestión Inteligente</h4>
                            <p>Registra tus gastos fijos y variables, y recibe sugerencias para optimizar tus hábitos financieros</p>
                        </motion.div>

                        <motion.div
                            className="feature-card"
                            custom={8}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariants}
                        >
                            <div className="feature-icon">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <h4>Monitoreo de Inflación</h4>
                            <p>Mantente al día con los indicadores económicos clave para proteger tu patrimonio</p>
                            <div className="feature-demo">
                                <Inflation />
                            </div>
                        </motion.div>

                        <motion.div
                            className="feature-card"
                            custom={9}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariants}
                        >
                            <div className="feature-icon">
                                <PieChart className="w-8 h-8" />
                            </div>
                            <h4>Tu Asistente de Ahorro Personal</h4>
                            <p>Conoce tu índice de ahorro, sigue tu progreso y alcanza tus metas financieras con ayuda de la IA</p>
                            <div className="feature-preview">
                                <div className="chart-placeholder">
                                    <div className="chart-bar" style={{ height: "60%" }}></div>
                                    <div className="chart-bar" style={{ height: "80%" }}></div>
                                    <div className="chart-bar" style={{ height: "40%" }}></div>
                                    <div className="chart-bar" style={{ height: "90%" }}></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {user && loadingAdviceHistory && (
                <section className="information">
                    <div className="text-center p-4">
                        <p>Verificando tu progreso...</p>
                    </div>
                </section>
            )}

            {user && !hasCompletedFirstForm && !loadingAdviceHistory && (
                <section className="information" id="form">
                    <div>
                        <FinancialDashboard onFormCompleted={markFirstFormAsCompleted} />
                    </div>
                </section>
            )}

            {/*<CreditCardAnimation />*/}

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
                        className="modal-content-new"
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                    >
                        <button className="modal-close" onClick={closeModal} aria-label="Cerrar modal">
                            &times;
                        </button>
                        <AuthModal closeModal={closeModal} />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default Homepage