import React, { useState } from 'react';
import "../estilos.css"

const FormUser = ({ onRegisterSuccess, closeModal }) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        registrationDate: new Date().toISOString().split('T')[0],
        monthlyIncome: 0
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: name === 'monthlyIncome' ? parseFloat(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/users", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const text = await response.text();
                const newUser = text ? JSON.parse(text) : null;
                setMessage(newUser
                    ? `Usuario registrado correctamente. ID: ${newUser.id}`
                    : 'Usuario registrado correctamente.');

                // Llamamos a ambas funciones con un pequeño retraso para mejor UX
                setTimeout(() => {
                    if (closeModal) closeModal();
                    if (onRegisterSuccess) onRegisterSuccess();
                }, 1500); // 1.5 segundos para que el usuario vea el mensaje de éxito
            } else {
                const errorText = await response.text();
                console.error('Respuesta de error del backend:', errorText);
                setMessage(`Error: ${errorText || 'Error desconocido'}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-user-container">
            <h2>Registro de Usuario</h2>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Nombre"
                    id="name"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    placeholder="Contraseña"
                    id="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    type="number"
                    id="monthlyIncome"
                    name="monthlyIncome"
                    value={userData.monthlyIncome}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="auth-button">Registrar</button>
            {message && <p className="form-message">{message}</p>}
        </form>
    );
};

export default FormUser;