import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/Auth';
import EventSource from 'react-native-sse';

const MyNotification: React.FC = () => {
    // const [notifications, setNotifications] = useState<string[]>([]);
    // const { getAccessToken } = useAuth();

    // useEffect(() => {
    //     const subscribeToNotifications = async () => {
    //         const accessToken = await getAccessToken();
    //         if (!accessToken) {
    //             Alert.alert('Error', 'Failed to get access token');
    //             return;
    //         }

    //         // SSE 구독
    //         const eventSource = new EventSource(`http://10.0.2.2:4000/api/v1/notification/subscribe`, {
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //             },
    //         });

    //         // 이벤트 수신
    //         eventSource.addEventListener('message', (event) => {
    //             if (event.data) {
    //                 const data = JSON.parse(event.data);
    //                 console.log('Received notification:', data.message);
    //                 setNotifications((prevNotifications) => [...prevNotifications, data.message]);
    //             }
    //         });

    //         // 에러 처리
    //         eventSource.addEventListener('error', (error) => {
    //             console.error('SSE error:', error);
    //             console.log('SSE connection closed'); 
    //         });

    //         // 컴포넌트 언마운트 시 이벤트 소스 닫기
    //         return () => {
    //             eventSource.close();
    //         };
    //     };

    //     subscribeToNotifications();
    // }, [getAccessToken]);

    return (
        <View style={styles.container}>

            <Text style={styles.noNotification}>임시페이지.</Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    notification: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    noNotification: {
        fontSize: 16,
        color: '#999',
    },
});

export default MyNotification;