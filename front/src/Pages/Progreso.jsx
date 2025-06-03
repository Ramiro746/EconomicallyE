import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import {useNavigate, useParams} from "react-router-dom";
import './Progreso.css';

function Dashboard() {
    const { id } = useParams();
    const navigate = useNavigate()

    const [data, setData] = useState({
        fixedExpenses: [],
        variableExpenses: [],
        goals: [],
        overview: {},
        income: 0
    });
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(id);

    const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                let userId = currentUserId;
                if (!userId) {
                    const resUser = await fetch("http://localhost:8080/api/users/me", {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    });
                    const userData = await resUser.json();
                    userId = userData.id;
                    setCurrentUserId(userData.id);
                }

                const overviewRes = await fetch(`http://localhost:8080/api/overview/${userId}`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });
                const overview = overviewRes.ok ? await overviewRes.json() : {};

                const fixedRes = await fetch(`http://localhost:8080/api/fixed-expenses/${userId}`, {
                    headers: { "Authorization": "Bearer " + token }
                });
                const fixed = fixedRes.ok ? await fixedRes.json() : [];

                const variableRes = await fetch(`http://localhost:8080/api/variable-expenses/${userId}`, {
                    headers: { "Authorization": "Bearer " + token }
                });
                const variable = variableRes.ok ? await variableRes.json() : [];

                const goalsRes = await fetch(`http://localhost:8080/api/goals/${userId}`, {
                    headers: { "Authorization": "Bearer " + token }
                });
                const goals = goalsRes.ok ? await goalsRes.json() : [];

                setData({
                    fixedExpenses: fixed,
                    variableExpenses: variable,
                    goals: goals,
                    overview: overview,
                    income: overview.monthlyIncome || 0
                });

            } catch (err) {
                console.error("Error al cargar el dashboard:", err);
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

    const handleNavigate = (path) => {
        navigate(path);
    };

    const metrics = calculateMetrics();

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner">
                    <span className="loading-text">Cargando dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                    📊 Dashboard Financiero
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
                <div className="metric-card income">
                    <div className="metric-icon">💰</div>
                    <h5 className="metric-title">Ingresos</h5>
                    <p className="metric-value">
                        €{data.income.toLocaleString()}
                    </p>
                </div>
                <div className="metric-card expenses">
                    <div className="metric-icon">💸</div>
                    <h5 className="metric-title">Gastos Totales</h5>
                    <p className="metric-value">
                        €{metrics.totalExpenses.toLocaleString()}
                    </p>
                </div>
                <div className="metric-card savings">
                    <div className="metric-icon">🎯</div>
                    <h5 className="metric-title">Ahorros</h5>
                    <p className="metric-value">
                        €{metrics.totalSavings.toLocaleString()}
                    </p>
                </div>
                <div className="metric-card rate">
                    <div className="metric-icon">📈</div>
                    <h5 className="metric-title">Tasa de Ahorro</h5>
                    <p className="metric-value">
                        {metrics.savingsRate.toFixed(1)}%
                    </p>
                </div>
            </div>

            {/* Gráficos principales */}
            <div className="charts-grid">
                {/* Distribución de gastos */}
                <div className="chart-card">
                    <div className="chart-header expenses-header">
                        <h5>💸 Distribución de Gastos</h5>
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
                <div className="chart-card">
                    <div className="chart-header fixed-header">
                        <h5>🏠 Gastos Fijos</h5>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={prepareFixedExpensesData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                <YAxis />
                                <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
                                <Bar dataKey="amount" fill="#FF6B6B" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tendencias y progreso de metas */}
            <div className="charts-grid">
                {/* Evolución de gastos variables */}
                <div className="chart-card">
                    <div className="chart-header variable-header">
                        <h5>📈 Evolución Gastos Variables</h5>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={prepareVariableExpensesTrend()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => `€${value.toFixed(0)}`} />
                                <Area type="monotone" dataKey="gastos" stackId="1" stroke="#4ECDC4" fill="#4ECDC4" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="presupuesto" stackId="2" stroke="#96CEB4" fill="transparent" strokeDasharray="5 5" />
                                <Legend />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Progreso de metas */}
                <div className="chart-card">
                    <div className="chart-header goals-header">
                        <h5>🎯 Progreso de Metas</h5>
                    </div>
                    <div className="chart-body">
                        {data.goals.length > 0 ? (
                            <div className="goals-container">
                                {prepareGoalsProgress().map((goal, index) => (
                                    <div key={index} className="goal-item">
                                        <div className="goal-info">
                                            <span className="goal-name">{goal.name}</span>
                                            <span className="goal-amounts">
                                                €{goal.current.toLocaleString()} / €{goal.target.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <div
                                                className="progress-bar"
                                                style={{
                                                    width: `${Math.min(goal.progress, 100)}%`,
                                                    backgroundColor: COLORS[index % COLORS.length]
                                                }}
                                            >
                                                {goal.progress.toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-goals">
                                <div className="empty-icon">🎯</div>
                                <p>No hay metas definidas</p>
                                <button
                                    className="create-goal-button"
                                    onClick={() => handleNavigate(`/edit/${currentUserId}`)}
                                >
                                    Crear Primera Meta
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Resumen financiero */}
            <div className="summary-section">
                <div className="summary-card">
                    <div className="summary-header">
                        <h5>📋 Resumen Financiero</h5>
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
        </div>
    );
}

export default Dashboard;