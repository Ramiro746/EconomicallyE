import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const AhorroChart = () => {
    const data = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
        datasets: [{
            label: 'Ahorro (€)',
            data: [100, 300, 250, 400],
            borderColor: '#0d6efd',
            backgroundColor: '#84c1ff',
            tension: 0.3,
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Tendencias de Ahorro'
            },
            legend: {
                position: 'bottom'
            }
        }
    };

    return <Line data={data} options={options} />;
};

export default AhorroChart;
