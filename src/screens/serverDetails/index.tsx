import React from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import ServerListItem from '../../types/interface/server-list-item.interface';
import { StackNavigationProp } from '@react-navigation/stack';
import { DeleteGameServerResponseDto } from '../../apis/response/game';
import { ResponseDto } from '../../apis/response';
import { deleteGameServerRequest } from '../../apis';
import { useAuth } from '../../context/Auth';

type RootStackParamList = {
    ServerDetails: { server: ServerListItem };
    ServerUpdating: { server: ServerListItem };
};

type ServerDetailsRouteProp = RouteProp<RootStackParamList, 'ServerDetails'>;
type ServerDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'ServerDetails'>;

const ServerDetails: React.FC = () => {

    /// 라우트
    const route = useRoute<ServerDetailsRouteProp>();

    /// 네비게이션
    const navigation = useNavigation<ServerDetailsNavigationProp>();

    /// 파라미터
    const { server } = route.params;

    /// 토큰 가져오기
    const { getAccessToken } = useAuth();

    // function: delete Server 함수 //
    const deleteServer = async () => {
        try {
            const accessToken = await getAccessToken();
            if (accessToken) {
                deleteGameServerRequest(server.id, accessToken).then(deleteGameServerResponse);
            } else {
                Alert.alert('Error', 'Failed to update server: No access token');
            }
        } catch (error) {
            console.error('Error updating server:', error);
            Alert.alert('Error', 'Failed to update server');
        }
    };

    // function: post game server response 처리 함수 //
    const deleteGameServerResponse = (responseBody: DeleteGameServerResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
        if (code === 'NP') Alert.alert('인증 과정에서 문제가 발생하였습니다.');
        if (code !== 'SU') return;

        Alert.alert('성공', '서버가 성공적으로 삭제되었습니다.');
        navigation.goBack();
    }

    // event handler: 수정 버튼 클릭 이벤트 //
    const editButtonClickEventHandler = () => {
        navigation.navigate('ServerUpdating', { server });
    };

    // event handler : 삭제 버튼 클릭 이벤트 //
    const deleteButtonClickEventHandler = () => {
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
                    onPress: () => deleteServer(),
                },
            ],
            { cancelable: false }
        );
    };

    // render: server Details 스크린 렌더링 //
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
                <TouchableOpacity style={styles.editButton} onPress={editButtonClickEventHandler}>
                    <Text style={styles.buttonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={deleteButtonClickEventHandler}>
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
