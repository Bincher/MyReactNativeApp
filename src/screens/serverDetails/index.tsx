// src/screens/serverDetail/index.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, ImageSourcePropType } from 'react-native';
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
        <View style={styles.serverInfoContainer}>
            <View style={styles.serverInfoTop}>
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
            <View style={styles.serverInfoMiddle}>
                <Text style={styles.serverDescription}>{server.content}</Text>
            </View>
            <View style={styles.serverInfoBottom}>
                <Text style={styles.serverCreationDate}>서버 상태: {server.status}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.serverDetails}>
                <Text style={styles.serverDetail}>IP 주소: {server.serverAddress}</Text>
                <Text style={styles.serverDetail}>서버 위치: {server.location}</Text>
                <Text style={styles.serverDetail}>서버 퍼포먼스: {server.performance}</Text>
                <Text style={styles.serverDetail}>디스크 퍼포먼스: {server.performance}</Text>
                <Text style={styles.serverDetail}>백업 여부: {server.backup}</Text>
                <Text style={styles.serverDetail}>모드 개수: {server.modeCount}</Text>
                <Text style={styles.serverDetail}>서버 요청사항: {server.requestDetails}</Text>
                <Text style={styles.serverDetail}>예상 금액: {server.billingAmount}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Edit" onPress={handleEdit} color="#6200ea"/>
                <Button title="Delete" onPress={handleDelete} color="red" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    serverInfoContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    serverInfoTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    serverImage: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
        marginRight: 20,
    },
    serverNameGenreContainer: {
        flex: 1,
    },
    serverName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    gameNameGenre: {
        fontSize: 16,
        color: '#666',
    },
    serverInfoMiddle: {
        marginBottom: 20,
    },
    serverDescription: {
        fontSize: 20,
        color: '#000',
    },
    serverInfoBottom: {
        marginBottom: 20,
    },
    serverCreationDate: {
        fontSize: 16,
        color: '#000',
    },
    divider: {
        height: 1,
        backgroundColor: '#6200ea',
        marginBottom: 10,
    },
    serverDetails: {
        marginBottom: 20,
    },
    serverDetail: {
        fontSize: 20,
        marginBottom: 5,
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    gameImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
    },
});

export default ServerDetails;
