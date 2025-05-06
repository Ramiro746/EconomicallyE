import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../api/userApi';

export default function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers().then(setUsers);
    }, []);

    const handleDelete = async (id) => {
        await deleteUser(id);
        setUsers(users.filter((u) => u.id !== id));
    };

    return (
        <div>
            <h2>Usuarios</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                        <button onClick={() => handleDelete(user.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
