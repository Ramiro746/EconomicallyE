import { useState } from 'react';

export default function Goal({ userId }) {
    const [formData, setFormData] = useState({ name: '', amount: '' });

    const handleChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8080/api/goals/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    amount: parseFloat(formData.amount)
                })
            });
            if (!res.ok) throw new Error('Error al crear objetivo');
            alert('Objetivo creado');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Añadir Objetivo</h3>
            <input name="name" placeholder="Nombre del objetivo" onChange={handleChange} />
            <input name="amount" placeholder="Cantidad objetivo (€)" onChange={handleChange} />
            <button type="submit">Guardar</button>
        </form>
    );
}
