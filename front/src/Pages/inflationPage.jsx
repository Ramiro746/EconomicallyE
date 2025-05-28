import React, { useEffect, useState } from "react";

const eurostatUrl =
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_midx?geo=ES&coicop=CP00&unit=I15&format=JSON";

const Inflation = () => {
    const [lastIncome, setLastIncome] = useState(1200); // Ingreso hace un año
    const [currentIncome, setCurrentIncome] = useState(1200); // Ingreso actual
    const [inflacion, setInflacion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerInflacion = async () => {
            try {
                const response = await fetch(eurostatUrl);
                if (!response.ok) {
                    throw new Error("No se pudo obtener el IPC de Eurostat");
                }
                const data = await response.json();

                const timeIndex = data.dimension.time.category.index;
                const values = data.value;

                const periods = Object.keys(timeIndex).sort();
                const lastPeriod = periods[periods.length - 1];
                const lastIndex = timeIndex[lastPeriod];
                const lastIpc = values[lastIndex];

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

    // Cálculos de depreciación
    let requiredIncome = null;
    let incomeDifference = null;
    let lossPercent = null;
    if (inflacion && inflacion.inflacion !== null) {
        requiredIncome = lastIncome * (1 + inflacion.inflacion / 100);
        incomeDifference = requiredIncome - currentIncome;
        lossPercent = ((requiredIncome - currentIncome) / requiredIncome) * 100;
    }

    return (
        <div style={{maxWidth: 500, margin: "0 auto"}}>
            <h2>¿Cuánto se ha depreciado tu dinero?</h2>
            <p>
                Introduce tu ingreso mensual y descubre cómo la inflación afecta tu poder adquisitivo.
            </p>
            <form style={{marginBottom: 24}}>
                <label>
                    Ingreso mensual hace 1 año (€):{" "}
                    <input
                        type="number"
                        value={lastIncome}
                        min="0"
                        onChange={e => setLastIncome(Number(e.target.value))}
                    />
                </label>
                <br />
                <label>
                    Ingreso mensual actual (€):{" "}
                    <input
                        type="number"
                        value={currentIncome}
                        min="0"
                        onChange={e => setCurrentIncome(Number(e.target.value))}
                    />
                </label>
            </form>

            {loading && <p>Cargando datos de inflación...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {inflacion && (
                <div style={{background: "#f5f5f5", padding: 16, borderRadius: 8}}>
                    <h3>Inflación España ({inflacion.fecha})</h3>
                    <p>
                        IPC actual: <strong>{inflacion.ipcActual}</strong><br/>
                        IPC hace un año: <strong>{inflacion.ipcAnterior ?? "No disponible"}</strong><br/>
                        Inflación interanual: <strong>{inflacion.inflacion?.toFixed(2) ?? "N/D"} %</strong>
                    </p>
                </div>
            )}

            {inflacion && inflacion.inflacion !== null && (
                <div style={{marginTop: 24}}>
                    <h3>Resultado:</h3>
                    <p>
                        Para mantener tu poder adquisitivo de hace un año, hoy deberías ganar:
                        <strong> {requiredIncome?.toFixed(2)} €</strong>
                    </p>
                    <p>
                        Con tu ingreso actual (<strong>{currentIncome} €</strong>), tu poder de compra ha disminuido en:
                        <br />
                        <span style={{color: "crimson", fontWeight: "bold"}}>
              {incomeDifference > 0
                  ? `${incomeDifference.toFixed(2)} € (${Math.abs(lossPercent).toFixed(2)} %)`
                  : "¡Has mantenido o aumentado tu poder adquisitivo!"}
            </span>
                    </p>
                    {incomeDifference > 0 && (
                        <p>
                            <em>Conclusión: tu salario real ha bajado, puedes comprar menos que hace un año con el mismo dinero.</em>
                        </p>
                    )}
                    {incomeDifference <= 0 && (
                        <p>
                            <em>¡Felicidades! Tu salario no ha perdido poder adquisitivo respecto a la inflación.</em>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Inflation;