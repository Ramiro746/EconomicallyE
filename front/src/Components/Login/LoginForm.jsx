import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
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
                credentials: "include", // solo si usas cookies (no es obligatorio para JWT en headers)
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) throw new Error("Credenciales incorrectas");

            const data = await res.json();

            // ✅ Guardamos el token en localStorage
            localStorage.setItem("token", data.token);

            // Opcional: también puedes guardar el usuario si lo necesitas
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/advice-form", {
                state: { userId: data.user.id }
            }); // redirige a la página del formulario
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Iniciar sesión</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button type="submit">Entrar</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}
