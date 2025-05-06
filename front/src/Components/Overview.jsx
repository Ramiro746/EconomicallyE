import { useEffect, useState } from 'react';

export default function Overview({ userId }) {
    const [overview, setOverview] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/overview/${userId}`)
            .then(res => res.json())
            .then(data => setOverview(data))
            .catch(err => console.error('Error al cargar overview:', err));
    }, [userId]);

    if (!overview) return <p>Cargando resumen...</p>;

    return (
        <div>
            <h2>Resumen Financiero</h2>
            <p><strong>Saldo Total:</strong> {overview.totalBalance}€</p>
            <p><strong>Ahorros:</strong> {overview.savings}€</p>
            <p><strong>Gastos Fijos:</strong> {overview.fixedExpensesTotal}€</p>
            <p><strong>Gastos Variables:</strong> {overview.variableExpensesTotal}€</p>
            <p><strong>Progreso Objetivos:</strong> {overview.goalProgress}%</p>
        </div>
    );
}
