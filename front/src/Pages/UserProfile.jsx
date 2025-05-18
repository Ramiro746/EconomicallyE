import React, { useEffect, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2'
import "./UserProfile.css";
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

function Perfil({ userId }) {
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:8080/api/users/me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error('No se pudo obtener el usuario');

                const data = await res.json();
                const userId = data.id;

                console.log("Token que se enviará:", token);

                const overviewRes = await fetch(`http://localhost:8080/api/overview/${userId}`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });
                if (!overviewRes.ok) throw new Error('No se pudo obtener el overview');

                const overviewData = await overviewRes.json();

                console.log("Datos recibidos:", overviewData);


                setOverview(overviewData); //Aqui se guardan los datos
            }catch (error){
                console.error("Error al cargar el perfiL: ", error);
                setError("No se pudo obtener el perfil");

            }finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    function parseAdvice(text) {
        if (!text) return <span>No se recibió ningún consejo</span>;

        try {
            if (typeof text !== 'string') {
                text = JSON.stringify(text);
            }

            const parts = text.split(/(##.*?##)/);
            return parts.map((part, index) => {
                if (part.startsWith("##") && part.endsWith("##")) {
                    const h2Text = part.slice(2, -2);
                    return <h2 key={index}>{h2Text}</h2>;
                } else if (part.startsWith("###") && part.endsWith("###")) {
                    const h3text = part.slice(3, -3);
                    return <h3 key={index}>{h3text}</h3>;
                } else {
                    return <span key={index}>{part}</span>;
                }
            });
        } catch (err) {
            console.error("Error al parsear el consejo:", err);
            return <span>{text}</span>;
        }
    }

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!overview) return <p>No hay datos disponibles.</p>;

    // Calcular totales
    const totalFixed = overview.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalVariable = overview.variableExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = totalFixed + totalVariable;
    const totalSavings = overview.monthlyIncome - totalExpenses;

    // Datos para Doughnut chart
    const gastosChartData = {
        labels: ['Gastos Fijos', 'Gastos Variables', 'Ahorro'],
        datasets: [
            {
                label: 'Distribución mensual (€)',
                data: [totalFixed, totalVariable, totalSavings > 0 ? totalSavings : 0],
                backgroundColor: ['#ff6384', '#36a2eb', '#4bc0c0'],
                borderWidth: 1,
            },
        ],
    };

    // Datos para Bar chart de metas
    const metasChartData = {
        labels: overview.goals.map(goal => goal.name),
        datasets: [
            {
                label: 'Progreso (%)',
                data: overview.goals.map(goal =>
                    ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)
                ),
                backgroundColor: '#4bc0c0',
            },
        ],
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Perfil de {overview.name}</h1>

            <section className="mb-4">
                <h3>Resumen Económico</h3>
                <p><strong>Ingresos Mensuales:</strong> {overview.monthlyIncome} €</p>
                <p><strong>Gastos Totales:</strong> {totalExpenses} €</p>
                <p><strong>Ahorro Estimado:</strong> {totalSavings} €</p>
            </section>

            <section className="mb-5">
                <h3>Visualización de Gastos</h3>
                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <Doughnut data={gastosChartData} />
                </div>
            </section>

            <section className="mb-4">
                <h3>Consejos Generados</h3>
                {overview.advices.length > 0 ? (
                    <ul className="list-group">
                        {overview.advices.map(advice => (
                            <li key={advice.id} className="list-group-item">
                                {typeof advice === 'string' || typeof advice === 'object'
                                    ? parseAdvice(advice): 'Formato no reconocido'}
                            </li>
                        ))}
                    </ul>
                ) : <p>No hay consejos generados.</p>}
            </section>

            <section className="mb-4">
                <h3>Metas</h3>
                {overview.goals.length > 0 ? (
                    <>
                        <div className="mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <Bar data={metasChartData} options={{ scales: { y: { beginAtZero: true, max: 100 }}}} />
                        </div>
                        <ul className="list-group">
                            {overview.goals.map(goal => {
                                const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1);
                                return (
                                    <li key={goal.id} className="list-group-item">
                                        <strong>{goal.name}</strong>: {goal.currentAmount}€ / {goal.targetAmount}€ ({progress}%)
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                ) : <p>No tienes metas registradas.</p>}
            </section>
        </div>
    );
}

export default Perfil;
