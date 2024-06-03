// src/screens/myServer/index.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, ListRenderItem, TouchableOpacity } from 'react-native';

// Define the Server interface
interface Server {
    id: string;
    gameImage: any; // Type for require statements
    gameName: string;
    serverName: string;
    creationDate: string;
}

const serverData: Server[] = [
    {
        id: '1',
        gameImage: require('C:/dev/ReactNativeApp/MyReactNativeApp/src/assets/images/광부의전설.png'),
        gameName: '광부의전설',
        serverName: '동아리전용',
        creationDate: '2023-06-01',
    },
    {
        id: '2',
        gameImage: require('C:/dev/ReactNativeApp/MyReactNativeApp/src/assets/images/엘든팰.png'),
        gameName: '엘든팰',
        serverName: '친구랑 할거',
        creationDate: '2023-06-02',
    },
    {
        id: '3',
        gameImage: require('C:/dev/ReactNativeApp/MyReactNativeApp/src/assets/images/사이비펑크.png'),
        gameName: '사이비펑크',
        serverName: '커뮤니티 단체 서버',
        creationDate: '2023-06-03',
    },
];

const MyServer: React.FC = () => {
    const handleCardPress = (server: Server) => {
        // 카드 클릭 시 처리할 이벤트
        console.log(`${server.serverName} card pressed`);
    };

    const renderServerCard: ListRenderItem<Server> = ({ item }) => (
        <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.card}>
            <Image source={item.gameImage} style={styles.gameImage} />
            <View style={styles.textContainer}>
                <Text style={styles.gameName}>{item.gameName}</Text>
                <Text style={styles.serverName}>{item.serverName}</Text>
                <Text style={styles.creationDate}>{item.creationDate}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={serverData}
                renderItem={renderServerCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.cardContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingTop: 20,
    },
    cardContainer: {
        padding: 10
    },
    card: {
        flexDirection: 'row', // Horizontal alignment
        alignItems: 'center', // Vertically center the content
        width: '100%',
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginVertical: 10,
    },
    gameImage: {
        width: 100, // Set a fixed width for the image
        height: 100, // Set a fixed height for the image
        resizeMode: 'contain',
        marginRight: 15, // Add some spacing between image and text
    },
    textContainer: {
        flex: 1,
    },
    gameName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
        color: '#6200ea'
    },
    serverName: {
        fontSize: 18,
        color: '#6200ea',
        marginVertical: 5,
    },
    creationDate: {
        fontSize: 16,
        color: '#666',
        marginVertical: 5,
    },
});

export default MyServer;
