import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './HistorialConsejos.css';
import ScrollNav from "../Components/Nav/ScrollNav.jsx";
import Footer from "../Components/Footer/footer.jsx";

function HistorialConsejos() {

    const [hasCompletedFirstForm, setHasCompletedFirstForm] = useState(false)

    const { userId } = useParams();
    const [consejos, setConsejos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConsejos = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`https://economicallye-1.onrender.com/api/advice/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: No se pudieron obtener los consejos`);
                }

                const data = await response.json();
                setConsejos(data);
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

            const lines = text.split('\n');

            return lines.map((line, index) => {
                if (line.startsWith('### ') && line.endsWith(' ###')) {
                    return <h3 key={index} className="consejo-header3">{line.slice(4, -4)}</h3>;
                } else if (line.startsWith('## ') && line.endsWith(' ##')) {
                    return <h2 key={index} className="consejo-header2">{line.slice(3, -3)}</h2>;
                } else if (line.startsWith('#### ') && line.endsWith(' ####')) {
                    return <h4 key={index} className="consejo-header4">{line.slice(5, -5)}</h4>;
                } else if (line.startsWith('### ')) {
                    return <h3 key={index} className="consejo-header3">{line.slice(4)}</h3>;
                } else if (line.startsWith('## ')) {
                    return <h2 key={index} className="consejo-header2">{line.slice(3)}</h2>;
                } else if (line.startsWith('#### ')) {
                    return <h4 key={index} className="consejo-header4">{line.slice(5)}</h4>;
                } else if (line.startsWith('- ')) {
                    return <li key={index} className="consejo-item">{line.slice(2)}</li>;
                } else if (line.includes('**')) {
                    const parts = line.split(/(\*\*.*?\*\*)/);
                    return (
                        <p key={index} className="consejo-text">
                            {parts.map((part, partIndex) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                                }
                                return part;
                            })}
                        </p>
                    );
                } else if (line.trim() === '') {
                    return <br key={index} />;
                } else {
                    return <p key={index} className="consejo-text">{line}</p>;
                }
            });
        } catch (err) {
            console.error("Error al parsear el consejo:", err);
            return <span>{text}</span>;
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-container">
                    <div className="loading-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                    </div>
                </div>
                <div className="loading-background">
                    <div className="floating-shape shape-1"></div>
                    <div className="floating-shape shape-2"></div>
                </div>
            </div>
        );
    }

    if (error) return <div className="error-message">Error: {error}</div>;

    const scrollNavLinks = [
        {
            href: "#inicio",
            label: "Inicio",
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        },
        ...(userId
            ? [

                {
                    href: "Mi cuenta",
                    label: "Mi Cuenta",
                    onClick: () => navigate(`/perfil/${userId}`),
                },

                {
                    href: "edit",
                    label: "Editar Informacion",
                    onClick: () => navigate(`/perfil/${userId}`),
                },

                 /*
                {
                    href: "#",
                    label: "Ver consejos",
                    onClick: () => navigate(`/consejos/${userId}`),
                },

                  */
                ...(hasCompletedFirstForm
                    ? [
                        {
                            href: "#",
                            label: "Consejos",
                            onClick: () => navigate(`/consejos/${user.id}`),
                        },
                    ]
                    : []),
            ]
            : []),
        /*
        {
            href: "#herramientas",
            label: "Generar consejo",
            onClick: () => {
                handleGenerateAdvice()
            },
        },

         */
    ]

    return (
        <div className="historial-container">
            {/* Formas de fondo */}
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
            {/* ScrollNav */}
            <ScrollNav
                links={scrollNavLinks}
                user={userId}
                //onSignOut={signOut}
                //onOpenLogin={openLoginModal}
                //onOpenRegister={openRegisterModal}
            />
            <div className="back-button-container">
                <h1 className="historial-title">Historial de Consejos</h1>
                <button onClick={handleGoBack} className="back-button">
                    ← Volver al Perfil
                </button>
            </div>


            {consejos.length === 0 ? (
                <div className="no-consejos-message">
                    No tienes consejos generados aún.
                </div>
            ) : (
                <div className="consejos-list">
                    {consejos.map((consejo, index) => (
                        <div key={consejo.id || index} className="consejo-card">
                            <div className="consejo-card-header">
                                <h5 className="consejo-card-title">Consejo #{index + 1}</h5>
                                {consejo.recommendationDate && (
                                    <small className="consejo-date">
                                        Fecha: {new Date(consejo.recommendationDate).toLocaleDateString('es-ES')}
                                    </small>
                                )}
                            </div>
                            <div className="consejo-card-body">
                                <div className="consejo-content">
                                    {parseAdvice(consejo.iaResult)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Footer/>
        </div>
    );
}

export default HistorialConsejos;
