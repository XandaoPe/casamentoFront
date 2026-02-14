// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { AuthContextData, LoginResponse } from '../types/auth.types';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = (): AuthContextData => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadStoredData();
    }, []);

    const loadStoredData = (): void => {
        const storedToken = localStorage.getItem('@Casamento:token');
        const storedUser = localStorage.getItem('@Casamento:user');

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
            api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        }

        setLoading(false);
    };

    const signIn = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await api.post<LoginResponse>('/auth/login', { username, password });
            const { access_token, user } = response.data;

            localStorage.setItem('@Casamento:token', access_token);
            localStorage.setItem('@Casamento:user', JSON.stringify(user));

            api.defaults.headers.Authorization = `Bearer ${access_token}`;
            setUser(user);

            toast.success('Login realizado com sucesso!');
            return true;
        } catch (error) {
            toast.error('Erro ao fazer login. Verifique suas credenciais.');
            return false;
        }
    };

    const signOut = (): void => {
        localStorage.removeItem('@Casamento:token');
        localStorage.removeItem('@Casamento:user');
        delete api.defaults.headers.Authorization;
        setUser(null);
        toast.success('Logout realizado com sucesso!');
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};