import { useState } from 'react';

export default function VariableExpense({ userId }) {
    const [formData, setFormData] = useState({ name: '', amount: '' });

    const handleChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8080/api/variable-expenses/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    amount: parseFloat(formData.amount)
                })
            });
            if (!res.ok) throw new Error('Error al crear gasto variable');
            alert('Gasto variable creado');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Añadir Gasto Variable</h3>
            <input name="name" placeholder="Nombre" onChange={handleChange} />
            <input name="amount" placeholder="Cantidad (€)" onChange={handleChange} />
            <button type="submit">Guardar</button>
        </form>
    );
}
