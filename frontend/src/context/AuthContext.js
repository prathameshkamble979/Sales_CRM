import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore user from localStorage on app load
    useEffect(() => {
        const stored = localStorage.getItem('crm_user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            // Verify token is still valid
            getMe()
                .then((res) => setUser({ ...parsed, ...res.data }))
                .catch(() => {
                    localStorage.removeItem('crm_user');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('crm_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('crm_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
