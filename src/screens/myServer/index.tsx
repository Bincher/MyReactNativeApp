import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import ServerListItem from '../../types/interface/server-list-item.interface';
import { getUserServerListRequest } from '../../apis';
import useLoginUserStore from '../../stores/login-user.store';
import { ResponseDto } from '../../apis/response';
import GetUserServerListResponseDto from '../../apis/response/game/get-user-server-list.response.dto';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RootStackParamList = {
    MyServer: undefined;
    ServerDetails: { server: ServerListItem };
};

type MyServerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyServer'>;

const MyServer: React.FC = () => {
    const navigation = useNavigation<MyServerScreenNavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredServers, setFilteredServers] = useState<ServerListItem[]>([]);
    const [serverData, setServerData] = useState<ServerListItem[]>([]);
    const { loginUser } = useLoginUserStore();

    const getUserServerListResponse = (responseBody: GetUserServerListResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
        if (code === 'VF') Alert.alert('제목과 내용은 필수입니다.');
        if (code !== 'SU') return;

        const { userServerList } = responseBody as GetUserServerListResponseDto;
        setServerData(userServerList);
        setFilteredServers(userServerList);
    }

    const handleCardPress = (server: ServerListItem) => {
        navigation.navigate('ServerDetails', { server });
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredServers(serverData);
        } else {
            const filtered = serverData.filter(server =>
                server.name.toLowerCase().includes(query.toLowerCase()) ||
                server.billingAmount.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredServers(filtered);
        }
    };

    const renderServerCard = ({ item }: { item: ServerListItem }) => {
        const imageUrl = item.gameImage.replace('localhost', '10.0.2.2');
        return (
            <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.card}>
                <Image 
                    source={{uri: imageUrl}} 
                    style={styles.gameImage} 
                    onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.serverName}>{item.name}</Text>
                    <Text style={styles.gameTitle}>{item.gameTitle}</Text>
                    <Text style={styles.billingAmount}>월 {item.billingAmount}</Text>
                    <Text style={styles.billingAmount}>상태 : {item.status}</Text>
                    <Text style={styles.billingAmount}>IP주소 : {item.serverAddress}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        if (loginUser?.id) getUserServerListRequest(loginUser.id).then(getUserServerListResponse);
    }, [loginUser]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <Icon name="search" size={24} color="#6200ea" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="서버 검색"
                    onChangeText={handleSearch}
                    value={searchQuery}
                />
            </View>
            <FlatList
                data={filteredServers}
                renderItem={renderServerCard}
                keyExtractor={(item) => item.serverUserId?.toString() || item.serverUserId?.toString() || Math.random().toString()}
                contentContainerStyle={styles.cardContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 25,
        margin: 20,
        paddingHorizontal: 15,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    cardContainer: {
        padding: 10
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        marginBottom: 15,
        padding: 15,
        elevation: 3,
    },
    gameImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    serverName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6200ea',
        marginBottom: 5,
    },
    gameTitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    billingAmount: {
        fontSize: 14,
        color: '#666',
    },
});

export default MyServer;
