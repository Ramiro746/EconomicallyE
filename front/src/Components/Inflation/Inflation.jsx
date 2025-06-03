import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

const eurostatUrl =
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_midx?geo=ES&coicop=CP00&unit=I15&format=JSON";

// Explicación de los parámetros:
// geo=ES        --> España
// coicop=CP00   --> Índice general del IPC
// unit=I15      --> Índice 2015=100 (ajustado, más estándar para cálculos)
// format=JSON   --> Respuesta en JSON

const InflationInfo = () => {
    const [inflacion, setInflacion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const obtenerInflacion = async () => {
            try {
                const response = await fetch(eurostatUrl);
                if (!response.ok) {
                    throw new Error("No se pudo obtener el IPC de Eurostat");
                }
                const data = await response.json();

                // Extraer periodos y valores
                const timeIndex = data.dimension.time.category.index;
                const values = data.value;

                // Ordenar periodos por fecha (formato YYYY-MM)
                const periods = Object.keys(timeIndex).sort();
                const lastPeriod = periods[periods.length - 1];
                const lastIndex = timeIndex[lastPeriod];
                const lastIpc = values[lastIndex];

                // Periodo del año anterior (mismo mes)
                const prevYearPeriod = lastPeriod.replace(
                    /^(\d{4})/,
                    (y) => (parseInt(y) - 1).toString()
                );
                const prevYearIndex = timeIndex[prevYearPeriod];
                const prevYearIpc = prevYearIndex !== undefined ? values[prevYearIndex] : null;

                let inflacionInteranual = null;
                if (prevYearIpc !== null && prevYearIpc !== undefined) {
                    inflacionInteranual =
                        ((lastIpc - prevYearIpc) / prevYearIpc) * 100;
                }

                setInflacion({
                    fecha: lastPeriod,
                    ipcActual: lastIpc,
                    ipcAnterior: prevYearIpc,
                    inflacion: inflacionInteranual,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        obtenerInflacion();
    }, []);

    return (
        <div>
            <h2>Inflación actual (España)</h2>
            {loading && <p>Cargando datos de inflación...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {inflacion && (
                <div>
                    <p>
                        Periodo: <strong>{inflacion.fecha}</strong>
                    </p>
                    <p>
                        IPC actual: <strong>{inflacion.ipcActual}</strong>
                    </p>
                    <p>
                        IPC hace un año: <strong>{inflacion.ipcAnterior ?? "No disponible"}</strong>
                    </p>
                    <p>
                        Inflación interanual:{" "}
                        <strong>
                            {inflacion.inflacion !== null
                                ? inflacion.inflacion.toFixed(2) + " %"
                                : "No disponible"}
                        </strong>
                    </p>

                    <button onClick={() => navigate(`/inflacion`)}>Consulta como te afecta</button>
                </div>
            )}
        </div>
    );
};

export default InflationInfo;