import { useEffect, useState } from "react";

export default function AdviceHistory({ userId }) {
    const [adviceList, setAdviceList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchAdvice = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/advice/${userId}`);
                if (!res.ok) throw new Error("No se pudo obtener el historial de consejos");
                const data = await res.json();
                setAdviceList(data);
            } catch (err) {
                console.error(err);
                setError("Error al cargar los consejos");
            }
        };

        fetchAdvice();
    }, [userId]);

    return (
        <div className="advice-history">
            <h2>Historial de Consejos</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {adviceList.length === 0 ? (
                <p>No hay consejos aún.</p>
            ) : (
                <ul>
                    {adviceList.map((advice) => (
                        <li key={advice.id} style={{ marginBottom: "1rem" }}>
                            <strong>{new Date(advice.recommendationDate).toLocaleString()}</strong>
                            <p>{advice.iaResult}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
