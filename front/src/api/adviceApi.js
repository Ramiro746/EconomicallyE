const BASE_URL = 'http://localhost:8080/api/advice';

export async function generateAdvice(questionnaire) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionnaire),
    });
    return await response.json();
}

export async function getAdviceHistory(userId) {
    const response = await fetch(`${BASE_URL}/${userId}`);
    return await response.json();
}
