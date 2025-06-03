import React from 'react';
import "./Gastos.css"
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const GastosChart = () => {
    const data = {
        labels: ['Comida', 'Transporte', 'Ocio', 'Vivienda'],
        datasets: [
            {
                label: 'Gastos (€)',
                data: [300, 150, 100, 400],
                backgroundColor: ['#4e9ae6', '#0d6efd', '#84c1ff', '#053f78'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Distribución de gastos mensuales',
            },
        },

    };

    return <Pie data={data} options={options} />;
};

export default GastosChart;