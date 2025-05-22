import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";

function Edit() {
    const { userId } = useParams();
    const [fixedExpenses, setFixedExpenses] = useState([]);
    const [variableExpenses, setVariableExpenses] = useState([]);
    const [goals, setGoals] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const resUser = await fetch('http://localhost:8080/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const user = await resUser.json();
                //setUser(user);

                const [resFixed, resVar, resGoals] = await Promise.all([
                    fetch(`http://localhost:8080/api/fixed-expenses/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`http://localhost:8080/api/variable-expenses/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`http://localhost:8080/api/goals/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                ]);

                setFixedExpenses(await resFixed.json());
                setVariableExpenses(await resVar.json());
                setGoals(await resGoals.json());
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // Eliminar
    const handleDelete = (type, id) => {
        if (type === "fixed") {
            setFixedExpenses(prev => prev.filter(e => e.id !== id));
        } else if (type === "variable") {
            setVariableExpenses(prev => prev.filter(e => e.id !== id));
        } else if (type === "goal") {
            setGoals(prev => prev.filter(e => e.id !== id));
        }
    };

    // Añadir nuevo
    const handleAdd = (type) => {
        const newItem = { name: "", amount: 0, targetAmount: 0 };
        const tempId = Date.now(); // ID temporal para frontend

        if (type === "fixed") {
            setFixedExpenses(prev => [...prev, { id: tempId, name: "", amount: 0 }]);
        } else if (type === "variable") {
            setVariableExpenses(prev => [...prev, { id: tempId, name: "", amount: 0 }]);
        } else if (type === "goal") {
            setGoals(prev => [...prev, { id: tempId, name: "", targetAmount: 0 }]);
        }
    };

    // Guardar todos (PUT)
    const handleSaveAll = async () => {
        const token = localStorage.getItem("token");

        const updateItems = async (items, endpoint, field) => {
            for (const item of items) {
                if (item.id < 1000000000000) { // Evita enviar ítems nuevos que no existen aún
                    try {
                        const res = await fetch(`http://localhost:8080/api/${endpoint}/${item.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify(item)
                        });
                        if (!res.ok) throw new Error(`Error al actualizar en ${endpoint}`);
                    } catch (error) {
                        console.error(error);
                        alert("Error actualizando " + endpoint);
                    }
                }
            }
        };

        await Promise.all([
            updateItems(fixedExpenses, "fixed-expenses", "amount"),
            updateItems(variableExpenses, "variable-expenses", "amount"),
            updateItems(goals, "goals", "targetAmount")
        ]);

        alert("Todos los cambios se han guardado.");
    };

    return (
        <div className="p-4">
            <h2>Gastos Fijos</h2>
            {fixedExpenses.map(exp => (
                <div key={exp.id}>
                    <input
                        type="text"
                        value={exp.name}
                        onChange={e => setFixedExpenses(prev =>
                            prev.map(i => i.id === exp.id ? { ...i, name: e.target.value } : i))}
                    />
                    <input
                        type="number"
                        value={exp.amount}
                        onChange={e => setFixedExpenses(prev =>
                            prev.map(i => i.id === exp.id ? { ...i, amount: parseFloat(e.target.value) } : i))}
                    />
                    <button onClick={() => handleDelete("fixed", exp.id)}>Eliminar</button>
                </div>
            ))}
            <button onClick={() => handleAdd("fixed")}>Añadir Gasto Fijo</button>

            <h2>Gastos Variables</h2>
            {variableExpenses.map(exp => (
                <div key={exp.id}>
                    <input
                        type="text"
                        value={exp.name}
                        onChange={e => setVariableExpenses(prev =>
                            prev.map(i => i.id === exp.id ? { ...i, name: e.target.value } : i))}
                    />
                    <input
                        type="number"
                        value={exp.amount}
                        onChange={e => setVariableExpenses(prev =>
                            prev.map(i => i.id === exp.id ? { ...i, amount: parseFloat(e.target.value) } : i))}
                    />
                    <button onClick={() => handleDelete("variable", exp.id)}>Eliminar</button>
                </div>
            ))}
            <button onClick={() => handleAdd("variable")}>Añadir Gasto Variable</button>

            <h2>Objetivos</h2>
            {goals.map(goal => (
                <div key={goal.id}>
                    <input
                        type="text"
                        value={goal.name}
                        onChange={e => setGoals(prev =>
                            prev.map(i => i.id === goal.id ? { ...i, name: e.target.value } : i))}
                    />
                    <input
                        type="number"
                        value={goal.targetAmount}
                        onChange={e => setGoals(prev =>
                            prev.map(i => i.id === goal.id ? { ...i, targetAmount: parseFloat(e.target.value) } : i))}
                    />
                    <button onClick={() => handleDelete("goal", goal.id)}>Eliminar</button>
                </div>
            ))}
            <button onClick={() => handleAdd("goal")}>Añadir Objetivo</button>

            <div className="mt-4">
                <button onClick={async () => {
                    await handleSaveAll();
                    navigate(`/perfil/${userId}`);
                }}>💾 Guardar todos los cambios</button>
            </div>
        </div>
    );
}

export default Edit;
