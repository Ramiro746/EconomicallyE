import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import {useParams} from "react-router-dom";

function Dashboard() {
    // Simulamos el userId - en tu app real vendría de useParams()
    const { id } = useParams(); // Captura el id de la URL


    const [data, setData] = useState({
        fixedExpenses: [],
        variableExpenses: [],
        goals: [],
        income: 0
    });
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(id); // Usa el id recibido como userId

    // Simulamos la navegación - en tu app real usarías navigate()
    const handleNavigate = (path) => {
        console.log(`Navegando a: ${path}`);
    };

    // Colores para los gráficos
    const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];

    useEffect(() => {
        // Simulamos la carga de datos - en tu app real harías las llamadas a la API
        const fetchData = async () => {
            try {
                // Datos simulados
                const simulatedData = {
                    fixedExpenses: [
                        { id: 1, name: "Alquiler", amount: 800, frequency: "MONTHLY", description: "Vivienda principal" },
                        { id: 2, name: "Seguro", amount: 150, frequency: "MONTHLY", description: "Seguro del hogar" },
                        { id: 3, name: "Internet", amount: 45, frequency: "MONTHLY", description: "Fibra óptica" },
                        { id: 4, name: "Suscripciones", amount: 25, frequency: "MONTHLY", description: "Netflix, Spotify" }
                    ],
                    variableExpenses: [
                        { id: 1, name: "Supermercado", amount: 320, expenseDate: "2024-05-15", description: "Compras mensuales" },
                        { id: 2, name: "Gasolina", amount: 80, expenseDate: "2024-05-10", description: "Combustible" },
                        { id: 3, name: "Restaurantes", amount: 150, expenseDate: "2024-05-20", description: "Cenas fuera" },
                        { id: 4, name: "Ropa", amount: 90, expenseDate: "2024-05-18", description: "Compras varias" }
                    ],
                    goals: [
                        { id: 1, name: "Vacaciones", targetAmount: 2000, currentAmount: 1200, description: "Viaje a Europa" },
                        { id: 2, name: "Emergencias", targetAmount: 5000, currentAmount: 3500, description: "Fondo de emergencia" },
                        { id: 3, name: "Coche nuevo", targetAmount: 15000, currentAmount: 4500, description: "Cambio de vehículo" }
                    ],
                    income: 3200
                };

                setData(simulatedData);
                setCurrentUserId("1");
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calcular métricas
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

    // Preparar datos para gráfico de gastos por tipo
    const prepareExpenseTypeData = () => {
        const metrics = calculateMetrics();
        return [
            { name: 'Gastos Fijos', value: metrics.totalFixedExpenses, color: '#FF6B6B' },
            { name: 'Gastos Variables', value: metrics.totalVariableExpenses, color: '#4ECDC4' },
            { name: 'Dinero Disponible', value: Math.max(0, metrics.availableMoney), color: '#96CEB4' }
        ];
    };

    // Preparar datos para gráfico de gastos fijos por descripción
    const prepareFixedExpensesData = () => {
        return data.fixedExpenses.map(exp => ({
            name: exp.name || 'Sin nombre',
            amount: exp.amount || 0,
            frequency: exp.frequency || 'MONTHLY'
        }));
    };

    // Preparar datos para evolución de gastos variables (últimos 6 meses simulados)
    const prepareVariableExpensesTrend = () => {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
        return months.map(month => ({
            month,
            gastos: Math.random() * 800 + 200, // Datos simulados
            presupuesto: 600
        }));
    };

    // Preparar datos para progreso de metas
    const prepareGoalsProgress = () => {
        return data.goals.map(goal => ({
            name: goal.name || 'Meta sin nombre',
            current: goal.currentAmount || 0,
            target: goal.targetAmount || 0,
            progress: goal.targetAmount > 0 ? ((goal.currentAmount || 0) / goal.targetAmount) * 100 : 0
        }));
    };

    const metrics = calculateMetrics();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{minHeight: '50vh'}}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4" style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="display-6 fw-bold text-primary mb-0">
                            📊 Dashboard Financiero
                        </h1>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleNavigate(`/perfil/${id}`)}
                        >
                            ← Volver al Perfil
                        </button>
                    </div>
                </div>
            </div>

            {/* Métricas principales */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <div className="display-6 text-success mb-2">💰</div>
                            <h5 className="card-title">Ingresos</h5>
                            <p className="card-text display-6 fw-bold text-success">
                                €{data.income.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <div className="display-6 text-danger mb-2">💸</div>
                            <h5 className="card-title">Gastos Totales</h5>
                            <p className="card-text display-6 fw-bold text-danger">
                                €{metrics.totalExpenses.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <div className="display-6 text-info mb-2">🎯</div>
                            <h5 className="card-title">Ahorros</h5>
                            <p className="card-text display-6 fw-bold text-info">
                                €{metrics.totalSavings.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <div className="display-6 text-warning mb-2">📈</div>
                            <h5 className="card-title">Tasa de Ahorro</h5>
                            <p className="card-text display-6 fw-bold text-warning">
                                {metrics.savingsRate.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráficos principales */}
            <div className="row mb-4">
                {/* Distribución de gastos */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">💸 Distribución de Gastos</h5>
                        </div>
                        <div className="card-body">
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
                </div>

                {/* Gastos fijos desglosados */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header text-white" style={{backgroundColor: '#FF6B6B'}}>
                            <h5 className="mb-0">🏠 Gastos Fijos</h5>
                        </div>
                        <div className="card-body">
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
            </div>

            {/* Tendencias y progreso de metas */}
            <div className="row mb-4">
                {/* Evolución de gastos variables */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header text-white" style={{backgroundColor: '#4ECDC4'}}>
                            <h5 className="mb-0">📈 Evolución Gastos Variables</h5>
                        </div>
                        <div className="card-body">
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
                </div>

                {/* Progreso de metas */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">🎯 Progreso de Metas</h5>
                        </div>
                        <div className="card-body">
                            {data.goals.length > 0 ? (
                                <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                                    {prepareGoalsProgress().map((goal, index) => (
                                        <div key={index} className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="fw-bold">{goal.name}</span>
                                                <span className="text-muted">
                                                    €{goal.current.toLocaleString()} / €{goal.target.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="progress" style={{height: '20px'}}>
                                                <div
                                                    className="progress-bar"
                                                    role="progressbar"
                                                    style={{
                                                        width: `${Math.min(goal.progress, 100)}%`,
                                                        backgroundColor: COLORS[index % COLORS.length]
                                                    }}
                                                    aria-valuenow={goal.progress}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                >
                                                    {goal.progress.toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted py-5">
                                    <div className="display-6 mb-3">🎯</div>
                                    <p>No hay metas definidas</p>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleNavigate(`/edit/${currentUserId}`)}
                                    >
                                        Crear Primera Meta
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Resumen financiero */}
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0">📋 Resumen Financiero</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="text-primary">💰 Estado Actual</h6>
                                    <ul className="list-unstyled">
                                        <li><strong>Ingresos mensuales:</strong> €{data.income.toLocaleString()}</li>
                                        <li><strong>Gastos fijos:</strong> €{metrics.totalFixedExpenses.toLocaleString()}</li>
                                        <li><strong>Gastos variables:</strong> €{metrics.totalVariableExpenses.toLocaleString()}</li>
                                        <li className={`fw-bold ${metrics.availableMoney >= 0 ? 'text-success' : 'text-danger'}`}>
                                            <strong>Balance:</strong> €{metrics.availableMoney.toLocaleString()}
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="text-success">🎯 Metas de Ahorro</h6>
                                    <ul className="list-unstyled">
                                        <li><strong>Total ahorrado:</strong> €{metrics.totalSavings.toLocaleString()}</li>
                                        <li><strong>Objetivo total:</strong> €{metrics.totalGoalTargets.toLocaleString()}</li>
                                        <li><strong>Progreso general:</strong> {metrics.totalGoalTargets > 0 ? ((metrics.totalSavings / metrics.totalGoalTargets) * 100).toFixed(1) : 0}%</li>
                                        <li><strong>Número de metas:</strong> {data.goals.length}</li>
                                    </ul>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="text-warning">📊 Análisis</h6>
                                    <ul className="list-unstyled">
                                        <li><strong>Tasa de ahorro:</strong> {metrics.savingsRate.toFixed(1)}%</li>
                                        <li><strong>% Gastos fijos:</strong> {data.income > 0 ? ((metrics.totalFixedExpenses / data.income) * 100).toFixed(1) : 0}%</li>
                                        <li><strong>% Gastos variables:</strong> {data.income > 0 ? ((metrics.totalVariableExpenses / data.income) * 100).toFixed(1) : 0}%</li>
                                        <li className={metrics.savingsRate >= 20 ? 'text-success' : metrics.savingsRate >= 10 ? 'text-warning' : 'text-danger'}>
                                            <strong>Estado:</strong> {metrics.savingsRate >= 20 ? '✅ Excelente' : metrics.savingsRate >= 10 ? '⚠️ Bueno' : '❌ Mejorable'}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;