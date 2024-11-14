// src/screens/Main/index.tsx
import React, { useEffect, useState } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid, Platform, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useAuth } from '../../context/Auth';
import messaging from '@react-native-firebase/messaging';
import { sendFcmTokenToServer } from '../../apis';
import { PatchFcmTokenRequestDto } from '../../apis/request/support';
import { PatchFcmTokenResponseDto } from '../../apis/response/support';
import { ResponseDto } from '../../apis/response';
import { PERMISSIONS, check, request } from 'react-native-permissions';

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
    const { isLoggedIn, logout, getAccessToken } = useAuth();

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            console.log('Notification permission granted.');
        } else {
            console.log('Notification permission denied.');
        }
    }

    

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

    // function: post game server response 처리 함수 //
    const patchFcmTokenResponse =(responseBody : PatchFcmTokenResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const {code} = responseBody;
        if(code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
        if(code !== 'SU') return;
        console.log(responseBody);
    }

    async function checkAlarm(): Promise<void> {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
                console.log("granted", granted);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(error.message);
                } else {
                    console.log("Unknown error", error);
                }
            }
        } else {
            console.log("POST_NOTIFICATIONS permission is not required for this Android version.");
        }
    }

    useEffect(() => {
        requestUserPermission();
        checkAlarm();
        // FCM 토큰 가져오기
        if(isLoggedIn){
            messaging()
            .getToken()
            .then(async token => {
                console.log('FCM Token:', token);
                // 서버로 토큰 전송 로직 추가 가능
                const requestBody: PatchFcmTokenRequestDto = {
                    fcmToken: token
                };
                const accessToken = await getAccessToken();
                if(accessToken != null) sendFcmTokenToServer(requestBody, accessToken).then(patchFcmTokenResponse); 
            });
            
            // // 토큰이 갱신될 때마다 새로운 토큰 가져오기
            // return messaging().onTokenRefresh(async token => {
            //     console.log('FCM Token refreshed:', token);
            //     // 서버로 갱신된 토큰 전송 로직 추가 가능
            //     const requestBody: PatchFcmTokenRequestDto = {
            //         fcmToken: token
            //     };
            //     const accessToken = await getAccessToken();
            //     if(accessToken != null) sendFcmTokenToServer(requestBody, accessToken).then(patchFcmTokenResponse); 
            // });
        }
        // // 포그라운드 상태에서 푸시 알림 처리
        // const unsubscribe = messaging().onMessage(async remoteMessage => {
        //     console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
        //     Alert.alert(
        //         '알림',
        //         remoteMessage.notification?.body || '푸시 알림' // 메시지를 두 번째 매개변수로 전달
        //     );
        // });

        //  // 백그라운드 및 종료 상태에서 메시지 처리 핸들러 등록
        // messaging().setBackgroundMessageHandler(async remoteMessage => {
        //     console.log('Message handled in the background!', remoteMessage);
        // });

        // return unsubscribe;

    }, []);

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
