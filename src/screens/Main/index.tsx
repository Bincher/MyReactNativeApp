// src/screens/Main/index.tsx
import React, { useEffect } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useAuth } from '../../context/Auth';
import messaging from '@react-native-firebase/messaging';
import { sendFcmTokenToServer } from '../../apis';
import { PatchFcmTokenRequestDto } from '../../apis/request/support';
import { PatchFcmTokenResponseDto } from '../../apis/response/support';
import { ResponseDto } from '../../apis/response';

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
    const {getAccessToken, isLoggedIn} = useAuth();

    // function: post game server response 처리 함수 //
    const patchFcmTokenResponse =(responseBody : PatchFcmTokenResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const {code} = responseBody;
        if(code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
        if(code !== 'SU') return;
        console.log(responseBody);
    }

    // event handler: 메뉴 버튼 클릭 이벤트 //
    const menuButtonClickEventHandler = () => {
        // 미구현
        console.log('Menu button pressed');
    };

    // event handler: 마이페이지(마이 프로필) 클릭 이벤트 처리 //
    const myPageButtonClickEventHandler = async () => {
        if(!isLoggedIn) navigation.navigate('Login');
        else {
            console.log(isLoggedIn);
            navigation.navigate('MyProfile');
        }
    };

    // event handler: 메인 화면 버튼 클릭 이벤트 처리 //
    const mainContentButtonClickEventHandler = (buttonName: string) => {
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

    // function : get FCM TOKEN - 나중에 hook 함수로 넘기기 //
    const getFcmToken = async () =>{

        // 로그인 되어있을때만
        if(isLoggedIn){
            messaging()
            .getToken()
            .then(async token => {
                const requestBody: PatchFcmTokenRequestDto = {
                    fcmToken: token
                };
                const accessToken = await getAccessToken();
                if(accessToken != null) sendFcmTokenToServer(requestBody, accessToken).then(patchFcmTokenResponse); 
            });
            
            return messaging().onTokenRefresh(async token => {
                const requestBody: PatchFcmTokenRequestDto = {
                    fcmToken: token
                };
                const accessToken = await getAccessToken();
                if(accessToken != null) sendFcmTokenToServer(requestBody, accessToken).then(patchFcmTokenResponse); 
            });
        }
    }

    // effect : 렌더링시 실행 - FCM 토큰 얻기 //
    useEffect(() => {
        getFcmToken()
    }, []);

    // render: main 스크린 렌더링 //
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={menuButtonClickEventHandler} style={styles.button}>
                    <Icon name="menu" style={styles.buttonIcon} size={30} />
                </TouchableOpacity>
                <Text style={styles.appName}>App Name</Text>
                <TouchableOpacity onPress={myPageButtonClickEventHandler} style={styles.button}>
                    <Icon name="manage-accounts" style={styles.buttonIcon} size={30} />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <TouchableOpacity onPress={() => mainContentButtonClickEventHandler('MyServer')} style={styles.contentButton}>
                    <Image source={require('../../assets/images/game_server.png')} style={styles.image} />
                    <Text style={styles.contentButtonText}>나의 서버</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => mainContentButtonClickEventHandler('MakingServer')} style={styles.contentButton}>
                    <Image source={require('../../assets/images/game.png')} style={styles.image} />
                    <Text style={styles.contentButtonText}>서버 생성</Text>
                </TouchableOpacity>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => mainContentButtonClickEventHandler('MyNotification')} style={styles.rowButton}>
                        <Icon name="settings" style={styles.buttonIcon} size={70} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => mainContentButtonClickEventHandler('CustomerService')} style={styles.rowButton}>
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
