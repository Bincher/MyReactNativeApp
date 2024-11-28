import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import ServerListItem from '../../types/interface/server-list-item.interface';
import { getAdminServerListRequest, getUserServerListRequest } from '../../apis';
import useLoginUserStore from '../../stores/login-user.store';
import { ResponseDto } from '../../apis/response';
import GetUserServerListResponseDto from '../../apis/response/game/get-user-server-list.response.dto';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GetServerListResponseDto } from '../../apis/response/game';
import { AdminServerListItem } from '../../types/interface';
import { useAuth } from '../../context/Auth';

type RootStackParamList = {
    ServerScreen: undefined;
    ServerDetailsScreen: { server: ServerListItem };
    ServerManagingScreen: { server: AdminServerListItem };
};

type ServerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ServerScreen'>;

const ServerScreen: React.FC = () => {

    /// 네비게이션
    const navigation = useNavigation<ServerScreenNavigationProp>();

    /// 로그인 정보 저장소 접근
    const { loginUser } = useLoginUserStore();

    /// 로그인 여부 
    const { getAccessToken } = useAuth();

    // state: 페이지 상태 //
    const [view, setView] = useState<'user' | 'admin'>(loginUser?.role === "ROLE_ADMIN" ? "admin" : "user");

    // component : 유저용 컴포넌트 //
    const UserCard =()=>{

        // state: 검색 쿼리 상태 //
        const [searchQuery, setSearchQuery] = useState('');

        // state: 검색 결과 서버 리스트 아이템 상태 //
        const [filteredServers, setFilteredServers] = useState<ServerListItem[]>([]);

        // state: 서버 데이터 리스트 아이템 상태 //
        const [serverData, setServerData] = useState<ServerListItem[]>([]);

        // function : renderServerCard 함수 //
        const renderServerCard = ({ item }: { item: ServerListItem }) => {
            const imageUrl = item.gameImage.replace('localhost', '10.0.2.2');
            return (
                <TouchableOpacity onPress={() => serverListCardClickEventHandler(item)} style={styles.card}>
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

        // function : getUserServerListResponse 함수 //
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

        // event handler: 리스트 카드 클릭 이벤트 처리 //
        const serverListCardClickEventHandler = (server: ServerListItem) => {
            navigation.navigate('ServerDetailsScreen', { server });
            
        };

        // event handler: 검색 버튼 클릭 이벤트 처리 //
        const searchButtonClickEventHandler = (query: string) => {
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

        // effect : 첫 마운트 시 실행될 함수 - 서버 리스트 불려오기 //
        useEffect(() => {
            if (loginUser?.id) getUserServerListRequest(loginUser.id).then(getUserServerListResponse);
        }, [loginUser]);

        // render : myServer Screen 렌더링 //
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.searchContainer}>
                    <Icon name="search" size={24} color="#6200ea" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="서버 검색"
                        onChangeText={searchButtonClickEventHandler}
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
    }

    // component : 어드민용 컴포넌트 //
    const AdminCard =()=>{

        // state: 검색 쿼리 상태 //
        const [searchQuery, setSearchQuery] = useState('');

        // state: 검색 결과 서버 리스트 아이템 상태 //
        const [filteredServers, setFilteredServers] = useState<AdminServerListItem[]>([]);

        // state: 서버 데이터 리스트 아이템 상태 //
        const [serverData, setServerData] = useState<AdminServerListItem[]>([]);

        // function : renderAdminServerCard 함수 //
        const renderAdminServerCard = ({ item }: { item: AdminServerListItem}) => {
            return (
                <TouchableOpacity onPress={() => serverListCardClickEventHandler(item)} style={styles.card}>
                    <View style={styles.textContainer}>
                        <Text style={styles.serverName}>{item.name}</Text>
                        <Text style={styles.billingAmount}>고객 ID : {item.userId}</Text>
                        <Text style={styles.gameTitle}>{item.gameTitle}</Text>
                        <Text style={styles.billingAmount}>월 {item.billingAmount}</Text>
                        <Text style={styles.billingAmount}>상태 : {item.status}</Text>
                        <Text style={styles.billingAmount}>IP주소 : {item.serverAddress}</Text>
                    </View>
                </TouchableOpacity>
            );
        };

        // function : getAdminServerListResponse 함수 //
        const getAdminServerListResponse = (responseBody: GetServerListResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
            if (code === 'VF') Alert.alert('제목과 내용은 필수입니다.');
            if (code !== 'SU') return;

            const { serverList } = responseBody as GetServerListResponseDto;
            setServerData(serverList);
            setFilteredServers(serverList);
        }

        // event handler: 리스트 카드 클릭 이벤트 처리 //
        const serverListCardClickEventHandler = (server: AdminServerListItem) => {
            navigation.navigate('ServerManagingScreen', { server });
        };

        // event handler: 검색 버튼 클릭 이벤트 처리 //
        const searchButtonClickEventHandler = (query: string) => {
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

        // effect : 첫 마운트 시 실행될 함수 - 모든 서버 리스트 가져오기 //
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const accessToken = await getAccessToken();
                    if (accessToken) {
                    const response = await getAdminServerListRequest(accessToken);
                    getAdminServerListResponse(response);
                    } else {
                    Alert.alert('Error', 'accessToken을 얻는데 실패하였습니다.');
                    }
                } catch (error) {
                    Alert.alert('Error', '서버 목록을 얻는데 실패하였습니다.');
                }
            };
        
            fetchData();
        }, [loginUser]);

        // render : myServer Screen 렌더링 //
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.searchContainer}>
                    <Icon name="search" size={24} color="#6200ea" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="서버 검색"
                        onChangeText={searchButtonClickEventHandler}
                        value={searchQuery}
                    />
                </View>
                <FlatList
                    data={filteredServers}
                    renderItem={renderAdminServerCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.cardContainer}
                />
            </SafeAreaView>
        );
    }

    // render : user의 ROLE에 따른 컴포넌트 렌더링 //
    return(
        <View style={styles.mainContainer}>
            {view === 'user' && <UserCard />}
            {view === 'admin' && <AdminCard />}
        </View>
    )
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    mainContainer: {
        flex: 1,
        width: '100%',
        paddingVertical: 20,
        justifyContent: 'center',
        backgroundColor: '#6200ea',
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

export default ServerScreen;
