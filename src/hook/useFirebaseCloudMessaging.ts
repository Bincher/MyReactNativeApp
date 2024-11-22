import { useEffect } from "react";
import messaging from '@react-native-firebase/messaging';
import { PatchFcmTokenResponseDto } from "../apis/response/support";
import { ResponseDto } from "../apis/response";
import { Alert, PermissionsAndroid, Platform } from "react-native";

// 차후 수정 필요 - fcm Token 받아오는 함수를 main에서 여기로 이전 //
const useFirebaseCloudMessaging = () => {

    // function: post game server response 처리 함수 //
    const patchFcmTokenResponse = (responseBody: PatchFcmTokenResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
        if (code !== 'SU') return;
        console.log(responseBody);
    };

    // function : request user permission 처리 함수 //
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

    // function : check alaram 처리 함수 //
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
            // console.log("POST_NOTIFICATIONS permission is not required for this Android version.");
        }
    }
    
    // effect : 첫 실행시 실행될 함수 - fcm 메시지의 수신 처리 //
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

    // effect : 첫 실행시 실행될 함수 - check Alarm //
    useEffect(() => {
        checkAlarm();
    }, []);

    return {
        requestUserPermission,
    };
};

export default useFirebaseCloudMessaging;