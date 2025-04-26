import { useContext, useEffect, useState } from 'react';
import './FormUser.css';

const FinancialAdvisor = () =>{
    const [ingreso, setIngreso] = useState('');
    const [gasto, setGasto] = useState('');
    const [ahorro, setAhorro] = useState('');
    const [metas, setMetas] = useState('');
    const [riesgo, setRiesgo] = useState('');
    const [tiempo, setTiempo] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Validacion
        if (!ingreso || !gasto || !ahorro || !metas || !riesgo || !tiempo || !error ){
            setError("Todos los campos son obligatorios.");
            return;
        }

        setLoading(true)

        try {
            const response = await fetch("/api/fiancial-advice", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ingreso, gasto, ahorro, metas, riesgo, tiempo, error }),
            });
            if (!response.ok) {
                throw new Error("Error al obtener consejos financieros");
            }
            const data = await response.json();
            setAdvice(data.advice);
        } catch (err) {
            setError('Error en la conexión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="financial-advisor">
            <h2>Guia Financiera Personalizada</h2>

            <form onSubmit={handleSubmit}>
                <div className="group">
                    <div className="formUser-group">
                        <label>Ingresos mensuales</label>
                        <input/>
                    </div>
                    <div className="formUser-group">
                        <label>Gastos mensuales</label>
                        <input/>
                    </div>
                    <div className="formUser-group">
                        <label>Ahorro actual</label>
                        <input/>
                    </div>
                    <div className="space-y-2">
                        <label>Objetivos financieros</label>
                        <input/>
                    </div>
                    <div className="formUser-group">
                        <label>Riesgo de la operacion</label>
                        <input/>
                    </div>
                    <div className="formUser-group">
                        <label>Tiempo que llevara</label>
                        <input/>
                    </div>
                </div>

                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Generando consejos" : "Obtener consejos financieros"}
                </button>
            </form>

        </div>
    );
};

export default FinancialAdvisor;