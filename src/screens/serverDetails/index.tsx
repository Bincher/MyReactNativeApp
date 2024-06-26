// src/screens/serverDetail/index.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, ImageSourcePropType } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

interface ServerDetailsRouteParams {
    server: {
        gameName: string;
        gameImage: ImageSourcePropType;
        genre: string;
        serverName: string;
        description: string;
        creationDate: string;
        ipAddress: string;
        serverStatus: string;
        serverOptions: string;
        estimatedCost: string;
    };
}

const ServerDetails: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { server } = route.params as ServerDetailsRouteParams;

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
                <Image source={server.gameImage} style={styles.serverImage} />
                <View style={styles.serverNameGenreContainer}>
                    <Text style={styles.serverName}>{server.serverName}</Text>
                    <Text style={styles.gameNameGenre}>{server.gameName} ({server.genre})</Text>
                </View>
            </View>
            <View style={styles.serverInfoMiddle}>
                <Text style={styles.serverDescription}>{server.description}</Text>
            </View>
            <View style={styles.serverInfoBottom}>
                <Text style={styles.serverCreationDate}>생성 날짜: {server.creationDate}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.serverDetails}>
                <Text style={styles.serverDetail}>IP 주소: {server.ipAddress}</Text>
                <Text style={styles.serverDetail}>서버 상태: {server.serverStatus}</Text>
                <Text style={styles.serverDetail}>서버 옵션: {server.serverOptions}</Text>
                <Text style={styles.serverDetail}>예상 금액: {server.estimatedCost}</Text>
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
    },
    serverInfoBottom: {
        marginBottom: 20,
    },
    serverCreationDate: {
        fontSize: 16,
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
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default ServerDetails;
