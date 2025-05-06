import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const FormUser = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        registrationDate: new Date().toISOString().split('T')[0], // formato YYYY-MM-DD
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

    const navigate = useNavigate();

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
            } else {
                const errorText = await response.text();
                console.error('Respuesta de error del backend:', errorText);
                setMessage(`Error: ${errorText || 'Error desconocido'}`);
            }
            navigate("/");
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="monthlyIncome">Ingreso mensual:</label>
                    <input
                        type="number"
                        id="monthlyIncome"
                        name="monthlyIncome"
                        value={userData.monthlyIncome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Registrar</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FormUser;
