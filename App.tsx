// App.tsx
import React from 'react';
import Main from './src/screens/Main';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyServer from './src/screens/myServer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, TouchableOpacity } from 'react-native';

type RootStackParamList = {
    Main: undefined;
    MyServer: undefined;
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
