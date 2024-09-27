// AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

interface AuthContextType {
    isLoggedIn: boolean;
    getAccessToken: () => Promise<string | null>;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async (): Promise<void> => {
        try {
            const token = await EncryptedStorage.getItem('user_token');
            setIsLoggedIn(!!token);
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    };

    const getAccessToken = async (): Promise<string | null> => {
        try {
            const token = await EncryptedStorage.getItem('user_token');
            return token;
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    };

    const login = async (token: string): Promise<void> => {
        try {
            await EncryptedStorage.setItem('user_token', token);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await EncryptedStorage.removeItem('user_token');
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, getAccessToken, login, logout}}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};