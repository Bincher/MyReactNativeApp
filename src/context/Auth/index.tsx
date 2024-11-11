// AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import useLoginUserStore from '../../stores/login-user.store';
import { GetSignInUserRequest } from '../../apis';
import { GetSignInUserResponseDto } from '../../apis/response/user';
import { User } from '../../types/interface';

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

const mapToUser = (responseDto: GetSignInUserResponseDto): User => {
    return {
        id: responseDto.id,
        email: responseDto.email,
        role: responseDto.role,
        profileImage: responseDto.profileImage
        // 필요한 다른 필드를 매핑
    };
};

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
            const userInfo = await GetSignInUserRequest(token);

            if (userInfo && 'id' in userInfo) {  // GetSignInUserResponseDto인지 확인
                const user = mapToUser(userInfo);  // User로 매핑
                useLoginUserStore.getState().setLoginUser(user);  // 상태 저장
                setIsLoggedIn(true);
            } else {
                console.error('Invalid user info:', userInfo);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await EncryptedStorage.removeItem('user_token');
            useLoginUserStore.getState().resetLoginUser();
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