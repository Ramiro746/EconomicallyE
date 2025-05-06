import { useState, useEffect } from 'react';

function UserComponent() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({ name: '', email: '' });
    const [userId, setUserId] = useState(null);

    const fetchAllUsers = async () => {
        const res = await fetch('http://localhost:8080/api/users');
        const data = await res.json();
        setUsers(data);
    };

    const fetchUserById = async (id) => {
        const res = await fetch(`http://localhost:8080/api/users/${id}`);
        const data = await res.json();
        setUser(data);
    };

    const createUser = async () => {
        await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        fetchAllUsers();
    };

    const updateUser = async () => {
        await fetch(`http://localhost:8080/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        fetchAllUsers();
    };

    const deleteUser = async (id) => {
        await fetch(`http://localhost:8080/api/users/${id}`, {
            method: 'DELETE',
        });
        fetchAllUsers();
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return (
        <div>
            <h2>Usuarios</h2>
            <ul>
                {users.map(u => (
                    <li key={u.id}>
                        {u.name} - {u.email}
                        <button onClick={() => deleteUser(u.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserComponent;
