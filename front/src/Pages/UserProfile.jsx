"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Perfil.css"
<<<<<<< HEAD
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js"
=======
import ScrollNav from "../Components/Nav/ScrollNav.jsx"
import Footer from "../Components/Footer/footer.jsx"
import { motion, AnimatePresence } from "framer-motion"
>>>>>>> 8a7f4e6 (front listisimo sin el properties)

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

<<<<<<< HEAD
function Perfil() {
=======
// Componente del Modal de Carga
const LoadingModal = ({ isVisible, onClose }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="loading-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="loading-modal-content"
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <div className="loading-modal-header">
                            <div className="loading-brain-icon">
                                <div className="brain-wave"></div>
                                <div className="brain-wave"></div>
                                <div className="brain-wave"></div>
                            </div>
                        </div>

                        <div className="loading-modal-body">
                            <h3>Generando tu consejo personalizado</h3>
                            <p>Nuestro asistente está analizando tu situación financiera...</p>

                            <div className="loading-steps">
                                <div className="loading-step active">
                                    <div className="step-icon">📊</div>
                                    <span>Analizando ingresos</span>
                                </div>
                                <div className="loading-step active">
                                    <div className="step-icon">💰</div>
                                    <span>Evaluando gastos</span>
                                </div>
                                <div className="loading-step active">
                                    <div className="step-icon">🎯</div>
                                    <span>Revisando metas</span>
                                </div>
                                <div className="loading-step">
                                    <div className="step-icon">🤖</div>
                                    <span>Generando recomendaciones</span>
                                </div>
                            </div>

                            <div className="progress-bar-container">
                                <div className="progress-bar">
                                    <div className="progress-fill"></div>
                                </div>
                            </div>
                        </div>

                        <div className="loading-particles">
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}


export default function PerfilEditable() {
    // Estados principales
>>>>>>> 8a7f4e6 (front listisimo sin el properties)
    const [overview, setOverview] = useState(null)
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

<<<<<<< HEAD
    const updateUserDataInLocalStorage = (userData) => {
        try {
            const currentData = JSON.parse(localStorage.getItem("user")) || {}
            const updatedData = { ...currentData, ...userData }
            localStorage.setItem("user", JSON.stringify(updatedData))
=======
    // Estado para el modal de carga del consejo
    const [generatingAdvice, setGeneratingAdvice] = useState(false)

    // Estados de edición
    const [editingIncome, setEditingIncome] = useState(false)
    const [editingFixed, setEditingFixed] = useState(false)
    const [editingVariable, setEditingVariable] = useState(false)
    const [editingGoals, setEditingGoals] = useState(false)
>>>>>>> 8a7f4e6 (front listisimo sin el properties)

            if (userData.monthlyIncome !== undefined) {
                localStorage.setItem("monthlyIncome", userData.monthlyIncome.toString())
            }

            console.log("✅ Datos actualizados en localStorage:", updatedData)
            console.log("💰 Monthly Income guardado:", updatedData.monthlyIncome)

            return updatedData
        } catch (error) {
            console.error("❌ Error al actualizar localStorage:", error)
            return null
        }
    }

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const token = localStorage.getItem("token")

                const res = await fetch(`http://localhost:8080/api/users/me`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!res.ok) throw new Error("No se pudo obtener el usuario")

                const data = await res.json()
                const currentUserId = data.id
                setUserId(currentUserId)

                const overviewRes = await fetch(`http://localhost:8080/api/overview/${currentUserId}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                if (!overviewRes.ok) throw new Error("No se pudo obtener el overview")

                const overviewData = await overviewRes.json()

                let detailedFixedExpenses = []
                try {
                    const fixedExpensesRes = await fetch(`http://localhost:8080/api/fixed-expenses/${currentUserId}`, {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    })
                    if (fixedExpensesRes.ok) {
                        detailedFixedExpenses = await fixedExpensesRes.json()
                    }
                } catch (fixedError) {
                    console.warn("No se pudieron cargar los gastos fijos detallados:", fixedError)
                }

                let detailedVariableExpenses = []
                try {
                    const variableExpensesRes = await fetch(`http://localhost:8080/api/variable-expenses/${currentUserId}`, {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    })
                    if (variableExpensesRes.ok) {
                        detailedVariableExpenses = await variableExpensesRes.json()
                    }
                } catch (variableError) {
                    console.warn("No se pudieron cargar los gastos variables detallados:", variableError)
                }

                let detailedGoals = []
                try {
                    const goalsRes = await fetch(`http://localhost:8080/api/goals/${currentUserId}`, {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    })
                    if (goalsRes.ok) {
                        detailedGoals = await goalsRes.json()
                    }
                } catch (goalsError) {
                    console.warn("No se pudieron cargar las metas detalladas:", goalsError)
                }

                const enhancedOverview = {
                    ...overviewData,
                    fixedExpenses: detailedFixedExpenses.length > 0 ? detailedFixedExpenses : overviewData.fixedExpenses || [],
                    variableExpenses:
                        detailedVariableExpenses.length > 0 ? detailedVariableExpenses : overviewData.variableExpenses || [],
                    goals: detailedGoals.length > 0 ? detailedGoals : overviewData.goals || [],
                }

                console.log("Datos recibidos:", enhancedOverview)
                setOverview(enhancedOverview)

                if (enhancedOverview.monthlyIncome !== undefined) {
                    updateUserDataInLocalStorage({
                        id: currentUserId,
                        email: data.email,
                        name: data.name,
                        monthlyIncome: enhancedOverview.monthlyIncome,
                    })
                }
            } catch (error) {
                console.error("Error al cargar el perfil: ", error)
                setError("No se pudo obtener el perfil")
            } finally {
                setLoading(false)
            }
        }

        fetchOverview()
    }, [])

    const handleGenerateAdvice = async () => {
        setGeneratingAdvice(true) // Mostrar modal de carga

        try {
            const token = localStorage.getItem("token")

            if (!overview || !userId) {
                alert("No hay datos suficientes para generar el consejo. Por favor, recarga la página.")
                return
            }

            const requestData = {
                userId: userId,
                income: overview.monthlyIncome || 0,
                goals: (overview.goals || []).map((goal) => ({
                    id: goal.id,
                    name: goal.name || "",
                    description: goal.description || "",
                    targetAmount: goal.targetAmount || 0,
                    currentAmount: goal.currentAmount || 0,
                    targetDate: goal.targetDate || null,
                })),
                fixedExpenses: (overview.fixedExpenses || []).map((expense) => ({
                    id: expense.id,
                    name: expense.name || expense.description || "",
                    amount: expense.amount || 0,
                    category: expense.category || "",
                })),
                variableExpenses: (overview.variableExpenses || []).map((expense) => ({
                    id: expense.id,
                    name: expense.name || expense.description || "",
                    amount: expense.amount || 0,
                    category: expense.category || "",
                    date: expense.date || null,
                })),
            }

            console.log("Datos enviados para generar consejo:", requestData)

            const response = await fetch(`http://localhost:8080/api/advice`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(requestData),
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error("Error del servidor:", errorText)
                throw new Error(`Error generando el consejo: ${response.status} - ${errorText}`)
            }

<<<<<<< HEAD
            const result = await response.json()
            console.log("Consejo generado exitosamente:", result)
=======
            // Simular un pequeño delay para mostrar el modal
            await new Promise(resolve => setTimeout(resolve, 1000))
>>>>>>> 8a7f4e6 (front listisimo sin el properties)

            alert("Nuevo consejo generado correctamente.")
            navigate(`/consejos/${userId}`);

        } catch (error) {
            console.error("Error al generar el consejo:", error)
            alert(`No se pudo generar el nuevo consejo: ${error.message}`)
        }finally {
            setGeneratingAdvice(false) // Ocultar modal de carga
        }
    }

    if (loading) {
        return (
            <div className="modern-loading-container">
                <div className="spinner-container">
                    <div className="loading-spinner-modern">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                    </div>
                </div>

                <div className="loading-background">
                    <div className="floating-shape shape-1"></div>
                    <div className="floating-shape shape-2"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-card">
                    <h2>❌ Error</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => navigate("/")}>
                        Volver al Inicio
                    </button>
                </div>
            </div>
        )
    }

    if (!overview) {
        return (
            <div className="error-container">
                <div className="error-card">
                    <h2>⚠️ Sin Datos</h2>
                    <p>No hay datos disponibles para mostrar.</p>
                    <button className="btn btn-primary" onClick={() => navigate("/")}>
                        Volver al Inicio
                    </button>
                </div>
            </div>
        )
    }

    // Calcular totales con validaciones
    const fixedExpenses = overview.fixedExpenses || []
    const variableExpenses = overview.variableExpenses || []
    const goals = overview.goals || []
    const monthlyIncome = overview.monthlyIncome || 0

    const totalFixed = fixedExpenses.reduce((sum, e) => sum + (e?.amount || 0), 0)
    const totalVariable = variableExpenses.reduce((sum, e) => sum + (e?.amount || 0), 0)
    const totalExpenses = totalFixed + totalVariable
    const totalSavings = monthlyIncome - totalExpenses

    return (
<<<<<<< HEAD
        <div className="profile-container">
=======
        <div className="elegant-profile-container">
            {/* Modal de carga para generar consejo */}
            <LoadingModal isVisible={generatingAdvice} />

            {/* Formas de fondo */}
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            {/* ScrollNav */}
            <ScrollNav links={scrollNavLinks} user={user} />

>>>>>>> 8a7f4e6 (front listisimo sin el properties)
            {/* Header */}
            <header className="profile-header">
                <div className="header-content">
                    <h1 className="welcome-title">Hola, {overview.name}</h1>
                    <div className="header-actions">
                        <button className="btn btn-outline" onClick={() => navigate("/")}>
                            Volver al Inicio
                        </button>
                        <button className="btn btn-outline" onClick={() => navigate(`/editarInfo/${userId}`)}>
                            Editar Información
                        </button>
                        <button className="btn btn-success" onClick={handleGenerateAdvice}>
                            Generar nuevo consejo
                        </button>
                    </div>
                </div>
            </header>

            {/* Resumen económico */}
            <section className="economic-summary">
                <h2 className="section-title">📊 Resumen Económico</h2>
                <div className="summary-grid">
                    <div className="summary-card income">
                        <div className="card-icon">💰</div>
                        <h3>Ingresos Mensuales</h3>
                        <p className="amount">{monthlyIncome.toLocaleString()} €</p>
                    </div>

                    <div className="summary-card expenses">
                        <div className="card-icon">💳</div>
                        <h3>Gastos Totales</h3>
                        <p className="amount">{totalExpenses.toLocaleString()} €</p>
                    </div>

                    <div className={`summary-card ${totalSavings >= 0 ? "savings" : "deficit"}`}>
                        <div className="card-icon">{totalSavings >= 0 ? "🏦" : "⚠️"}</div>
                        <h3>{totalSavings >= 0 ? "Ahorro Estimado" : "Déficit"}</h3>
                        <p className="amount">{Math.abs(totalSavings).toLocaleString()} €</p>
                    </div>

                    <div className="summary-card percentage">
                        <div className="card-icon">📈</div>
                        <h3>% de Ahorro</h3>
                        <p className="amount">{monthlyIncome > 0 ? ((totalSavings / monthlyIncome) * 100).toFixed(1) : "0.0"}%</p>
                    </div>
                </div>
            </section>

            {/* Desglose de gastos */}
            <section className="expenses-breakdown">
                <div className="expenses-grid">
                    <div className="expense-card fixed-expenses">
                        <div className="card-header">
                            <h3>🏠 Gastos Fijos</h3>
                        </div>
                        <div className="card-content">
                            {fixedExpenses.length > 0 ? (
                                <>
                                    <div className="total-amount">
                                        <strong>Total: {totalFixed.toLocaleString()} €</strong>
                                    </div>
                                    <div className="expense-list scrollable-list">
                                        {fixedExpenses.map((expense, index) => (
                                            <div key={expense?.id || index} className="expense-item">
                                                <div className="expense-info">
                          <span className="expense-name">
                            {expense?.name || expense?.description || `Gasto fijo #${index + 1}`}
                          </span>
                                                    {expense?.category && <div className="expense-category">📁 {expense.category}</div>}
                                                </div>
                                                <span className="expense-amount">{expense?.amount || 0} €</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="no-data">No hay gastos fijos registrados</p>
                            )}
                        </div>
                    </div>

                    <div className="expense-card variable-expenses">
                        <div className="card-header">
                            <h3>🛒 Gastos Variables</h3>
                        </div>
                        <div className="card-content">
                            {variableExpenses.length > 0 ? (
                                <>
                                    <div className="total-amount">
                                        <strong>Total: {totalVariable.toLocaleString()} €</strong>
                                    </div>
                                    <div className="expense-list scrollable-list">
                                        {variableExpenses.map((expense, index) => (
                                            <div key={expense?.id || index} className="expense-item">
                                                <div className="expense-info">
                          <span className="expense-name">
                            {expense?.name || expense?.description || `Gasto variable #${index + 1}`}
                          </span>
                                                    {expense?.category && <div className="expense-category">📁 {expense.category}</div>}
                                                    {expense?.date && (
                                                        <div className="expense-date">📅 {new Date(expense.date).toLocaleDateString()}</div>
                                                    )}
                                                </div>
                                                <span className="expense-amount">{expense?.amount || 0} €</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="no-data">No hay gastos variables registrados</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Metas de ahorro */}
            <section className="goals-section">
                <div className="goals-card">
                    <div className="card-header">
                        <h3>🎯 Metas de Ahorro</h3>
                    </div>
                    <div className="card-content">
                        {goals.length > 0 ? (
                            <div className="goals-content">
                                <div className="goals-detail">
                                    <h4>Detalle de Metas</h4>
                                    <div className="goals-list scrollable-list">
                                        {goals.map((goal) => {
                                            const currentAmount = goal?.currentAmount || 0
                                            const targetAmount = goal?.targetAmount || 1
                                            const progress = (currentAmount / targetAmount) * 100
                                            const progressCapped = Math.min(progress, 100)
                                            return (
                                                <div key={goal?.id || Math.random()} className="goal-item">
                                                    <div className="goal-header">
                                                        <h5>{goal?.name || "Meta sin nombre"}</h5>
                                                        <span
                                                            className={`progress-badge ${progress >= 100 ? "complete" : progress >= 50 ? "medium" : "low"}`}
                                                        >
                              {progressCapped.toFixed(1)}%
                            </span>
                                                    </div>
                                                    {goal?.description && <p className="goal-description">{goal.description}</p>}
                                                    <div className="progress-bar">
                                                        <div
                                                            className={`progress-fill ${progress >= 100 ? "complete" : progress >= 50 ? "medium" : "low"}`}
                                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="goal-footer">
                            <span className="goal-amounts">
                              {currentAmount.toLocaleString()}€ / {targetAmount.toLocaleString()}€
                            </span>
                                                        {goal?.targetDate && (
                                                            <span className="goal-date">📅 {new Date(goal.targetDate).toLocaleDateString()}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="no-goals">
                                <div className="no-goals-icon">🎯</div>
                                <h4>No tienes metas de ahorro registradas</h4>
                                <p>¡Establece tus primeras metas para comenzar a ahorrar!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Botones de acción */}
            <section className="actions-section">
                <div className="actions-card">
                    <h3>Acciones Rápidas</h3>
                    <div className="actions-grid">
                        <button className="action-btn primary" onClick={() => navigate(`/consejos/${userId}`)}>
                            💡 Ver Consejos Personalizados
                        </button>
                        <button className="action-btn secondary" onClick={() => navigate(`/editarInfo/${userId}`)}>
                            🎯 Gestionar Metas
                        </button>
                        <button className="action-btn secondary" onClick={() => navigate(`/editarInfo/${userId}`)}>
                            💳 Gestionar Gastos
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Perfil
