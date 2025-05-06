import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function OverviewChart({ userId }) {
    const [overview, setOverview] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/overview/${userId}`)
            .then(res => res.json())
            .then(setOverview)
            .catch(err => console.error('Error al cargar overview para gráfico:', err));
    }, [userId]);

    if (!overview) return <p>Cargando gráfico...</p>;

    const data = {
        labels: ['Ahorros', 'Gastos Fijos', 'Gastos Variables'],
        datasets: [
            {
                label: 'Resumen Financiero (€)',
                data: [
                    overview.savings,
                    overview.fixedExpensesTotal,
                    overview.variableExpensesTotal
                ],
                backgroundColor: ['#4caf50', '#f44336', '#ff9800']
            }
        ]
    };

    return (
        <div>
            <h3>Gráfico de Resumen</h3>
            <Bar data={data} />
        </div>
    );
}
