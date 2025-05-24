import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import './perfil.css';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Perfil() {
    const [overview, setOverview] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const token = localStorage.getItem('token');

                // Obtener datos del usuario
                const res = await fetch(`http://localhost:8080/api/users/me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error('No se pudo obtener el usuario');

                const data = await res.json();
                const currentUserId = data.id;
                setUserId(currentUserId);

                console.log("Token que se enviará:", token);

                // Obtener overview básico
                const overviewRes = await fetch(`http://localhost:8080/api/overview/${currentUserId}`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });
                if (!overviewRes.ok) throw new Error('No se pudo obtener el overview');

                const overviewData = await overviewRes.json();

                // Obtener gastos fijos detallados
                let detailedFixedExpenses = [];
                try {
                    const fixedExpensesRes = await fetch(`http://localhost:8080/api/fixed-expenses/${currentUserId}`, {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    });
                    if (fixedExpensesRes.ok) {
                        detailedFixedExpenses = await fixedExpensesRes.json();
                    }
                } catch (fixedError) {
                    console.warn("No se pudieron cargar los gastos fijos detallados:", fixedError);
                }

                // Obtener gastos variables detallados
                let detailedVariableExpenses = [];
                try {
                    const variableExpensesRes = await fetch(`http://localhost:8080/api/variable-expenses/${currentUserId}`, {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    });
                    if (variableExpensesRes.ok) {
                        detailedVariableExpenses = await variableExpensesRes.json();
                    }
                } catch (variableError) {
                    console.warn("No se pudieron cargar los gastos variables detallados:", variableError);
                }

                // Obtener metas detalladas
                let detailedGoals = [];
                try {
                    const goalsRes = await fetch(`http://localhost:8080/api/goals/${currentUserId}`, {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    });
                    if (goalsRes.ok) {
                        detailedGoals = await goalsRes.json();
                    }
                } catch (goalsError) {
                    console.warn("No se pudieron cargar las metas detalladas:", goalsError);
                }

                // Combinar datos del overview con los datos detallados
                const enhancedOverview = {
                    ...overviewData,
                    fixedExpenses: detailedFixedExpenses.length > 0 ? detailedFixedExpenses : overviewData.fixedExpenses || [],
                    variableExpenses: detailedVariableExpenses.length > 0 ? detailedVariableExpenses : overviewData.variableExpenses || [],
                    goals: detailedGoals.length > 0 ? detailedGoals : overviewData.goals || []
                };

                console.log("Datos recibidos:", enhancedOverview);

                setOverview(enhancedOverview);
            } catch (error) {
                console.error("Error al cargar el perfil: ", error);
                setError("No se pudo obtener el perfil");
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    const handleGenerateAdvice = async () => {
        try {
            const token = localStorage.getItem('token');
            const resUser = await fetch("http://localhost:8080/api/users/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const userData = await resUser.json();
            const userId = userData.id;

            const response = await fetch(`http://localhost:8080/api/advices/generate/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Error generando el consejo");

            alert("Nuevo consejo generado correctamente.");
            window.location.reload();
        } catch (error) {
            console.error("Error al generar el consejo:", error);
            alert("No se pudo generar el nuevo consejo.");
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando perfil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-card">
                    <h2>❌ Error</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    if (!overview) {
        return (
            <div className="error-container">
                <div className="error-card">
                    <h2>⚠️ Sin Datos</h2>
                    <p>No hay datos disponibles para mostrar.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    // Calcular totales con validaciones
    const fixedExpenses = overview.fixedExpenses || [];
    const variableExpenses = overview.variableExpenses || [];
    const goals = overview.goals || [];
    const monthlyIncome = overview.monthlyIncome || 0;

    const totalFixed = fixedExpenses.reduce((sum, e) => sum + (e?.amount || 0), 0);
    const totalVariable = variableExpenses.reduce((sum, e) => sum + (e?.amount || 0), 0);
    const totalExpenses = totalFixed + totalVariable;
    const totalSavings = monthlyIncome - totalExpenses;

    // Datos para Doughnut chart
    const gastosChartData = {
        labels: ['Gastos Fijos', 'Gastos Variables', 'Ahorro Potencial'],
        datasets: [
            {
                label: 'Distribución mensual (€)',
                data: [totalFixed, totalVariable, totalSavings > 0 ? totalSavings : 0],
                backgroundColor: [
                    '#FF6B6B',
                    '#4ECDC4',
                    '#45B7D1'
                ],
                borderWidth: 2,
                borderColor: '#fff',
            },
        ],
    };

    // Datos para Bar chart de metas
    const metasChartData = {
        labels: goals.map(goal => goal?.name || 'Sin nombre'),
        datasets: [
            {
                label: 'Progreso (%)',
                data: goals.map(goal => {
                    const current = goal?.currentAmount || 0;
                    const target = goal?.targetAmount || 1;
                    return Math.min(((current / target) * 100), 100);
                }),
                backgroundColor: goals.map(goal => {
                    const current = goal?.currentAmount || 0;
                    const target = goal?.targetAmount || 1;
                    const progress = (current / target) * 100;
                    if (progress >= 80) return '#28a745';
                    if (progress >= 50) return '#ffc107';
                    return '#dc3545';
                }),
                borderRadius: 5,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        }
    };

    return (
        <div className="profile-container">
            {/* Header */}
            <header className="profile-header">
                <div className="header-content">
                    <h1 className="welcome-title">
                        👋 Hola, {overview.name}
                    </h1>
                    <div className="header-actions">
                        <button
                            className="btn btn-outline"
                            onClick={() => navigate('/')}
                        >
                            Volver al Inicio
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => navigate('/editarInfo/:userId')}
                        >
                            Editar Información
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={handleGenerateAdvice}
                        >
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

                    <div className={`summary-card ${totalSavings >= 0 ? 'savings' : 'deficit'}`}>
                        <div className="card-icon">{totalSavings >= 0 ? '🏦' : '⚠️'}</div>
                        <h3>{totalSavings >= 0 ? 'Ahorro Estimado' : 'Déficit'}</h3>
                        <p className="amount">{Math.abs(totalSavings).toLocaleString()} €</p>
                    </div>

                    <div className="summary-card percentage">
                        <div className="card-icon">📈</div>
                        <h3>% de Ahorro</h3>
                        <p className="amount">
                            {monthlyIncome > 0 ? ((totalSavings / monthlyIncome) * 100).toFixed(1) : '0.0'}%
                        </p>
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
                                    <div className="expense-list">
                                        {fixedExpenses.map((expense, index) => (
                                            <div key={expense?.id || index} className="expense-item">
                                                <div className="expense-info">
                                                    <span className="expense-name">
                                                        {expense?.name || expense?.description || `Gasto fijo #${index + 1}`}
                                                    </span>
                                                    {expense?.category && (
                                                        <div className="expense-category">
                                                            📁 {expense.category}
                                                        </div>
                                                    )}
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
                                    <div className="expense-list">
                                        {variableExpenses.map((expense, index) => (
                                            <div key={expense?.id || index} className="expense-item">
                                                <div className="expense-info">
                                                    <span className="expense-name">
                                                        {expense?.name || expense?.description || `Gasto variable #${index + 1}`}
                                                    </span>
                                                    {expense?.category && (
                                                        <div className="expense-category">
                                                            📁 {expense.category}
                                                        </div>
                                                    )}
                                                    {expense?.date && (
                                                        <div className="expense-date">
                                                            📅 {new Date(expense.date).toLocaleDateString()}
                                                        </div>
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
                                <div className="chart-container">
                                    <Bar data={metasChartData} options={chartOptions} />
                                </div>
                                <div className="goals-detail">
                                    <h4>Detalle de Metas</h4>
                                    <div className="goals-list">
                                        {goals.map(goal => {
                                            const currentAmount = goal?.currentAmount || 0;
                                            const targetAmount = goal?.targetAmount || 1;
                                            const progress = ((currentAmount / targetAmount) * 100);
                                            const progressCapped = Math.min(progress, 100);
                                            return (
                                                <div key={goal?.id || Math.random()} className="goal-item">
                                                    <div className="goal-header">
                                                        <h5>{goal?.name || 'Meta sin nombre'}</h5>
                                                        <span className={`progress-badge ${progress >= 100 ? 'complete' : progress >= 50 ? 'medium' : 'low'}`}>
                                                            {progressCapped.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    {goal?.description && (
                                                        <p className="goal-description">{goal.description}</p>
                                                    )}
                                                    <div className="progress-bar">
                                                        <div
                                                            className={`progress-fill ${progress >= 100 ? 'complete' : progress >= 50 ? 'medium' : 'low'}`}
                                                            style={{width: `${Math.min(progress, 100)}%`}}
                                                        ></div>
                                                    </div>
                                                    <div className="goal-footer">
                                                        <span className="goal-amounts">
                                                            {currentAmount.toLocaleString()}€ / {targetAmount.toLocaleString()}€
                                                        </span>
                                                        {goal?.targetDate && (
                                                            <span className="goal-date">
                                                                📅 {new Date(goal.targetDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
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
                        <button
                            className="action-btn primary"
                            onClick={() => navigate(`/consejos/${userId}`)}
                        >
                            💡 Ver Consejos Personalizados
                        </button>
                        <button
                            className="action-btn secondary"
                            onClick={() => navigate('/metas')}
                        >
                            🎯 Gestionar Metas
                        </button>
                        <button
                            className="action-btn secondary"
                            onClick={() => navigate('/gastos')}
                        >
                            💳 Gestionar Gastos
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Perfil;
