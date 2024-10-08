// src/screens/serverDetail/index.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, ImageSourcePropType, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import ServerListItem from '../../types/interface/server-list-item.interface';

type RootStackParamList = {
    ServerDetails: { server: ServerListItem };
};

type ServerDetailsRouteProp = RouteProp<RootStackParamList, 'ServerDetails'>;

const ServerDetails: React.FC = () => {
    const route = useRoute<ServerDetailsRouteProp>();
    const navigation = useNavigation();
    const { server } = route.params;

    const handleEdit = () => {
        // Logic for editing server details
        console.log('Edit button pressed');
    };

    const handleDelete = () => {
        Alert.alert(
            '서버 삭제',
            '서버를 삭제합니다. \n요금은 현재까지 사용한 내역만큼만 결제됩니다.',
            [
                {
                    text: '취소',
                    style: 'cancel',
                },
                {
                    text: '삭제',
                    onPress: () => console.log('Server deleted'),
                },
            ],
            { cancelable: false }
        );
    };

    const handleNavigateBack = () => {
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.serverInfoContainer}>
                <Image 
                        source={{uri: server.gameImage.replace('localhost', '10.0.2.2')}} 
                        style={styles.gameImage} 
                        onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
                    />
                <View style={styles.serverNameGenreContainer}>
                    <Text style={styles.serverName}>{server.name}</Text>
                    <Text style={styles.gameNameGenre}>{server.gameTitle}</Text>
                </View>
            </View>
            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>서버 설명</Text>
                <Text style={styles.serverDescription}>{server.content}</Text>
            </View>
            <View style={styles.infoSection}>
                {server.status === '확인중' && (
                    <Text style={styles.sectionTitleChecking}>서버 상태 : {server.status}</Text>
                )}
                {server.status === '중지' && (
                    <Text style={styles.sectionTitleTerminate}>서버 상태 : {server.status}</Text>
                )}
                {server.status === '작동중' && (
                    <Text style={styles.sectionTitleRun}>서버 상태 : {server.status}</Text>
                )}
                <Text style={styles.serverDetail}>IP 주소: {server.serverAddress}</Text>
            </View>
            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>서버 상세 정보</Text>
                <Text style={styles.serverDetail}>서버 위치: {server.location}</Text>
                <Text style={styles.serverDetail}>서버 퍼포먼스: {server.performance}</Text>
                <Text style={styles.serverDetail}>디스크 퍼포먼스: {server.performance}</Text>
                <Text style={styles.serverDetail}>백업 여부: {server.backup ? '예' : '아니오'}</Text>
                <Text style={styles.serverDetail}>모드 개수: {server.modeCount}</Text>
                <Text style={styles.serverDetail}>서버 요청사항: {server.requestDetails}</Text>
                <Text style={styles.serverDetail}>예상 금액: {server.billingAmount}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Text style={styles.buttonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.buttonText}>삭제</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6200ea',
    },
    serverInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    gameImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 16,
    },
    serverNameGenreContainer: {
        flex: 1,
    },
    serverName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    gameNameGenre: {
        fontSize: 14,
        color: '#666',
    },
    infoSection: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6200ea',
        marginBottom: 8,
    },
    sectionTitleChecking: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff7f00',
        marginBottom: 8,
    },
    sectionTitleTerminate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff0000',
        marginBottom: 8,
    },
    sectionTitleRun: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00FF00',
        marginBottom: 8,
    },
    serverDescription: {
        fontSize: 14,
        color: '#333',
    },
    serverStatus: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    serverDetail: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    editButton: {
        backgroundColor: '#6200ea',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
        flex: 1,
        marginRight: 8,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
        flex: 1,
        marginLeft: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ServerDetails;
