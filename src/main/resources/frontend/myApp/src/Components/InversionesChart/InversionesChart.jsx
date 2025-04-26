import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const InversionesChart = () => {
    const data = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr'],
        datasets: [{
            label: 'Rendimiento (€)',
            data: [120, 200, 180, 250],
            backgroundColor: '#4e9ae6'
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Rendimiento de Inversiones'
            },
            legend: {
                position: 'bottom'
            }
        }
    };

    return <Bar data={data} options={options} />;
};

export default InversionesChart;
