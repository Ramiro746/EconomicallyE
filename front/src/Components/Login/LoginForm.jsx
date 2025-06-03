import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../estilos.css"

export default function LoginForm({ closeModal, openRegisterModal }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Add this to prevent event bubbling

        console.log("Login form submitted!"); // Debug log
        console.log("Email:", email, "Password length:", password.length); // Debug log

        // Basic validation
        if (!email || !password) {
            setError("Por favor, completa todos los campos");
            return;
        }

        setIsLoading(true);
        setError(""); // Clear previous errors

        try {
            console.log("Making login request..."); // Debug log

            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            console.log("Login response status:", res.status); // Debug log

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.log("Login error data:", errorData); // Debug log
                throw new Error(errorData.message || "Credenciales incorrectas");
            }

            const data = await res.json();
            console.log("Login successful, data received:", data); // Debug log

            // Store token and user data
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            console.log("Data stored in localStorage"); // Debug log

            // Close modal first
            if (closeModal) {
                console.log("Closing modal..."); // Debug log
                closeModal();
            }

            // Force page reload to update state
            console.log("Reloading page..."); // Debug log
            window.location.reload();

        } catch (err) {
            console.error("Login error:", err); // Debug log
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchToRegister = (e) => {
        e.preventDefault(); // Prevent any form submission
        e.stopPropagation(); // Stop event bubbling
        console.log("Switching to register modal, openRegisterModal function:", openRegisterModal); // Debug log

        if (openRegisterModal) {
            openRegisterModal(e);
        } else {
            console.error("openRegisterModal function not provided");
        }
    };

    // Debug: Test if form submission is being prevented somewhere
    const handleFormClick = (e) => {
        console.log("Form clicked, event:", e.type); // Debug log
    };

    return (
        <div onClick={handleFormClick}>
            <form onSubmit={handleLogin}>
                <h2>Iniciar sesión</h2>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => {
                            console.log("Email changed:", e.target.value); // Debug log
                            setEmail(e.target.value);
                        }}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={e => {
                            console.log("Password changed, length:", e.target.value.length); // Debug log
                            setPassword(e.target.value);
                        }}
                        required
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    className="auth-button"
                    disabled={isLoading}
                    onClick={(e) => {
                        console.log("Login button clicked directly"); // Debug log
                        // Don't prevent default here, let the form handle it
                    }}
                >
                    {isLoading ? "Cargando..." : "Entrar"}
                </button>
                {error && <p style={{color: "red"}}>{error}</p>}

                <div className="auth-switch">
                    <p>¿No tienes cuenta?
                        <button
                            type="button"
                            className="switch-modal-btn"
                            onClick={handleSwitchToRegister}
                            disabled={isLoading}
                        >
                            Regístrate
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}