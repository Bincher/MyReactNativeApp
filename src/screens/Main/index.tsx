// src/screens/Main/index.tsx
import React, { useEffect, useState } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useAuth } from '../../context/Auth';

type RootStackParamList = {
    Main: undefined;
    MyServer: undefined;
    MyProfile: undefined;
    GameList: undefined;
    Login: undefined;
    CustomerService: undefined;
    MyNotification: undefined;
};

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;
type MainScreenRouteProp = RouteProp<RootStackParamList, 'Main'>;

type Props = {
    navigation: MainScreenNavigationProp;
    route: MainScreenRouteProp;
};

const Main: React.FC<Props> = ({ navigation }) => {

    /// 로그인 여부 
    const { isLoggedIn, logout } = useAuth();

    

    // event handler: 메뉴 버튼 클릭 이벤트 //
    const handleMenuPress = () => {
        // 미구현
        console.log('Menu button pressed');
    };

    // event handler: 마이페이지(마이 프로필) 클릭 이벤트 처리 //
    const handleMyPagePress = async () => {
        if(!isLoggedIn) navigation.navigate('Login');
        else {
            console.log(isLoggedIn);
            navigation.navigate('MyProfile');
        }
    };

    // event handler: 메인 화면 버튼 클릭 이벤트 처리 //
    const handleContentButtonPress = (buttonName: string) => {
        if(!isLoggedIn) navigation.navigate('Login');
        else{
            if (buttonName === 'MyServer') {
                navigation.navigate('MyServer');
            } else if(buttonName === 'MakingServer'){
                if(!isLoggedIn) navigation.navigate('Login');
                else navigation.navigate('GameList');
            } else if(buttonName === 'CustomerService'){
                navigation.navigate('CustomerService');
            } else if(buttonName === 'MyNotification'){
                navigation.navigate('MyNotification');
            }
        }
    };

    // render: main 스크린 렌더링 //
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleMenuPress} style={styles.button}>
                    <Icon name="menu" style={styles.buttonIcon} size={30} />
                </TouchableOpacity>
                <Text style={styles.appName}>App Name</Text>
                <TouchableOpacity onPress={handleMyPagePress} style={styles.button}>
                    <Icon name="manage-accounts" style={styles.buttonIcon} size={30} />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <TouchableOpacity onPress={() => handleContentButtonPress('MyServer')} style={styles.contentButton}>
                    <Image source={require('../../assets/images/game_server.png')} style={styles.image} />
                    <Text style={styles.contentButtonText}>나의 서버</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleContentButtonPress('MakingServer')} style={styles.contentButton}>
                    <Image source={require('../../assets/images/game.png')} style={styles.image} />
                    <Text style={styles.contentButtonText}>서버 생성</Text>
                </TouchableOpacity>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => handleContentButtonPress('MyNotification')} style={styles.rowButton}>
                        <Icon name="settings" style={styles.buttonIcon} size={70} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleContentButtonPress('CustomerService')} style={styles.rowButton}>
                        <Icon name="headset-mic" style={styles.buttonIcon} size={70} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        backgroundColor: '#6200ea',
        height: 60,
    },
    button: {
        padding: 10,
    },
    buttonIcon: {
        color: '#ffffff',
    },
    appName: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center',
    },
    contentButton: {
        width: '80%',
        height: '30%',
        padding: 15,
        backgroundColor: '#6200ea',
        borderRadius: 8,
        marginVertical: 20,
        alignItems: 'center',
    },
    contentButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: '40%',
        paddingHorizontal: 35,
        marginTop: 10,
    },
    rowButton: {
        flex: 1,
        height: '50%',
        backgroundColor: '#6200ea',
        borderRadius: 8,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    }
});

export default Main;
