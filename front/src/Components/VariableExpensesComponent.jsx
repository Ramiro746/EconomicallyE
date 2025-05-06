import { useState, useEffect } from 'react';

function VariableExpensesComponent({ userId }) {
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({ name: '', amount: 0 });

    const fetchExpenses = async () => {
        const res = await fetch(`http://localhost:8080/api/variable-expenses/${userId}`);
        const data = await res.json();
        setExpenses(data);
    };

    const createExpense = async () => {
        await fetch('http://localhost:8080/api/variable-expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, userId }),
        });
        fetchExpenses();
    };

    const deleteExpense = async (id) => {
        await fetch(`http://localhost:8080/api/variable-expenses/${id}`, { method: 'DELETE' });
        fetchExpenses();
    };

    useEffect(() => {
        fetchExpenses();
    }, [userId]);

    return (
        <div>
            <h2>Gastos variables</h2>
            <ul>
                {expenses.map(e => (
                    <li key={e.id}>
                        {e.name} - {e.amount} €
                        <button onClick={() => deleteExpense(e.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VariableExpensesComponent;
