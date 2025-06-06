import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import {useNavigate, useParams} from "react-router-dom";
import './Progreso.css';
import ScrollNav from "../Components/Nav/ScrollNav.jsx";
import Footer from "../Components/Footer/footer.jsx";

function Dashboard() {
    const { id } = useParams();
    const navigate = useNavigate()
    const [hasCompletedFirstForm, setHasCompletedFirstForm] = useState(false)


    const [data, setData] = useState({
        fixedExpenses: [],
        variableExpenses: [],
        goals: [],
        advice:[],
        overview: {},
        income: 0
    });
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(id);

    const [report, setReport] = useState(null);
    const [lastAdviceIds, setLastAdviceIds] = useState([]); // para almacenar ids de los consejos usados en último informe

    const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let userId = currentUserId;
                const token = localStorage.getItem("token");

                if (!userId) {
                    const resUser = await fetch("http://localhost:8080/api/users/me", {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    const userData = await resUser.json();
                    userId = userData.id;
                    setCurrentUserId(userId);
                }

                const advicesRes = await fetch(`http://localhost:8080/api/advice/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const advice = advicesRes.ok ? await advicesRes.json() : [];

                setData(prev => ({ ...prev, advice }));

                if (advice.length > 1) {
                    const lastTwoAdviceIds = advice.slice(-2).map(a => a.id);
                    console.log('Últimos dos consejos actuales:', lastTwoAdviceIds);

                    // Obtener datos almacenados (ahora incluyendo el reporte)
                    const savedAdviceData = JSON.parse(localStorage.getItem(`adviceData_${userId}`)) || {
                        ids: [],
                        report: null,
                        reportGenerated: false
                    };
                    console.log('Datos almacenados:', savedAdviceData);

                    const changed =
                        savedAdviceData.ids.length !== 2 ||
                        lastTwoAdviceIds[0] !== savedAdviceData.ids[0] ||
                        lastTwoAdviceIds[1] !== savedAdviceData.ids[1];
                    console.log('¿Consejos cambiaron?:', changed);

                    if (changed || !savedAdviceData.reportGenerated) {
                        console.log('Generando nuevo reporte...');
                        const reportRes = await fetch(`http://localhost:8080/api/advice/progress/${userId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });

                        if (reportRes.ok) {
                            const reportData = await reportRes.json();
                            setReport(reportData);
                            console.log('Nuevo reporte generado:', reportData);

                            // Almacenar tanto los IDs como el reporte completo
                            localStorage.setItem(`adviceData_${userId}`, JSON.stringify({
                                ids: lastTwoAdviceIds,
                                report: reportData,  // <-- Guardar el reporte completo
                                reportGenerated: true
                            }));
                            console.log('Datos y reporte actualizados en localStorage');
                        } else {
                            console.log('Error al generar reporte');
                        }
                    } else {
                        console.log('Usando reporte existente');
                        // Usar el reporte almacenado si existe
                        if (savedAdviceData.report) {
                            setReport(savedAdviceData.report);  // <-- Recuperar el reporte almacenado
                            console.log('Reporte recuperado de localStorage');
                        }
                    }
                } else {
                    console.log('No hay suficientes consejos (se necesitan al menos 2)');
                    setReport(null);
                    localStorage.removeItem(`adviceData_${userId}`);
                }

            } catch (err) {
                console.error("Error en fetchData:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUserId]);


    const calculateMetrics = () => {
        const totalFixedExpenses = data.fixedExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        const totalVariableExpenses = data.variableExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        const totalExpenses = totalFixedExpenses + totalVariableExpenses;
        const totalSavings = data.goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
        const totalGoalTargets = data.goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0);
        const availableMoney = data.income - totalExpenses;

        return {
            totalFixedExpenses,
            totalVariableExpenses,
            totalExpenses,
            totalSavings,
            totalGoalTargets,
            availableMoney,
            savingsRate: data.income > 0 ? (totalSavings / data.income) * 100 : 0
        };
    };

    const prepareExpenseTypeData = () => {
        const metrics = calculateMetrics();
        return [
            { name: 'Gastos Fijos', value: metrics.totalFixedExpenses, color: '#FF6B6B' },
            { name: 'Gastos Variables', value: metrics.totalVariableExpenses, color: '#4ECDC4' },
            { name: 'Dinero Disponible', value: Math.max(0, metrics.availableMoney), color: '#96CEB4' }
        ];
    };

    const prepareFixedExpensesData = () => {
        return data.fixedExpenses.map(exp => ({
            name: exp.name || 'Sin nombre',
            amount: exp.amount || 0,
            frequency: exp.frequency || 'MONTHLY'
        }));
    };

    const prepareVariableExpensesTrend = () => {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
        return months.map(month => ({
            month,
            gastos: Math.random() * 800 + 200,
            presupuesto: 600
        }));
    };

    const prepareGoalsProgress = () => {
        return data.goals.map(goal => ({
            name: goal.name || 'Meta sin descripción',
            current: goal.currentAmount || 0,
            target: goal.targetAmount || 0,
            progress: goal.targetAmount > 0 ? ((goal.currentAmount || 0) / goal.targetAmount) * 100 : 0
        }));
    };

    const AIReportSection = ({ advice }) => {
        if (!advice || !advice.iaResult) {
            return null; // No mostrar nada si no hay datos
        }

        const formatDate = (dateString) => {
            try {
                return new Date(dateString).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (error) {
                return 'Fecha no disponible';
            }
        };

        return (
            <div className="ai-report-section">
                <div className="report-header">
                    <h5>Reporte generado por IA</h5>
                </div>
                <div className="report-content">
                    <div className="report-text"
                    dangerouslySetInnerHTML={{__html: formatFinancialReport(advice.iaResult)}}>

                    </div>
                    <div className="report-date">
                        <small className="text-muted">
                            Generado el {formatDate(advice.recommendationDate)}
                        </small>
                    </div>
                </div>
            </div>
        );
    };


    const handleNavigate = (path) => {
        navigate(path);
    };

    const metrics = calculateMetrics();

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
    function formatFinancialReport(rawText) {
        if (!rawText) return "";

        let formatted = rawText.trim();

        // Encabezados principales ### ... ###
        formatted = formatted.replace(/### (.*?) ###/g, "<h2>$1</h2>");

        // Encabezados secundarios #### ... #### o #### ...: ####
        formatted = formatted.replace(/#### (.*?)(:?) ####/g, (_match, title) => {
            return `<h3>${title.trim()}</h3>`;
        });

        // También detecta encabezados tipo "Texto:" sin hashes
        formatted = formatted.replace(/^([A-ZÁÉÍÓÚÑ][^\n:]{3,40}):$/gm, "<h3>$1</h3>");

        // Listas numeradas (1. ...)
        formatted = formatted.replace(/((?:\d+\..+\n)+)/g, match => {
            const items = match
                .trim()
                .split("\n")
                .map(line => {
                    const m = line.match(/^\d+\. (.+)/);
                    return m ? `<li>${m[1]}</li>` : "";
                })
                .join("");
            return `<ol>${items}</ol>`;
        });

        // Listas con guiones (- ...)
        formatted = formatted.replace(/((?:- .+\n)+)/g, match => {
            const items = match
                .trim()
                .split("\n")
                .map(line => {
                    const m = line.match(/^- (.+)/);
                    return m ? `<li>${m[1]}</li>` : "";
                })
                .join("");
            return `<ul>${items}</ul>`;
        });

        // Párrafos: separar por dobles saltos de línea
        formatted = formatted.replace(/\n{2,}/g, "</p><p>");

        // Quitar saltos de línea restantes y envolver en párrafos
        formatted = `<p>${formatted.replace(/\n/g, " ")}</p>`;

        return formatted;
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

                /*
               {
                   href: "#",
                   label: "Ver consejos",
                   onClick: () => navigate(`/consejos/${userId}`),
               },

                 */
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
        /*
        {
            href: "#herramientas",
            label: "Generar consejo",
            onClick: () => {
                handleGenerateAdvice()
            },
        },

         */
    ]

    return (
        <div className="dashboard-container">
            {/* Formas de fondo */}
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
            {/* ScrollNav */}
            <ScrollNav
                links={scrollNavLinks}
                user={currentUserId}
                //onSignOut={signOut}
                //onOpenLogin={openLoginModal}
                //onOpenRegister={openRegisterModal}
            />
            {/* Header */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                    Dashboard Financiero
                </h1>
                <button
                    className="back-button"
                    onClick={() => navigate(`/perfil/${currentUserId}`)}
                >
                    ← Volver al Perfil
                </button>
            </div>

            {/* Métricas principales */}
            <div className="metrics-grid">

            </div>

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
                                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
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

                {/* Gastos fijos desglosados */}

            </div>

            {/* Tendencias y progreso de metas */}
            <div className="charts-grid">
                {/* Evolución de gastos variables */}


                {/* Progreso de metas */}

            </div>
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
                                    <li><strong>Ingresos mensuales:</strong> €{data.income.toLocaleString()}</li>
                                    <li><strong>Gastos fijos:</strong> €{metrics.totalFixedExpenses.toLocaleString()}</li>
                                    <li><strong>Gastos variables:</strong> €{metrics.totalVariableExpenses.toLocaleString()}</li>
                                    <li className={`balance ${metrics.availableMoney >= 0 ? 'positive' : 'negative'}`}>
                                        <strong>Balance:</strong> €{metrics.availableMoney.toLocaleString()}
                                    </li>
                                </ul>
                            </div>
                            <div className="summary-column">
                                <h6 className="summary-title goals">🎯 Metas de Ahorro</h6>
                                <ul className="summary-list">
                                    <li><strong>Total ahorrado:</strong> €{metrics.totalSavings.toLocaleString()}</li>
                                    <li><strong>Objetivo total:</strong> €{metrics.totalGoalTargets.toLocaleString()}</li>
                                    <li><strong>Progreso general:</strong> {metrics.totalGoalTargets > 0 ? ((metrics.totalSavings / metrics.totalGoalTargets) * 100).toFixed(1) : 0}%</li>
                                    <li><strong>Número de metas:</strong> {data.goals.length}</li>
                                </ul>
                            </div>
                            <div className="summary-column">
                                <h6 className="summary-title analysis">📊 Análisis</h6>
                                <ul className="summary-list">
                                    <li><strong>Tasa de ahorro:</strong> {metrics.savingsRate.toFixed(1)}%</li>
                                    <li><strong>% Gastos fijos:</strong> {data.income > 0 ? ((metrics.totalFixedExpenses / data.income) * 100).toFixed(1) : 0}%</li>
                                    <li><strong>% Gastos variables:</strong> {data.income > 0 ? ((metrics.totalVariableExpenses / data.income) * 100).toFixed(1) : 0}%</li>
                                    <li className={`status ${metrics.savingsRate >= 20 ? 'excellent' : metrics.savingsRate >= 10 ? 'good' : 'improvable'}`}>
                                        <strong>Estado:</strong> {metrics.savingsRate >= 20 ? '✅ Excelente' : metrics.savingsRate >= 10 ? '⚠️ Bueno' : '❌ Mejorable'}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Dashboard;