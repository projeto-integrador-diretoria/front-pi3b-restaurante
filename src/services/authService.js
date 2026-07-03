import api from './api';

export async function login(username, senha) {
    const { data } = await api.post('/auth/login', { username, senha });
    return data;
}