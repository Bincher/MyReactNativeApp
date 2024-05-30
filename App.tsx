// App.tsx
import React from 'react';
import Main from './src/screens/Main';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyServer from './src/screens/myServer';

type RootStackParamList = {
    Main: undefined;
    MyServer: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
                <Stack.Screen name="Main" component={Main} options={{ title: 'Main' }} />
                <Stack.Screen name="MyServer" component={MyServer} options={{ title: 'My Server' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
