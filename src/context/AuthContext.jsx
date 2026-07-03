import { createContext, useContext, useState, useCallback } from 'react';
import { login as loginRequest } from '../services/authService';

const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = 'pi3b-token';
const STORAGE_USER_KEY = 'pi3b-user';

function getStoredUser() {
    try {
        const raw = localStorage.getItem(STORAGE_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredUser);

    const login = useCallback(async (username, senha) => {
        const data = await loginRequest(username, senha);

        try {
            localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
            localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data));
        } catch { /* empty */ }

        setUser(data);
        return data;
    }, []);

    const logout = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_TOKEN_KEY);
            localStorage.removeItem(STORAGE_USER_KEY);
        } catch { /* empty */ }
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/** Hook para consumir e controlar a autenticação a partir de qualquer página */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
    return ctx;
}