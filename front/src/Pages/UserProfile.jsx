"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Perfil.css"
import ScrollNav from "../Components/Nav/ScrollNav.jsx"
import Footer from "../Components/Footer/footer.jsx"
import { motion, AnimatePresence } from "framer-motion"

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            delay: 0.1 + i * 0.1,
            ease: [0.25, 0.4, 0.25, 1],
        },
    }),
}

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
    const [overview, setOverview] = useState(null)
    const [hasCompletedFirstForm, setHasCompletedFirstForm] = useState(false)
    const [user, setUser] = useState(null)
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    // Estado para el modal de carga del consejo
    const [generatingAdvice, setGeneratingAdvice] = useState(false)

    // Estados de edición
    const [editingIncome, setEditingIncome] = useState(false)
    const [editingFixed, setEditingFixed] = useState(false)
    const [editingVariable, setEditingVariable] = useState(false)
    const [editingGoals, setEditingGoals] = useState(false)

    // Estados de datos editables
    const [monthlyIncome, setMonthlyIncome] = useState(0)
    const [fixedExpenses, setFixedExpenses] = useState([])
    const [variableExpenses, setVariableExpenses] = useState([])
    const [goals, setGoals] = useState([])

    // Opciones de frecuencia
    const frequencyOptions = [
        { value: "MONTHLY", label: "Mensual" },
        { value: "WEEKLY", label: "Semanal" },
        { value: "YEARLY", label: "Anual" },
        { value: "DAILY", label: "Diario" },
    ]

    // Cargar datos iniciales
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

                // Cargar datos detallados
                let detailedFixedExpenses = []
                try {
                    const fixedExpensesRes = await fetch(`http://localhost:8080/api/fixed-expenses/${currentUserId}`, {
                        headers: { Authorization: "Bearer " + token },
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
                        headers: { Authorization: "Bearer " + token },
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
                        headers: { Authorization: "Bearer " + token },
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

                setOverview(enhancedOverview)
                setMonthlyIncome(enhancedOverview.monthlyIncome || 0)
                setFixedExpenses(enhancedOverview.fixedExpenses || [])
                setVariableExpenses(enhancedOverview.variableExpenses || [])
                setGoals(enhancedOverview.goals || [])
            } catch (error) {
                console.error("Error al cargar el perfil: ", error)
                setError("No se pudo obtener el perfil")
            } finally {
                setLoading(false)
            }
        }

        fetchOverview()
    }, [])

    // Funciones de guardado
    const saveIncome = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`http://localhost:8080/api/users/${userId}/income`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ monthlyIncome }),
            })

            if (!res.ok) throw new Error("Error al actualizar el ingreso")

            setOverview((prev) => ({ ...prev, monthlyIncome }))
            setEditingIncome(false)
            localStorage.setItem("monthlyIncome", monthlyIncome.toString())
            alert("Ingreso actualizado correctamente")
        } catch (error) {
            console.error("Error saving income:", error)
            alert("Error al guardar el ingreso")
        } finally {
            setSaving(false)
        }
    }

    const saveItem = async (type, item) => {
        const token = localStorage.getItem("token")
        let endpoint = ""
        if (type === "fixed") endpoint = "fixed-expenses"
        else if (type === "variable") endpoint = "variable-expenses"
        else if (type === "goal") endpoint = "goals"

        let method = "PUT"
        let url = `http://localhost:8080/api/${endpoint}/${item.id}`

        if (item.id >= 1000000000000) {
            method = "POST"
            url = `http://localhost:8080/api/${endpoint}`
            const { id, ...itemWithoutId } = item
            item = { ...itemWithoutId, userId }
        }

        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(item),
        })

        if (!res.ok) throw new Error(`Error al guardar ${endpoint}`)
        return await res.json()
    }

    const saveAllItems = async (type) => {
        setSaving(true)
        try {
            let items = []
            if (type === "fixed") items = fixedExpenses
            else if (type === "variable") items = variableExpenses
            else if (type === "goal") items = goals

            const savePromises = items
                .filter((item) => item.name && (type === "goal" ? item.targetAmount : item.amount))
                .map((item) => saveItem(type, item))

            const savedItems = await Promise.all(savePromises)

            if (type === "fixed") {
                setFixedExpenses(savedItems)
                setEditingFixed(false)
            } else if (type === "variable") {
                setVariableExpenses(savedItems)
                setEditingVariable(false)
            } else if (type === "goal") {
                setGoals(savedItems)
                setEditingGoals(false)
            }

            // Actualizar overview
            setOverview((prev) => ({
                ...prev,
                [type === "fixed" ? "fixedExpenses" : type === "variable" ? "variableExpenses" : "goals"]: savedItems,
            }))

            alert("Cambios guardados correctamente")
        } catch (error) {
            console.error(`Error saving ${type}:`, error)
            alert(`Error al guardar ${type}`)
        } finally {
            setSaving(false)
        }
    }

    // Funciones de manipulación de datos
    const addItem = (type) => {
        const tempId = Date.now()

        if (type === "fixed") {
            setFixedExpenses((prev) => [
                ...prev,
                {
                    id: tempId,
                    name: "",
                    amount: 0,
                    frequency: "MONTHLY",
                    description: "",
                    userId,
                },
            ])
        } else if (type === "variable") {
            setVariableExpenses((prev) => [
                ...prev,
                {
                    id: tempId,
                    name: "",
                    amount: 0,
                    expenseDate: new Date().toISOString().split("T")[0],
                    description: "",
                    userId,
                },
            ])
        } else if (type === "goal") {
            setGoals((prev) => [
                ...prev,
                {
                    id: tempId,
                    name: "",
                    targetAmount: 0,
                    savedAmount: 0,
                    description: "",
                    deadline: "",
                    userId,
                },
            ])
        }
    }

    const deleteItem = async (type, id) => {
        if (id >= 1000000000000) {
            // Item temporal, solo remover del estado
            if (type === "fixed") setFixedExpenses((prev) => prev.filter((e) => e.id !== id))
            else if (type === "variable") setVariableExpenses((prev) => prev.filter((e) => e.id !== id))
            else if (type === "goal") setGoals((prev) => prev.filter((e) => e.id !== id))
            return
        }

        try {
            const token = localStorage.getItem("token")
            let endpoint = ""
            if (type === "fixed") endpoint = "fixed-expenses"
            else if (type === "variable") endpoint = "variable-expenses"
            else if (type === "goal") endpoint = "goals"

            const res = await fetch(`https://economicallye-1.onrender.com/api/${endpoint}/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })

            if (res.ok) {
                if (type === "fixed") setFixedExpenses((prev) => prev.filter((e) => e.id !== id))
                else if (type === "variable") setVariableExpenses((prev) => prev.filter((e) => e.id !== id))
                else if (type === "goal") setGoals((prev) => prev.filter((e) => e.id !== id))
                alert("Elemento eliminado correctamente")
            }
        } catch (error) {
            console.error("Error deleting:", error)
            alert("Error al eliminar el elemento")
        }
    }

    const updateField = (type, id, field, value) => {
        if (type === "fixed") {
            setFixedExpenses((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
        } else if (type === "variable") {
            setVariableExpenses((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
        } else if (type === "goal") {
            setGoals((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
        }
    }

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
                throw new Error(`Error generando el consejo: ${response.status} - ${errorText}`)
            }

            // Simular un pequeño delay para mostrar el modal
            await new Promise(resolve => setTimeout(resolve, 1000))

            alert("Nuevo consejo generado correctamente.")
            navigate(`/consejos/${userId}`);

        } catch (error) {
            console.error("Error al generar el consejo:", error)
            alert(`No se pudo generar el nuevo consejo: ${error.message}`)
        }finally {
            setGeneratingAdvice(false) // Ocultar modal de carga
        }
    }

    // Calcular totales
    const totalFixed = fixedExpenses.reduce((sum, e) => sum + (e?.amount || 0), 0)
    const totalVariable = variableExpenses.reduce((sum, e) => sum + (e?.amount || 0), 0)
    const totalExpenses = totalFixed + totalVariable
    const totalSavings = monthlyIncome - totalExpenses

    if (loading) {
        return (
            <div className="elegant-loading-container">
                <div className="loading-content">
                    <div className="loading-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                    </div>
                    <h3>Cargando tu perfil financiero...</h3>
                </div>
                <div className="loading-background">
                    <div className="floating-shape shape-1"></div>
                    <div className="floating-shape shape-2"></div>
                    <div className="floating-shape shape-3"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="elegant-error-container">
                <div className="error-content">
                    <div className="error-icon">⚠️</div>
                    <h2>Oops! Algo salió mal</h2>
                    <p>{error}</p>
                    <button className="elegant-btn primary" onClick={() => window.location.reload()}>
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    // Configurar los enlaces para el ScrollNav
    const scrollNavLinks = [
        {
            href: "#inicio",
            label: "Inicio",
            onClick: () => navigate("/"),
        },
        {
            href: "#consejos",
            label: "Ver Consejos",
            onClick: () => navigate(`/consejos/${userId}`),
        },
        {
            href: "#dashboard",
            label: "Dashboard",
            onClick: () => navigate(`/dashboard/${userId}`),
        },
        {
            href: "#generar",
            label: "Generar Consejo",
            onClick: handleGenerateAdvice,
        },
    ]

    return (
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

            {/* Header */}
            <motion.header className="elegant-header" initial="hidden" animate="visible" variants={fadeUpVariants} custom={0}>
                <div className="header-content">
                    <div className="welcome-section">
                        <h1 className="welcome-title">
                            Hola, <span className="highlight">{overview?.name}</span>
                        </h1>
                        <p className="welcome-subtitle">Gestiona tu futuro financiero</p>
                    </div>
                    <div className="header-actions">
                        <button className="elegant-btn primary" onClick={() => navigate(`/consejos/${userId}`)}>
                            <span className="btn-icon"></span>
                            Ver Consejos
                        </button>
                        <button className="elegant-btn secondary" onClick={handleGenerateAdvice}>
                            <span className="btn-icon"></span>
                            Generar Consejo
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Resumen económico */}
            <motion.section
                className="economic-overview"
                initial="hidden"
                animate="visible"
                variants={fadeUpVariants}
                custom={1}
            >
                <h2 className="section-title">
                    <span className="title-icon"></span>
                    Resumen Financiero
                </h2>
                <div className="overview-grid">
                    <div className="overview-card income">
                        <div className="card-header">
                            <div className="card-icon"></div>
                            <h3>Ingresos</h3>
                        </div>
                        <div className="card-value">€{monthlyIncome.toLocaleString()}</div>
                        <div className="card-label">Mensuales</div>
                    </div>

                    <div className="overview-card expenses">
                        <div className="card-header">
                            <div className="card-icon"></div>
                            <h3>Gastos</h3>
                        </div>
                        <div className="card-value">€{totalExpenses.toLocaleString()}</div>
                        <div className="card-label">Totales</div>
                    </div>

                    <div className={`overview-card ${totalSavings >= 0 ? "savings" : "deficit"}`}>
                        <div className="card-header">
                            <div className="card-icon">{totalSavings >= 0 ? "" : ""}</div>
                            <h3>{totalSavings >= 0 ? "Ahorro" : "Déficit"}</h3>
                        </div>
                        <div className="card-value">€{Math.abs(totalSavings).toLocaleString()}</div>
                        <div className="card-label">Estimado</div>
                    </div>

                    <div className="overview-card percentage">
                        <div className="card-header">
                            <div className="card-icon"></div>
                            <h3>% Ahorro</h3>
                        </div>
                        <div className="card-value">
                            {monthlyIncome > 0 ? ((totalSavings / monthlyIncome) * 100).toFixed(1) : "0.0"}%
                        </div>
                        <div className="card-label">Del ingreso</div>
                    </div>
                </div>
            </motion.section>

            {/* Ingreso Mensual */}
            <motion.section
                className="income-section"
                initial="hidden"
                animate="visible"
                variants={fadeUpVariants}
                custom={2}
            >
                <div className="elegant-card">
                    <div className="card-header">
                        <h3>
                            <span className="header-icon"></span>
                            Ingreso Mensual
                        </h3>
                        <button className="elegant-btn outline" onClick={() => setEditingIncome(!editingIncome)}>
                            {editingIncome ? "Cancelar" : "Editar"}
                        </button>
                    </div>
                    <div className="card-content">
                        {editingIncome ? (
                            <div className="edit-form">
                                <div className="form-group">
                                    <label>Cantidad (€)</label>
                                    <input
                                        type="number"
                                        className="elegant-input"
                                        value={monthlyIncome}
                                        onChange={(e) => setMonthlyIncome(Number.parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-actions">
                                    <button className="elegant-btn primary" onClick={saveIncome} disabled={saving}>
                                        {saving ? "Guardando..." : "Guardar"}
                                    </button>
                                    <button
                                        className="elegant-btn outline"
                                        onClick={() => {
                                            setMonthlyIncome(overview?.monthlyIncome || 0)
                                            setEditingIncome(false)
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="income-display">
                                <div className="amount-display">€{monthlyIncome.toLocaleString()}</div>
                                <div className="amount-label">Por mes</div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.section>

            {/* Gastos */}
            <motion.section
                className="expenses-section"
                initial="hidden"
                animate="visible"
                variants={fadeUpVariants}
                custom={3}
            >
                <div className="expenses-grid">
                    {/* Gastos Fijos */}
                    <div className="elegant-card fixed-expenses">
                        <div className="card-header">
                            <h3>
                                <span className="header-icon"></span>
                                Gastos Fijos
                            </h3>
                            <div className="header-actions">
                                <span className="total-badge">€{totalFixed.toLocaleString()}</span>
                                {editingFixed && (
                                    <button className="elegant-btn success small" onClick={() => addItem("fixed")}>
                                        Añadir
                                    </button>
                                )}
                                <button className="elegant-btn outline small" onClick={() => setEditingFixed(!editingFixed)}>
                                    {editingFixed ? "Cancelar" : "Editar"}
                                </button>
                            </div>
                        </div>
                        <div className="card-content">
                            {editingFixed ? (
                                <div className="edit-form">
                                    <div className="expense-list">
                                        {fixedExpenses.map((expense) => (
                                            <div key={expense.id} className="expense-edit-item">
                                                <div className="expense-inputs">
                                                    <input
                                                        type="text"
                                                        className="elegant-input"
                                                        value={expense.name || ""}
                                                        onChange={(e) => updateField("fixed", expense.id, "name", e.target.value)}
                                                        placeholder="Nombre del gasto"
                                                    />
                                                    <input
                                                        type="number"
                                                        className="elegant-input"
                                                        value={expense.amount || ""}
                                                        onChange={(e) =>
                                                            updateField("fixed", expense.id, "amount", Number.parseFloat(e.target.value) || 0)
                                                        }
                                                        placeholder="0.00"
                                                    />
                                                    <select
                                                        className="elegant-select"
                                                        value={expense.frequency || "MONTHLY"}
                                                        onChange={(e) => updateField("fixed", expense.id, "frequency", e.target.value)}
                                                    >
                                                        {frequencyOptions.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        className="elegant-input"
                                                        value={expense.description || ""}
                                                        onChange={(e) => updateField("fixed", expense.id, "description", e.target.value)}
                                                        placeholder="Descripción"
                                                    />
                                                </div>
                                                <button className="elegant-btn danger small" onClick={() => deleteItem("fixed", expense.id)}>
                                                    Eliminar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="form-actions">
                                        <button className="elegant-btn primary" onClick={() => saveAllItems("fixed")} disabled={saving}>
                                            {saving ? "Guardando..." : "Guardar Cambios"}
                                        </button>
                                        <button
                                            className="elegant-btn outline"
                                            onClick={() => {
                                                setFixedExpenses(overview?.fixedExpenses || [])
                                                setEditingFixed(false)
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="expense-list-display">
                                    {fixedExpenses.length > 0 ? (
                                        fixedExpenses.map((expense, index) => (
                                            <div key={expense?.id || index} className="expense-display-item">
                                                <div className="expense-info">
                                                    <div className="expense-name">
                                                        {expense?.name || expense?.description || `Gasto fijo #${index + 1}`}
                                                    </div>
                                                    {expense?.frequency && (
                                                        <div className="expense-frequency">
                                                            {frequencyOptions.find((f) => f.value === expense.frequency)?.label || expense.frequency}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="expense-amount">€{expense?.amount || 0}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-data">
                                            <div className="no-data-icon"></div>
                                            <p>No hay gastos fijos registrados</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gastos Variables */}
                    <div className="elegant-card variable-expenses">
                        <div className="card-header">
                            <h3>
                                <span className="header-icon"></span>
                                Gastos Variables
                            </h3>
                            <div className="header-actions">
                                <span className="total-badge">€{totalVariable.toLocaleString()}</span>
                                {editingVariable && (
                                    <button className="elegant-btn success small" onClick={() => addItem("variable")}>
                                        Añadir
                                    </button>
                                )}
                                <button className="elegant-btn outline small" onClick={() => setEditingVariable(!editingVariable)}>
                                    {editingVariable ? "Cancelar" : "Editar"}
                                </button>
                            </div>
                        </div>
                        <div className="card-content">
                            {editingVariable ? (
                                <div className="edit-form">
                                    <div className="expense-list">
                                        {variableExpenses.map((expense) => (
                                            <div key={expense.id} className="expense-edit-item">
                                                <div className="expense-inputs">
                                                    <input
                                                        type="text"
                                                        className="elegant-input"
                                                        value={expense.name || ""}
                                                        onChange={(e) => updateField("variable", expense.id, "name", e.target.value)}
                                                        placeholder="Nombre del gasto"
                                                    />
                                                    <input
                                                        type="number"
                                                        className="elegant-input"
                                                        value={expense.amount || ""}
                                                        onChange={(e) =>
                                                            updateField("variable", expense.id, "amount", Number.parseFloat(e.target.value) || 0)
                                                        }
                                                        placeholder="0.00"
                                                    />
                                                    <input
                                                        type="date"
                                                        className="elegant-input"
                                                        value={expense.expenseDate || ""}
                                                        onChange={(e) => updateField("variable", expense.id, "expenseDate", e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="elegant-input"
                                                        value={expense.description || ""}
                                                        onChange={(e) => updateField("variable", expense.id, "description", e.target.value)}
                                                        placeholder="Descripción"
                                                    />
                                                </div>
                                                <button className="elegant-btn danger small" onClick={() => deleteItem("variable", expense.id)}>
                                                    Eliminar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="form-actions">
                                        <button className="elegant-btn primary" onClick={() => saveAllItems("variable")} disabled={saving}>
                                            {saving ? "Guardando..." : "Guardar Cambios"}
                                        </button>
                                        <button
                                            className="elegant-btn outline"
                                            onClick={() => {
                                                setVariableExpenses(overview?.variableExpenses || [])
                                                setEditingVariable(false)
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="expense-list-display">
                                    {variableExpenses.length > 0 ? (
                                        variableExpenses.map((expense, index) => (
                                            <div key={expense?.id || index} className="expense-display-item">
                                                <div className="expense-info">
                                                    <div className="expense-name">
                                                        {expense?.name || expense?.description || `Gasto variable #${index + 1}`}
                                                    </div>
                                                    {expense?.expenseDate && (
                                                        <div className="expense-date">{new Date(expense.expenseDate).toLocaleDateString()}</div>
                                                    )}
                                                </div>
                                                <div className="expense-amount">€{expense?.amount || 0}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-data">
                                            <div className="no-data-icon"></div>
                                            <p>No hay gastos variables registrados</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Metas de Ahorro */}
            <motion.section className="goals-section" initial="hidden" animate="visible" variants={fadeUpVariants} custom={4}>
                <div className="elegant-card goals">
                    <div className="card-header">
                        <h3>
                            <span className="header-icon"></span>
                            Metas de Ahorro
                        </h3>
                        <div className="header-actions">
                            {editingGoals && (
                                <button className="elegant-btn success small" onClick={() => addItem("goal")}>
                                    Añadir
                                </button>
                            )}
                            <button className="elegant-btn outline small" onClick={() => setEditingGoals(!editingGoals)}>
                                {editingGoals ? "Cancelar" : "Editar"}
                            </button>
                        </div>
                    </div>
                    <div className="card-content">
                        {editingGoals ? (
                            <div className="edit-form">
                                <div className="goals-list">
                                    {goals.map((goal) => (
                                        <div key={goal.id} className="goal-edit-item">
                                            <div className="goal-inputs">
                                                <input
                                                    type="text"
                                                    className="elegant-input"
                                                    value={goal.name || ""}
                                                    onChange={(e) => updateField("goal", goal.id, "name", e.target.value)}
                                                    placeholder="Nombre de la meta"
                                                />
                                                <input
                                                    type="number"
                                                    className="elegant-input"
                                                    value={goal.targetAmount || ""}
                                                    onChange={(e) =>
                                                        updateField("goal", goal.id, "targetAmount", Number.parseFloat(e.target.value) || 0)
                                                    }
                                                    placeholder="Meta (€)"
                                                />
                                                <input
                                                    type="number"
                                                    className="elegant-input"
                                                    value={goal.currentAmount || ""}
                                                    onChange={(e) =>
                                                        updateField("goal", goal.id, "currentAmount", Number.parseFloat(e.target.value) || 0)
                                                    }
                                                    placeholder="Actual (€)"
                                                />
                                                <input
                                                    type="date"
                                                    className="elegant-input"
                                                    value={goal.deadline || ""}
                                                    onChange={(e) => updateField("goal", goal.id, "deadline", e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    className="elegant-input"
                                                    value={goal.description || ""}
                                                    onChange={(e) => updateField("goal", goal.id, "description", e.target.value)}
                                                    placeholder="Descripción"
                                                />
                                            </div>
                                            <button className="elegant-btn danger small" onClick={() => deleteItem("goal", goal.id)}>
                                                Eliminar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="form-actions">
                                    <button className="elegant-btn primary" onClick={() => saveAllItems("goal")} disabled={saving}>
                                        {saving ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                    <button
                                        className="elegant-btn outline"
                                        onClick={() => {
                                            setGoals(overview?.goals || [])
                                            setEditingGoals(false)
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="goals-display">
                                {goals.length > 0 ? (
                                    <div className="goals-grid">
                                        {goals.map((goal) => {
                                            const currentAmount = goal?.currentAmount || 0
                                            const targetAmount = goal?.targetAmount || 1
                                            const progress = (currentAmount / targetAmount) * 100
                                            const progressCapped = Math.min(progress, 100)
                                            return (
                                                <div key={goal?.id || Math.random()} className="goal-display-item">
                                                    <div className="goal-header">
                                                        <h4>{goal?.name || "Meta sin nombre"}</h4>
                                                        <span
                                                            className={`progress-badge ${
                                                                progress >= 100 ? "complete" : progress >= 50 ? "medium" : "low"
                                                            }`}
                                                        >
                              {progressCapped.toFixed(1)}%
                            </span>
                                                    </div>
                                                    {goal?.description && <p className="goal-description">{goal.description}</p>}
                                                    <div className="progress-container">
                                                        <div
                                                            className={`progress-fill ${
                                                                progress >= 100 ? "complete" : progress >= 50 ? "medium" : "low"
                                                            }`}
                                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="goal-footer">
                            <span className="goal-amounts">
                              €{currentAmount.toLocaleString()} / €{targetAmount.toLocaleString()}
                            </span>
                                                        {goal?.deadline && (
                                                            <span className="goal-date">{new Date(goal.deadline).toLocaleDateString()}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="no-data">
                                        <div className="no-data-icon"></div>
                                        <h4>No tienes metas de ahorro</h4>
                                        <p>¡Establece tus primeras metas para comenzar a ahorrar!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </motion.section>

            <Footer />
        </div>
    )
}
