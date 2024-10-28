// App.tsx
import React, { useEffect, useState } from 'react';
import Main from './src/screens/Main';
import MyServer from './src/screens/myServer';
import ServerDetails from './src/screens/serverDetails';
import GameList from './src/screens/gameList';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, TouchableOpacity } from 'react-native';
import ServerMaking from './src/screens/serverMaking';
import ServerUpdating from './src/screens/serverUpdating';
import Login from './src/screens/login';
import CustomerService from './src/screens/customerService';
import useLoginUserStore from './src/stores/login-user.store';
import { ResponseDto } from './src/apis/response';
import { GetSignInUserResponseDto } from './src/apis/response/user';
import User from './src/types/interface/user.interface';
import { GetSignInUserRequest } from './src/apis';
import MyProfile from './src/screens/myProfile';
import { AuthProvider } from './src/context/Auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import ServerManaging from './src/screens/serverManaging';



type RootStackParamList = {
    Main: undefined;
    MyServer: undefined;
    ServerDetails: undefined;
    GameList: undefined;
    ServerMaking: undefined;
    ServerUpdating: undefined;
    ServerManaging: undefined;
    Login: undefined;
    CustomerService: undefined;
    MyProfile: undefined;
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
    }, []);

    return (
        <AuthProvider> 
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Main" >
                    <Stack.Screen name="Main" component={Main} options={{ headerShown: false, title: 'Main' }} />
                    <Stack.Screen 
                        name="MyServer" 
                        component={MyServer} 
                        options={({ navigation }) => ({
                            title: 'My Server',
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
                        name="ServerDetails" 
                        component={ServerDetails} 
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
                        name="GameList"
                        component={GameList} 
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
                        name="ServerMaking"
                        component={ServerMaking} 
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
                        name="ServerUpdating"
                        component={ServerUpdating} 
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
                        name="ServerManaging"
                        component={ServerManaging} 
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
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false, title: 'Login' }} />
                    <Stack.Screen 
                        name="CustomerService"
                        component={CustomerService} 
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
                        name="MyProfile"
                        component={MyProfile} 
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
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
};

export default App;
