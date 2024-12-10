// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, TouchableOpacity } from 'react-native';
import ServerUpdatingScreen from './src/screens/ServerUpdatingScreen';
import useLoginUserStore from './src/stores/login-user.store';
import { ResponseDto } from './src/apis/response';
import { GetSignInUserResponseDto } from './src/apis/response/user';
import User from './src/types/interface/user.interface';
import { GetSignInUserRequest } from './src/apis';
import { AuthProvider } from './src/context/Auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import useFirebaseCloudMessaging from './src/hook/useFirebaseCloudMessaging';
import MainScreen from './src/screens/Main';
import ServerScreen from './src/screens/ServerScreen';
import ServerDetailsScreen from './src/screens/ServerDetailsScreen';
import GameListScreen from './src/screens/GameListScreen';
import ServerMakingScreen from './src/screens/ServerMakingScreen';
import ServerManagingScreen from './src/screens/ServerManagingScreen';
import LoginScreen from './src/screens/LoginScreen';
import CustomerServiceScreen from './src/screens/CustomerServiceScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingScreen from './src/screens/SettingScreen';
import PaymentTest from './src/screens/PaymentTest';

import { NativeBaseProvider } from 'native-base';
import Payment from './src/screens/Payment';
import PaymentResult from './src/screens/PaymentResult.js';

type RootStackParamList = {
    MainScreen: undefined;
    ServerScreen: undefined;
    ServerDetailsScreen: undefined;
    GameListScreen: undefined;
    ServerMakingScreen: undefined;
    ServerUpdatingScreen: undefined;
    ServerManagingScreen: undefined;
    LoginScreen: undefined;
    CustomerServiceScreen: undefined;
    ProfileScreen: undefined;
    SettingScreen: undefined;
    PaymentTest: undefined;
    Payment: undefined;
    PaymentResult: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {

    // state: 로그인 유저 전역 상태 //
    const {setLoginUser, resetLoginUser} = useLoginUserStore();

    // function: get sign in user response 처리 함수 //
    const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const {code} = responseBody;
        if(code === 'AF' || code === 'NU' || code === "DBE"){
            resetLoginUser();
            return;
        }
        const loginUser: User = { ...(responseBody as GetSignInUserResponseDto)};
        setLoginUser(loginUser);
    }

    const {
        requestUserPermission
    } = useFirebaseCloudMessaging()

    // effect: accessToken cookie 값이 변경될 때 마다 실행할 함수 //
    useEffect(() => {

        const checkToken = async () => {
            try {
                const accessToken = await EncryptedStorage.getItem('user_token');
                if (!accessToken) {
                    resetLoginUser();
                    return;
                }
                const response = await GetSignInUserRequest(accessToken);
                getSignInUserResponse(response);
            } catch (error) {
                console.error('Error checking token:', error);
                resetLoginUser();
            }
        };

        checkToken();
        requestUserPermission();
    }, []);

    return (
        <NativeBaseProvider>
        <AuthProvider> 
            <NavigationContainer>
                <Stack.Navigator initialRouteName="MainScreen" >
                    <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false, title: 'MainScreen' }} />
                    <Stack.Screen 
                        name="ServerScreen" 
                        component={ServerScreen} 
                        options={({ navigation }) => ({
                            title: 'ServerScreen',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                                    <Icon name="arrow-back" size={25} color="#fff" />
                                </TouchableOpacity>
                            ),
                            headerTitle: () => (
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color:"#fff"}}>My Server</Text>
                            ),
                            headerStyle: {
                                backgroundColor: '#6200ea',
                            },
                            headerTitleStyle: {
                                color: '#ffffff',
                            },
                        })}
                    />
                    <Stack.Screen 
                        name="ServerDetailsScreen" 
                        component={ServerDetailsScreen} 
                        options={({ navigation }) => ({
                            title: 'ServerDetails',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                                    <Icon name="arrow-back" size={25} color="#fff" />
                                </TouchableOpacity>
                            ),
                            headerTitle: () => (
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color:"#fff"}}>Server Details</Text>
                            ),
                            headerStyle: {
                                backgroundColor: '#6200ea',
                            },
                            headerTitleStyle: {
                                color: '#ffffff',
                            },
                        })}
                    />
                    <Stack.Screen 
                        name="GameListScreen"
                        component={GameListScreen} 
                        options={({ navigation }) => ({
                            title: 'Game List',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                                    <Icon name="arrow-back" size={25} color="#fff" />
                                </TouchableOpacity>
                            ),
                            headerTitle: () => (
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color:"#fff"}}>Game List</Text>
                            ),
                            headerStyle: {
                                backgroundColor: '#6200ea',
                            },
                            headerTitleStyle: {
                                color: '#ffffff',
                            },
                        })}
                    />
                    <Stack.Screen 
                        name="ServerMakingScreen"
                        component={ServerMakingScreen} 
                        options={({ navigation }) => ({
                            title: 'ServerMaking',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                                    <Icon name="arrow-back" size={25} color="#fff" />
                                </TouchableOpacity>
                            ),
                            headerTitle: () => (
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color:"#fff"}}>서버 설정</Text>
                            ),
                            headerStyle: {
                                backgroundColor: '#6200ea',
                            },
                            headerTitleStyle: {
                                color: '#ffffff',
                            },
                        })}
                    />
                    <Stack.Screen 
                        name="ServerUpdatingScreen"
                        component={ServerUpdatingScreen} 
                        options={({ navigation }) => ({
                            title: 'ServerUpdating',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                                    <Icon name="arrow-back" size={25} color="#fff" />
                                </TouchableOpacity>
                            ),
                            headerTitle: () => (
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color:"#fff"}}>서버 수정</Text>
                            ),
                            headerStyle: {
                                backgroundColor: '#6200ea',
                            },
                            headerTitleStyle: {
                                color: '#ffffff',
                            },
                        })}
                    />
                    <Stack.Screen 
                        name="ServerManagingScreen"
                        component={ServerManagingScreen} 
                        options={({ navigation }) => ({
                            title: 'ServerManaging',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                                    <Icon name="arrow-back" size={25} color="#fff" />
                                </TouchableOpacity>
                            ),
                            headerTitle: () => (
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color:"#fff"}}>서버 관리-admin</Text>
                            ),
                            headerStyle: {
                                backgroundColor: '#6200ea',
                            },
                            headerTitleStyle: {
                                color: '#ffffff',
                            },
                        })}
                    />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false, title: 'Login' }} />
                    <Stack.Screen 
                        name="CustomerServiceScreen"
                        component={CustomerServiceScreen} 
                        options={({ navigation }) => ({
                            title: 'CustomerService',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                                    <Icon name="arrow-back" size={25} color="#fff" />
                                </TouchableOpacity>
                            ),
                            headerTitle: () => (
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color:"#fff"}}>고객 문의</Text>
                            ),
                            headerStyle: {
                                backgroundColor: '#6200ea',
                            },
                            headerTitleStyle: {
                                color: '#ffffff',
                            },
                        })}
                    />
                    <Stack.Screen 
                        name="ProfileScreen"
                        component={ProfileScreen} 
                        options={({ navigation }) => ({
                            title: 'MyProfile',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                                    <Icon name="arrow-back" size={25} color="#fff" />
                                </TouchableOpacity>
                            ),
                            headerTitle: () => (
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color:"#fff"}}>내 프로필</Text>
                            ),
                            headerStyle: {
                                backgroundColor: '#6200ea',
                            },
                            headerTitleStyle: {
                                color: '#ffffff',
                            },
                        })}
                    />
                    <Stack.Screen 
                        name="SettingScreen"
                        component={SettingScreen} 
                        options={({ navigation }) => ({
                            title: '세팅',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                                    <Icon name="arrow-back" size={25} color="#fff" />
                                </TouchableOpacity>
                            ),
                            headerTitle: () => (
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color:"#fff"}}>알람(임시)</Text>
                            ),
                            headerStyle: {
                                backgroundColor: '#6200ea',
                            },
                            headerTitleStyle: {
                                color: '#ffffff',
                            },
                        })}
                    />
                    <Stack.Screen 
                        name="PaymentTest"
                        component={PaymentTest} 
                        options={({ navigation }) => ({
                            title: 'PaymentTest',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                                    <Icon name="arrow-back" size={25} color="#fff" />
                                </TouchableOpacity>
                            ),
                            headerTitle: () => (
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color:"#fff"}}>PaymentTest</Text>
                            ),
                            headerStyle: {
                                backgroundColor: '#6200ea',
                            },
                            headerTitleStyle: {
                                color: '#ffffff',
                            },
                        })}
                    />
                    <Stack.Screen 
                        name="Payment"
                        component={Payment} 
                        options={({ navigation }) => ({
                            title: 'PaymentTest',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                                    <Icon name="arrow-back" size={25} color="#fff" />
                                </TouchableOpacity>
                            ),
                            headerTitle: () => (
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color:"#fff"}}>Payment</Text>
                            ),
                            headerStyle: {
                                backgroundColor: '#6200ea',
                            },
                            headerTitleStyle: {
                                color: '#ffffff',
                            },
                        })}
                    />
                    <Stack.Screen 
                        name="PaymentResult"
                        component={PaymentResult} 
                        options={({ navigation }) => ({
                            title: 'PaymentResult',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 10 }}>
                                    <Icon name="arrow-back" size={25} color="#fff" />
                                </TouchableOpacity>
                            ),
                            headerTitle: () => (
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color:"#fff"}}>PaymentResult</Text>
                            ),
                            headerStyle: {
                                backgroundColor: '#6200ea',
                            },
                            headerTitleStyle: {
                                color: '#ffffff',
                            },
                        })}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
        </NativeBaseProvider>
    );
};

export default App;
