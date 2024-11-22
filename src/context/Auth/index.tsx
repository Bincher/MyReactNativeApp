// AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import useLoginUserStore from '../../stores/login-user.store';
import { GetSignInUserRequest } from '../../apis';
import { GetSignInUserResponseDto } from '../../apis/response/user';
import { User } from '../../types/interface';

interface AuthContextType {

    /// 로그인 여부
    isLoggedIn: boolean;

    /// Access Token 얻기 
    getAccessToken: () => Promise<string | null>;

    /// 로그인
    login: (token: string) => Promise<void>;

    /// 로그아웃
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// function : 유저 정보(id, email, role, profileImage) 매핑 함수 //
const mapToUser = (responseDto: GetSignInUserResponseDto): User => {
    return {
        id: responseDto.id,
        email: responseDto.email,
        role: responseDto.role,
        profileImage: responseDto.profileImage
    };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    // state : 로그인 여부 상태 //
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // effect : check login status //
    useEffect(() => {
        checkLoginStatus();
    }, []);

    // function : check login status 함수 //
    const checkLoginStatus = async (): Promise<void> => {
        try {
            const token = await EncryptedStorage.getItem('user_token');
            setIsLoggedIn(!!token);
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    };

    // function : get Access Token 함수 //
    const getAccessToken = async (): Promise<string | null> => {
        try {
            const token = await EncryptedStorage.getItem('user_token');
            return token;
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    };

    // function : login 함수 //
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

    // function : logout 함수 //
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

// 다른 곳에서 useAuth를 통해 사용 가눙
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};