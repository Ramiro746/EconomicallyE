import { useState } from 'react';

function UserOverviewComponent({ userId }) {
    const [overview, setOverview] = useState(null);

    const fetchOverview = async () => {
        const res = await fetch(`http://localhost:8080/api/overview/${userId}`);
        const data = await res.json();
        setOverview(data);
    };

    return (
        <div>
            <button onClick={fetchOverview}>Ver resumen financiero</button>
            {overview && (
                <div>
                    <p>Ingresos: {overview.income}</p>
                    <p>Gastos fijos: {overview.fixedExpenses}</p>
                    <p>Gastos variables: {overview.variableExpenses}</p>
                    {/* Agrega los demás campos según tu DTO */}
                </div>
            )}
        </div>
    );
}

export default UserOverviewComponent;
