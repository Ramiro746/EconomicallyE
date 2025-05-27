import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../estilos.css"

export default function LoginForm({ closeModal, openRegisterModal }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) throw new Error("Credenciales incorrectas");

            const data = await res.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Cerrar el modal después de login exitoso
            if (closeModal) closeModal();

            // Redirigir a la página principal o al formulario de consejos
            navigate("/");
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSwitchToRegister = () => {
        if (closeModal) closeModal();
        setTimeout(() => {
            if (openRegisterModal) openRegisterModal();
        }, 100);
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Iniciar sesión</h2>
            <div className="form-group">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="auth-button">Entrar</button>
            {error && <p style={{color: "red"}}>{error}</p>}

            <div className="auth-switch">
                <p>¿No tienes cuenta?
                    <button
                        type="button"
                        className="switch-modal-btn"
                        onClick={handleSwitchToRegister}
                    >
                        Regístrate
                    </button>
                </p>
            </div>
        </form>
    );
}