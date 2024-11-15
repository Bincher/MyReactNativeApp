import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useAuth } from "../context/Auth";
import messaging from '@react-native-firebase/messaging';
import { PatchFcmTokenRequestDto } from "../apis/request/support";
import { sendFcmTokenToServer } from "../apis";
import { PatchFcmTokenResponseDto } from "../apis/response/support";
import { ResponseDto } from "../apis/response";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import useLoginUserStore from "../stores/login-user.store";


const useFirebaseCloudMessaging = () => {

    const { loginUser } = useLoginUserStore();

    // function: post game server response 처리 함수 //
    const patchFcmTokenResponse = (responseBody: PatchFcmTokenResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
        if (code !== 'SU') return;
        console.log(responseBody);
    };

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
        // 포그라운드 상태에서 푸시 알림 처리
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
            Alert.alert(
                '알림',
                remoteMessage.notification?.body || '푸시 알림' // 메시지를 두 번째 매개변수로 전달
            );
        });

         // 백그라운드 및 종료 상태에서 메시지 처리 핸들러 등록
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
        });
        
        return unsubscribe;
    }, []);


    

    useEffect(() => {
        checkAlarm();
    }, []);

    return {
        requestUserPermission,
    };
};

export default useFirebaseCloudMessaging;