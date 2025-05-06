import { useState, useEffect } from 'react';

function GoalsComponent({ userId }) {
    const [goals, setGoals] = useState([]);
    const [form, setForm] = useState({ description: '', targetAmount: 0 });

    const fetchGoals = async () => {
        const res = await fetch(`http://localhost:8080/api/goals/${userId}`);
        const data = await res.json();
        setGoals(data);
    };

    const createGoal = async () => {
        await fetch('http://localhost:8080/api/goals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, userId }),
        });
        fetchGoals();
    };

    const deleteGoal = async (id) => {
        await fetch(`http://localhost:8080/api/goals/${id}`, { method: 'DELETE' });
        fetchGoals();
    };

    useEffect(() => {
        fetchGoals();
    }, [userId]);

    return (
        <div>
            <h2>Objetivos</h2>
            <ul>
                {goals.map(g => (
                    <li key={g.id}>
                        {g.description} - {g.targetAmount}€
                        <button onClick={() => deleteGoal(g.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GoalsComponent;