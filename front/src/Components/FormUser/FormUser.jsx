import React, { useState } from 'react';
import "../estilos.css"

const FormUser = ({ onRegisterSuccess, closeModal, openLoginModal }) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        registrationDate: new Date().toISOString().split('T')[0],
        monthlyIncome: 0
    });

    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: name === 'monthlyIncome' ? parseFloat(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(''); // Clear previous messages

        try {
            console.log("Registering user:", userData); // Debug log

            const response = await fetch("http://localhost:8080/api/users", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            console.log("Registration response status:", response.status); // Debug log

            if (response.ok) {
                const text = await response.text();
                const newUser = text ? JSON.parse(text) : null;
                setMessage(newUser
                    ? `Usuario registrado correctamente. ID: ${newUser.id}`
                    : 'Usuario registrado correctamente.');

                // Después del registro exitoso, cambiar al modal de login
                setTimeout(() => {
                    if (onRegisterSuccess) onRegisterSuccess();
                }, 1500); // 1.5 segundos para que el usuario vea el mensaje de éxito
            } else {
                const errorText = await response.text();
                console.error('Respuesta de error del backend:', errorText);
                setMessage(`Error: ${errorText || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Registration error:', error); // Debug log
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchToLogin = (e) => {
        e.preventDefault(); // Prevent form submission
        e.stopPropagation(); // Stop event bubbling
        console.log("Switching to login modal"); // Debug log

        if (openLoginModal) {
            openLoginModal(e);
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                />
            </div>
            <div className="form-group">
                <input
                    type="number"
                    id="monthlyIncome"
                    placeholder="Ingreso Mensual"
                    name="monthlyIncome"
                    value={userData.monthlyIncome}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                />
            </div>
            <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? 'Registrando...' : 'Registrar'}
            </button>
            {message && <p className="form-message">{message}</p>}

            <div className="auth-switch">
                <p>¿Ya tienes cuenta?
                    <button
                        type="button"
                        className="switch-modal-btn"
                        onClick={handleSwitchToLogin}
                        disabled={isLoading}
                    >
                        Inicia Sesión
                    </button>
                </p>
            </div>
        </form>
    );
};

export default FormUser;