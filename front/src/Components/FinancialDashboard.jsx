import { useEffect, useState } from "react";
import "./FinancialDashboard.css";

export default function FinancialDashboard() {
    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [plannedSavings, setPlannedSavings] = useState("");
    const [additionalContext, setAdditionalContext] = useState("");

    const [fixedExpenses, setFixedExpenses] = useState([{ name: "", amount: "", frequency: "" }]);
    const [variableExpenses, setVariableExpenses] = useState([{ name: "", amount: "", expenseDate: "" }]);
    const [goals, setGoals] = useState([{ description: "", targetAmount: "", deadline: "", savedAmount:"" }]);

    const [advice, setAdvice] = useState(null);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/users/me", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                    },
                });
                if (!res.ok) throw new Error("No se pudo obtener el ID");
                const data = await res.json();
                setUserId(data.id);
            } catch (err) {
                setError("Error al obtener el usuario");
            }
        };
        fetchUserId();
    }, []);

    const handleChange = (setter, index, field, value) => {
        setter((prev) => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const handleAdd = (setter, emptyItem) => {
        setter((prev) => [...prev, emptyItem]);
    };
    const handleRemove = (setter, indexToRemove) => {
        setter((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmitAdvice = async (e) => {
        e.preventDefault();

        if (!userId) {
            setError("Error: No se pudo identificar al usuario.");
            return;
        }

        setLoading(true);
        setAdvice(null);


        const baseHeaders = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
        };

        const parsedFixedExpenses = fixedExpenses.map(e => ({
            ...e,
            amount: parseFloat(e.amount),
            userId,
        }));

        const parsedVariableExpenses = variableExpenses.map(e => ({
            ...e,
            amount: parseFloat(e.amount),
            userId,
        }));

        const parsedGoals = goals.map(g => ({
            ...g,
            targetAmount: parseFloat(g.targetAmount),
            userId,
        }));

        try {
            // Enviar gastos fijos
            await Promise.all(parsedFixedExpenses.map(exp =>
                fetch("http://localhost:8080/api/fixed-expenses", {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(exp),
                })
            ));

            // Enviar gastos variables
            await Promise.all(parsedVariableExpenses.map(exp =>
                fetch("http://localhost:8080/api/variable-expenses", {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(exp),
                })
            ));

            // Enviar objetivos
            await Promise.all(parsedGoals.map(goal =>
                fetch("http://localhost:8080/api/goals", {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(goal),
                })
            ));

            // Enviar datos al endpoint de advice
            const payload = {
                userId,
                monthlyIncome: parseFloat(monthlyIncome),
                plannedSavings: parseFloat(plannedSavings),
                additionalContext,
                fixedExpenses: parsedFixedExpenses,
                variableExpenses: parsedVariableExpenses,
                goals: parsedGoals,
            };

            const res = await fetch("http://localhost:8080/api/advice", {
                method: "POST",
                headers: baseHeaders,
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("No se pudo generar el consejo");

            const data = await res.json();
            console.log("Respuesta de la API:", data); // Verifica el formato de la respuesta
            setAdvice(data.iaResult || data.advice || data.message || data);

            setError(null); // Limpiar errores previos si todo sale bien
        } catch (err) {
            console.error(err);
            setError("Hubo un error al enviar los datos o generar el consejo.");
        }finally {
            setLoading(false)
        }

    };

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






    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Panel Financiero</h1>
            {!advice && (
            <form onSubmit={handleSubmitAdvice} className="dashboard-form space-y-6">
                {/* Sección de información básica */}
                <div className="input-grid">
                    <div className="input-group">
                        <label className="input-label">Ingresos mensuales:</label>
                        <input
                            type="number"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Ej: 2500"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Ahorro previsto:</label>
                        <input
                            type="number"
                            value={plannedSavings}
                            onChange={(e) => setPlannedSavings(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Ej: 500"
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Contexto adicional:</label>
                    <textarea
                        value={additionalContext}
                        onChange={(e) => setAdditionalContext(e.target.value)}
                        className="input-field textarea-field"
                        placeholder="Describe tus metas financieras..."
                    />
                </div>

                {/* Sección de gastos fijos */}
                <div className="form-section">
                    <h2 className="section-title">Gastos Fijos</h2>
                    {fixedExpenses.map((exp, i) => (
                        <div key={i} className="expense-item">
                            <div className="input-group">
                                <input
                                    placeholder="Nombre"
                                    value={exp.name}
                                    onChange={(e) => handleChange(setFixedExpenses, i, "name", e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="number"
                                    placeholder="Cantidad"
                                    value={exp.amount}
                                    onChange={(e) => handleChange(setFixedExpenses, i, "amount", e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <select
                                    value={exp.frequency}
                                    onChange={(e) => handleChange(setFixedExpenses, i, "frequency", e.target.value)}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Seleccione frecuencia</option>
                                    <option value="Mensual">Mensual</option>
                                    <option value="Trimestral">Trimestral</option>
                                    <option value="Anual">Anual</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemove(setFixedExpenses, i)}
                                className="btn-add">
                                Eliminar gasto fijo
                            </button>
                        </div>

                    ))}
                    <button
                        type="button"
                        onClick={() => handleAdd(setFixedExpenses, {name: "", amount: "", frequency: ""})}
                        className="btn-add"
                    >
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Añadir gasto fijo
                    </button>

                </div>

                {/* Sección de gastos variables */}
                <div className="form-section">
                    <h2 className="section-title">Gastos Variables</h2>
                    {variableExpenses.map((exp, i) => (
                        <div key={i} className="expense-item">
                            <div className="input-group">
                                <input
                                    placeholder="Nombre"
                                    value={exp.name}
                                    onChange={(e) => handleChange(setVariableExpenses, i, "name", e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="number"
                                    placeholder="Cantidad"
                                    value={exp.amount}
                                    onChange={(e) => handleChange(setVariableExpenses, i, "amount", e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="date"
                                    value={exp.expenseDate}
                                    onChange={(e) => handleChange(setVariableExpenses, i, "expenseDate", e.target.value)}
                                    className="input-field"
                                    required
                                />

                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemove(setVariableExpenses, i)}
                                className="btn-add">
                                Eliminar gasto fijo
                            </button>
                        </div>

                    ))}
                    <button
                        type="button"
                        onClick={() => handleAdd(setVariableExpenses, {name: "", amount: "", expenseDate: ""})}
                        className="btn-add"
                    >
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Añadir gasto variable
                    </button>
                </div>

                {/* Sección de objetivos */}
                <div className="form-section">
                    <h2 className="section-title">Objetivos</h2>
                    {goals.map((goal, i) => (
                        <div key={i} className="expense-item goal-item">
                            <div className="input-group">
                                <input
                                    placeholder="Descripción"
                                    value={goal.description}
                                    onChange={(e) => handleChange(setGoals, i, "description", e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="number"
                                    placeholder="Cantidad objetivo"
                                    value={goal.targetAmount}
                                    onChange={(e) => handleChange(setGoals, i, "targetAmount", e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="date"
                                    placeholder="Fecha límite"
                                    value={goal.deadline}
                                    onChange={(e) => handleChange(setGoals, i, "deadline", e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="number"
                                    placeholder="Saldo"
                                    value={goal.savedAmount}
                                    onChange={(e) => handleChange(setGoals, i, "savedAmount", e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemove(setGoals, i)}
                                className="btn-add">
                                Eliminar gasto fijo
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAdd(setGoals, {
                            description: "",
                            targetAmount: "",
                            deadline: "",
                            savedAmount: ""
                        })}
                        className="btn-add"
                    >
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Añadir objetivo
                    </button>
                </div>

                <button type="submit" className="btn btn-primary">
                    Generar consejo financiero
                </button>
            </form>
            )}

            {error && <div className="error-message">{error}</div>}

            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Generando consejo...</p>
                </div>
            )}

            {advice && (
                <div className="advice-panel">
                    <h2 className="advice-title">Consejos:</h2>
                    <p className="advice-date">{new Date().toLocaleDateString()}</p>
                    <div className="advice-content" id="consejo">
                        {typeof advice === 'string' || typeof advice === 'object'
                            ? parseAdvice(advice)
                            : 'Formato de consejo no reconocido.'}
                    </div>
                </div>
            )}
        </div>
    );
}
