import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function HistorialConsejos() {
    const { userId } = useParams();
    const [consejos, setConsejos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConsejos = async () => {
            try {
                const token = localStorage.getItem('token');

                console.log("UserId desde URL:", userId);
                console.log("Token:", token);

                // Opción 1: Usar el endpoint específico de consejos (RECOMENDADO)
                const response = await fetch(`http://localhost:8080/api/advice/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                /*
                // Opción 2: Usar overview y extraer solo los consejos
                const response = await fetch(`http://localhost:8080/api/overview/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                */

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: No se pudieron obtener los consejos`);
                }

                const data = await response.json();
                console.log("Datos recibidos:", data);

                // Si usas la Opción 1 (endpoint /api/advice)
                setConsejos(data);

                /*
                // Si usas la Opción 2 (endpoint /api/overview)
                // Asumiendo que en el DTO UserOverviewDTO tienes un campo 'advices' o similar
                setConsejos(data.advices || data.consejos || []);
                */

            } catch (error) {
                console.error("Error al cargar consejos:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchConsejos();
        } else {
            setError("No se proporcionó un ID de usuario válido");
            setLoading(false);
        }
    }, [userId]);

    const handleGoBack = () => {
        navigate(`/perfil/${userId}`);
    };

    const parseAdvice = (text) => {
        if (!text) return <span>No se recibió ningún consejo</span>;

        try {
            if (typeof text !== 'string') {
                text = JSON.stringify(text);
            }

            // Dividir el texto por líneas para mejor procesamiento
            const lines = text.split('\n');

            return lines.map((line, index) => {
                // Encabezados principales (###)
                if (line.startsWith('### ') && line.endsWith(' ###')) {
                    const headerText = line.slice(4, -4);
                    return <h3 key={index} className="font-bold text-lg mt-4 mb-2 text-blue-600">{headerText}</h3>;
                }
                // Encabezados secundarios con ##
                else if (line.startsWith('## ') && line.endsWith(' ##')) {
                    const headerText = line.slice(3, -3);
                    return <h2 key={index} className="font-bold text-xl mt-4 mb-3 text-blue-700">{headerText}</h2>;
                }
                // Encabezados simples con ####
                else if (line.startsWith('#### ') && line.endsWith(' ####')) {
                    const headerText = line.slice(5, -5);
                    return <h4 key={index} className="font-semibold text-base mt-3 mb-2 text-blue-500">{headerText}</h4>;
                }
                // Encabezados simples sin cierre
                else if (line.startsWith('### ')) {
                    const headerText = line.slice(4);
                    return <h3 key={index} className="font-bold text-lg mt-4 mb-2 text-blue-600">{headerText}</h3>;
                }
                else if (line.startsWith('## ')) {
                    const headerText = line.slice(3);
                    return <h2 key={index} className="font-bold text-xl mt-4 mb-3 text-blue-700">{headerText}</h2>;
                }
                else if (line.startsWith('#### ')) {
                    const headerText = line.slice(5);
                    return <h4 key={index} className="font-semibold text-base mt-3 mb-2 text-blue-500">{headerText}</h4>;
                }
                // Elementos de lista
                else if (line.startsWith('- ')) {
                    return <li key={index} className="ml-4 mb-1">{line.slice(2)}</li>;
                }
                // Texto en negrita **texto**
                else if (line.includes('**')) {
                    const parts = line.split(/(\*\*.*?\*\*)/);
                    return (
                        <p key={index} className="mb-2">
                            {parts.map((part, partIndex) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                                }
                                return part;
                            })}
                        </p>
                    );
                }
                // Líneas vacías
                else if (line.trim() === '') {
                    return <br key={index} />;
                }
                // Texto normal
                else {
                    return <p key={index} className="mb-2">{line}</p>;
                }
            });
        } catch (err) {
            console.error("Error al parsear el consejo:", err);
            return <span>{text}</span>;
        }
    };

    if (loading) return <div className="p-4">Cargando historial de consejos...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="container mt-4">
            <div className="mb-4">
                <button
                    onClick={handleGoBack}
                    className="btn btn-secondary"
                >
                    ← Volver al Perfil
                </button>
            </div>

            <h1 className="mb-4">Historial de Consejos</h1>

            {consejos.length === 0 ? (
                <div className="alert alert-info">
                    No tienes consejos generados aún.
                </div>
            ) : (
                <div className="space-y-4">
                    {consejos.map((consejo, index) => (
                        <div key={consejo.id || index} className="card border rounded-lg shadow-sm">
                            <div className="card-header bg-light p-3 border-bottom">
                                <h5 className="mb-1">Consejo #{index + 1}</h5>
                                {consejo.recommendationDate && (
                                    <small className="text-muted">
                                        Fecha: {new Date(consejo.recommendationDate).toLocaleDateString('es-ES')}
                                    </small>
                                )}
                            </div>
                            <div className="card-body p-4">
                                <div className="consejo-content">
                                    {parseAdvice(consejo.iaResult)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HistorialConsejos;