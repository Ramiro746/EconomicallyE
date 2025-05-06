import {useEffect, useState} from "react";

export default function AdviceForm() {

    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [plannedSavings, setPlannedSavings] = useState("");
    const [additionalContext, setAdditionalContext] = useState("");
    const [fixedExpenses, setFixedExpenses] = useState([{ name: "", amount: "" }]);
    const [variableExpenses, setVariableExpenses] = useState([{ name: "", amount: "" }]);
    const [goals, setGoals] = useState([{ description: "", targetAmount: "" }]);
    const [advice, setAdvice] = useState(null);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);


    //Obtener el ID
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log("Token:", token);
                const res = await fetch("http://localhost:8080/api/users/me",{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    credentials: 'include'  // ¡Esto es crucial!
            });
            if (!res.ok) throw new Error("No se pudo obtener el ID de usuario");
            const data = await res.json();
            setUserId(data.id);
        }catch (err){
            console.error("Error al obtener el id del usuario:",err);
            setError("No se pudo obtener el ID de usuario");
        }
    };

    fetchUserId();
    }, []);

    const handleChange = (setter, index, field, value) => {
        setter(prev => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const handleAdd = (setter, emptyItem) => {
        setter(prev => [...prev, emptyItem]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setError("El ID de usuario es obligatorio");
            return;
        }


        console.log(userId);

        const questionnaire = {
            userId,
            monthlyIncome: parseFloat(monthlyIncome),
            plannedSavings: parseFloat(plannedSavings),
            additionalContext,
            fixedExpenses: fixedExpenses.map(e => ({ ...e, amount: parseFloat(e.amount) })),
            variableExpenses: variableExpenses.map(e => ({ ...e, amount: parseFloat(e.amount) })),
            goals: goals.map(g => ({ ...g, targetAmount: parseFloat(g.targetAmount) })),
        };

        try {
            const res = await fetch("http://localhost:8080/api/advice", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("token") },
                body: JSON.stringify(questionnaire),
            });

            if (!res.ok) throw new Error("Error al generar el consejo");
            const data = await res.json();
            setAdvice(data);
        } catch (err) {
            console.error(err);
            setError("No se pudo generar el consejo. Verifica los datos.");
        }
    };

    return (
        <div className="advice-form">
            <h2>Cuestionario Financiero</h2>
            <form onSubmit={handleSubmit}>
                <label>Ingresos mensuales:</label>
                <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    required
                />

                <label>Ahorro previsto:</label>
                <input
                    type="number"
                    value={plannedSavings}
                    onChange={(e) => setPlannedSavings(e.target.value)}
                    required
                />

                <label>Contexto adicional (opcional):</label>
                <textarea
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                />

                <h3>Gastos Fijos</h3>
                {fixedExpenses.map((exp, i) => (
                    <div key={i}>
                        <input
                            placeholder="Nombre"
                            value={exp.name}
                            onChange={(e) => handleChange(setFixedExpenses, i, "name", e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Cantidad"
                            value={exp.amount}
                            onChange={(e) => handleChange(setFixedExpenses, i, "amount", e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={() => handleAdd(setFixedExpenses, { name: "", amount: "" })}>
                    Añadir gasto fijo
                </button>

                <h3>Gastos Variables</h3>
                {variableExpenses.map((exp, i) => (
                    <div key={i}>
                        <input
                            placeholder="Nombre"
                            value={exp.name}
                            onChange={(e) => handleChange(setVariableExpenses, i, "name", e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Cantidad"
                            value={exp.amount}
                            onChange={(e) => handleChange(setVariableExpenses, i, "amount", e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={() => handleAdd(setVariableExpenses, { name: "", amount: "" })}>
                    Añadir gasto variable
                </button>

                <h3>Objetivos</h3>
                {goals.map((goal, i) => (
                    <div key={i}>
                        <input
                            placeholder="Descripción"
                            value={goal.description}
                            onChange={(e) => handleChange(setGoals, i, "description", e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Cantidad objetivo"
                            value={goal.targetAmount}
                            onChange={(e) => handleChange(setGoals, i, "targetAmount", e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={() => handleAdd(setGoals, { description: "", targetAmount: "" })}>
                    Añadir objetivo
                </button>

                <br />
                <button type="submit">Generar consejo</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {advice && (
                <div className="advice-result">
                    <h3>Consejo generado:</h3>
                    <p><strong>Fecha:</strong> {new Date(advice.recommendationDate).toLocaleString()}</p>
                    <p>{advice.iaResult}</p>
                </div>
            )}
        </div>
    );
}
