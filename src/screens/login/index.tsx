import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Login: undefined;
    Main: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // 로그인 로직 처리
        if (username === 'admin' && password === 'password') {
            Alert.alert('로그인 성공', '환영합니다!');
            navigation.navigate('Main'); // 로그인 성공 후 MyServer 화면으로 이동
        } else {
            Alert.alert('로그인 실패', '아이디 또는 비밀번호가 잘못되었습니다.');
        }
    };

    const handleBack = () => {
        navigation.navigate('Main');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>로그인</Text>
            <TextInput
                style={styles.input}
                placeholder="아이디"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleBack}>
                <Text style={styles.buttonText}>뒤로가기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#6200ea',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    button: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#6200ea',
    }
});

export default Login;
