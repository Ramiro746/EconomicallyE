import { useState } from 'react';

function AdviceComponent({ userId }) {
    const [questionnaire, setQuestionnaire] = useState({ /* tus campos aquí */ });
    const [adviceList, setAdviceList] = useState([]);

    const generateAdvice = async () => {
        const res = await fetch('http://localhost:8080/api/advice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(questionnaire),
        });
        const data = await res.json();
        alert("Consejo generado correctamente");
        fetchAdviceHistory();
    };

    const fetchAdviceHistory = async () => {
        const res = await fetch(`http://localhost:8080/api/advice/${userId}`);
        const data = await res.json();
        setAdviceList(data);
    };

    return (
        <div>
            <h2>Consejos Financieros</h2>
            <button onClick={generateAdvice}>Generar consejo</button>
            <ul>
                {adviceList.map((a, i) => (
                    <li key={i}>{a.message}</li>
                ))}
            </ul>
        </div>
    );
}

export default AdviceComponent;
