// App.tsx
import React from 'react';
import Main from './src/screens/Main';
import MyServer from './src/screens/myServer';
import ServerDetails from './src/screens/serverDetails';
import GameList from './src/screens/gameList';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, TouchableOpacity } from 'react-native';
import ServerMaking from './src/screens/serverMaking';
import Login from './src/screens/login';
import CustomerService from './src/screens/customerService';



type RootStackParamList = {
    Main: undefined;
    MyServer: undefined;
    ServerDetails: undefined;
    GameList: undefined;
    ServerMaking: undefined;
    Login: undefined;
    CustomerService: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {

    return (
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
