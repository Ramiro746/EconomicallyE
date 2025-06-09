"use client"

import { useEffect, useState } from "react"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useNavigate, useParams } from "react-router-dom"
import "./Progreso.css"
import ScrollNav from "../Components/Nav/ScrollNav.jsx"
import Footer from "../Components/Footer/footer.jsx"
import { Moon, Sun } from "lucide-react"

// Componente del botón de modo oscuro
function DarkModeToggle({ darkMode, toggleDarkMode }) {
    return (
        <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
    )
}

function Dashboard() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [hasCompletedFirstForm, setHasCompletedFirstForm] = useState(false)
    const [darkMode, setDarkMode] = useState(false)

    const [data, setData] = useState({
        fixedExpenses: [],
        variableExpenses: [],
        goals: [],
        advice: [],
        overview: {},
        income: 0,
    })
    const [loading, setLoading] = useState(true)
    const [currentUserId, setCurrentUserId] = useState(id)

    const [report, setReport] = useState(null)
    const [lastAdviceIds, setLastAdviceIds] = useState([])

    const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57", "#FF9FF3", "#54A0FF"]

    // Inicializar tema oscuro desde localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("darkMode")
        if (savedTheme) {
            setDarkMode(JSON.parse(savedTheme))
        }
    }, [])

    // Aplicar tema oscuro al body
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-theme")
        } else {
            document.body.classList.remove("dark-theme")
        }
        localStorage.setItem("darkMode", JSON.stringify(darkMode))
    }, [darkMode])

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                let userId = currentUserId
                const token = localStorage.getItem("token")

                if (!userId) {
                    const resUser = await fetch("https://economicallye-1.onrender.com/api/users/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    const userData = await resUser.json()
                    userId = userData.id
                    setCurrentUserId(userId)
                }

                const advicesRes = await fetch(`https://economicallye-1.onrender.com/api/advice/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                const advice = advicesRes.ok ? await advicesRes.json() : []

                setData((prev) => ({ ...prev, advice }))

                if (advice.length > 1) {
                    const lastTwoAdviceIds = advice.slice(-2).map((a) => a.id)
                    console.log("Últimos dos consejos actuales:", lastTwoAdviceIds)

                    const savedAdviceData = JSON.parse(localStorage.getItem(`adviceData_${userId}`)) || {
                        ids: [],
                        report: null,
                        reportGenerated: false,
                    }
                    console.log("Datos almacenados:", savedAdviceData)

                    const changed =
                        savedAdviceData.ids.length !== 2 ||
                        lastTwoAdviceIds[0] !== savedAdviceData.ids[0] ||
                        lastTwoAdviceIds[1] !== savedAdviceData.ids[1]
                    console.log("¿Consejos cambiaron?:", changed)

                    if (changed || !savedAdviceData.reportGenerated) {
                        console.log("Generando nuevo reporte...")
                        const reportRes = await fetch(`https://economicallye-1.onrender.com/api/advice/progress/${userId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        })

                        if (reportRes.ok) {
                            const reportData = await reportRes.json()
                            setReport(reportData)
                            console.log("Nuevo reporte generado:", reportData)

                            localStorage.setItem(
                                `adviceData_${userId}`,
                                JSON.stringify({
                                    ids: lastTwoAdviceIds,
                                    report: reportData,
                                    reportGenerated: true,
                                }),
                            )
                            console.log("Datos y reporte actualizados en localStorage")
                        } else {
                            console.log("Error al generar reporte")
                        }
                    } else {
                        console.log("Usando reporte existente")
                        if (savedAdviceData.report) {
                            setReport(savedAdviceData.report)
                            console.log("Reporte recuperado de localStorage")
                        }
                    }
                } else {
                    console.log("No hay suficientes consejos (se necesitan al menos 2)")
                    setReport(null)
                    localStorage.removeItem(`adviceData_${userId}`)
                }
            } catch (err) {
                console.error("Error en fetchData:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [currentUserId])

    const calculateMetrics = () => {
        const totalFixedExpenses = data.fixedExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
        const totalVariableExpenses = data.variableExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
        const totalExpenses = totalFixedExpenses + totalVariableExpenses
        const totalSavings = data.goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0)
        const totalGoalTargets = data.goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0)
        const availableMoney = data.income - totalExpenses

        return {
            totalFixedExpenses,
            totalVariableExpenses,
            totalExpenses,
            totalSavings,
            totalGoalTargets,
            availableMoney,
            savingsRate: data.income > 0 ? (totalSavings / data.income) * 100 : 0,
        }
    }

    const prepareExpenseTypeData = () => {
        const metrics = calculateMetrics()
        return [
            { name: "Gastos Fijos", value: metrics.totalFixedExpenses, color: "#FF6B6B" },
            { name: "Gastos Variables", value: metrics.totalVariableExpenses, color: "#4ECDC4" },
            { name: "Dinero Disponible", value: Math.max(0, metrics.availableMoney), color: "#96CEB4" },
        ]
    }

    const prepareFixedExpensesData = () => {
        return data.fixedExpenses.map((exp) => ({
            name: exp.name || "Sin nombre",
            amount: exp.amount || 0,
            frequency: exp.frequency || "MONTHLY",
        }))
    }

    const prepareVariableExpensesTrend = () => {
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"]
        return months.map((month) => ({
            month,
            gastos: Math.random() * 800 + 200,
            presupuesto: 600,
        }))
    }

    const prepareGoalsProgress = () => {
        return data.goals.map((goal) => ({
            name: goal.name || "Meta sin descripción",
            current: goal.currentAmount || 0,
            target: goal.targetAmount || 0,
            progress: goal.targetAmount > 0 ? ((goal.currentAmount || 0) / goal.targetAmount) * 100 : 0,
        }))
    }

    const AIReportSection = ({ advice }) => {
        if (!advice || !advice.iaResult) {
            return null
        }

        const formatDate = (dateString) => {
            try {
                return new Date(dateString).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
            } catch (error) {
                return "Fecha no disponible"
            }
        }

        return (
            <div className="ai-report-section">
                <div className="report-header">
                    <h5>Reporte generado por IA</h5>
                </div>
                <div className="report-content">
                    <div
                        className="report-text"
                        dangerouslySetInnerHTML={{ __html: formatFinancialReport(advice.iaResult) }}
                    ></div>
                    <div className="report-date">
                        <small className="text-muted">Generado el {formatDate(advice.recommendationDate)}</small>
                    </div>
                </div>
            </div>
        )
    }

    const handleNavigate = (path) => {
        navigate(path)
    }

    const metrics = calculateMetrics()

    if (loading) {
        return (
            <div className={`elegant-loading-container ${darkMode ? "dark-theme" : ""}`}>
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

    function formatFinancialReport(rawText) {
        if (!rawText) return ""

        let formatted = rawText.trim()

        formatted = formatted.replace(/### (.*?) ###/g, "<h2>$1</h2>")
        formatted = formatted.replace(/#### (.*?)(:?) ####/g, (_match, title) => {
            return `<h3>${title.trim()}</h3>`
        })
        formatted = formatted.replace(/^([A-ZÁÉÍÓÚÑ][^\n:]{3,40}):$/gm, "<h3>$1</h3>")
        formatted = formatted.replace(/((?:\d+\..+\n)+)/g, (match) => {
            const items = match
                .trim()
                .split("\n")
                .map((line) => {
                    const m = line.match(/^\d+\. (.+)/)
                    return m ? `<li>${m[1]}</li>` : ""
                })
                .join("")
            return `<ol>${items}</ol>`
        })
        formatted = formatted.replace(/((?:- .+\n)+)/g, (match) => {
            const items = match
                .trim()
                .split("\n")
                .map((line) => {
                    const m = line.match(/^- (.+)/)
                    return m ? `<li>${m[1]}</li>` : ""
                })
                .join("")
            return `<ul>${items}</ul>`
        })
        formatted = formatted.replace(/\n{2,}/g, "</p><p>")
        formatted = `<p>${formatted.replace(/\n/g, " ")}</p>`

        return formatted
    }

    const scrollNavLinks = [
        {
            href: "#inicio",
            label: "Inicio",
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        },
        ...(currentUserId
            ? [
                {
                    href: "Mi cuenta",
                    label: "Mi Cuenta",
                    onClick: () => navigate(`/perfil/${currentUserId}`),
                },
                {
                    href: "edit",
                    label: "Editar Informacion",
                    onClick: () => navigate(`/perfil/${currentUserId}`),
                },
                ...(hasCompletedFirstForm
                    ? [
                        {
                            href: "#",
                            label: "Consejos",
                            onClick: () => navigate(`/consejos/${currentUserId}`),
                        },
                    ]
                    : []),
            ]
            : []),
    ]

    return (
        <div className={`dashboard-container ${darkMode ? "dark-theme" : ""}`}>
            {/* Botón de modo oscuro flotante */}
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            {/* Formas de fondo */}
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            {/* ScrollNav */}
            <ScrollNav links={scrollNavLinks} user={currentUserId} />

            {/* Header */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard Financiero</h1>
                <button className="back-button" onClick={() => navigate(`/perfil/${currentUserId}`)}>
                    ← Volver al Perfil
                </button>
            </div>

            {/* Métricas principales */}
            <div className="metrics-grid"></div>

            {/* Gráficos principales */}
            <div className="charts-grid">
                {/* Distribución de gastos */}
                <div className="chart-card">
                    <div className="chart-header expenses-header">
                        <h5>Distribución de Gastos</h5>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={prepareExpenseTypeData()}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {prepareExpenseTypeData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tendencias y progreso de metas */}
            <div className="charts-grid"></div>

            {/*Reporte de la IA*/}
            {data.advice && <AIReportSection advice={data.advice} />}

            {/* Resumen financiero */}
            <div className="summary-section">
                <div className="summary-card">
                    <div className="summary-header">
                        <h5>Resumen Financiero</h5>
                    </div>
                    <div className="summary-body">
                        <div className="summary-grid">
                            <div className="summary-column">
                                <h6 className="summary-title current">💰 Estado Actual</h6>
                                <ul className="summary-list">
                                    <li>
                                        <strong>Ingresos mensuales:</strong> €{data.income.toLocaleString()}
                                    </li>
                                    <li>
                                        <strong>Gastos fijos:</strong> €{metrics.totalFixedExpenses.toLocaleString()}
                                    </li>
                                    <li>
                                        <strong>Gastos variables:</strong> €{metrics.totalVariableExpenses.toLocaleString()}
                                    </li>
                                    <li className={`balance ${metrics.availableMoney >= 0 ? "positive" : "negative"}`}>
                                        <strong>Balance:</strong> €{metrics.availableMoney.toLocaleString()}
                                    </li>
                                </ul>
                            </div>
                            <div className="summary-column">
                                <h6 className="summary-title goals">🎯 Metas de Ahorro</h6>
                                <ul className="summary-list">
                                    <li>
                                        <strong>Total ahorrado:</strong> €{metrics.totalSavings.toLocaleString()}
                                    </li>
                                    <li>
                                        <strong>Objetivo total:</strong> €{metrics.totalGoalTargets.toLocaleString()}
                                    </li>
                                    <li>
                                        <strong>Progreso general:</strong>{" "}
                                        {metrics.totalGoalTargets > 0
                                            ? ((metrics.totalSavings / metrics.totalGoalTargets) * 100).toFixed(1)
                                            : 0}
                                        %
                                    </li>
                                    <li>
                                        <strong>Número de metas:</strong> {data.goals.length}
                                    </li>
                                </ul>
                            </div>
                            <div className="summary-column">
                                <h6 className="summary-title analysis">📊 Análisis</h6>
                                <ul className="summary-list">
                                    <li>
                                        <strong>Tasa de ahorro:</strong> {metrics.savingsRate.toFixed(1)}%
                                    </li>
                                    <li>
                                        <strong>% Gastos fijos:</strong>{" "}
                                        {data.income > 0 ? ((metrics.totalFixedExpenses / data.income) * 100).toFixed(1) : 0}%
                                    </li>
                                    <li>
                                        <strong>% Gastos variables:</strong>{" "}
                                        {data.income > 0 ? ((metrics.totalVariableExpenses / data.income) * 100).toFixed(1) : 0}%
                                    </li>
                                    <li
                                        className={`status ${metrics.savingsRate >= 20 ? "excellent" : metrics.savingsRate >= 10 ? "good" : "improvable"}`}
                                    >
                                        <strong>Estado:</strong>{" "}
                                        {metrics.savingsRate >= 20
                                            ? "✅ Excelente"
                                            : metrics.savingsRate >= 10
                                                ? "⚠️ Bueno"
                                                : "❌ Mejorable"}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Dashboard
