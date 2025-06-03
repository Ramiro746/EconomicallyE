const BASE_URL = 'http://localhost:8080/api/users';

export async function createUser(user) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    return await response.json();
}

export async function getAllUsers() {
    const response = await fetch(BASE_URL);
    return await response.json();
}

export async function getUser(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    return await response.json();
}

export async function updateUser(id, user) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    return await response.json();
}

export async function deleteUser(id) {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
}
