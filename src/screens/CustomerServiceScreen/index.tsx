import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { ServerListItem } from '../../types/interface';
import { SendEmailRequest, SendNotificationToAdminRequest, getUserServerListRequest } from '../../apis';
import useLoginUserStore from '../../stores/login-user.store';
import { GetUserServerListResponseDto } from '../../apis/response/game';
import { ResponseDto } from '../../apis/response';
import { SendEmailResponseDto, SendNotificationResponseDto } from '../../apis/response/support';
import { SendEmailRequestDto, SendNotificationRequestDto } from '../../apis/request/support';

type RootStackParamList = {
    CustomerServiceScreen: undefined;
    MainScreen: undefined;
};

type CustomerServiceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CustomerServiceScreen'>;

const CustomerServiceScreen: React.FC = () => {

    // navigation
    const navigation = useNavigation<CustomerServiceScreenNavigationProp>();

    // loginUser 정보
    const { loginUser } = useLoginUserStore();

    // state: 서버 리스트 상태 //
    const [serverList, setServerList] = useState<ServerListItem[]>([]);

    // state: 선택된 서버 상태 //
    const [selectedServer, setSelectedServer] = useState<number>(0);

    // state: 서버 정보 상태 //
    const [serverInformation, setServerInformation] = useState('');

    // state: 문의 내용 상태 //
    const [content, setContent] = useState('');

    // state: 로딩 상태 //
    const [isLoading, setIsLoading] = useState(false);  // 로딩 상태 추가

    // effect: 유저의 서버 리스트 가져오기 //
    useEffect(() => {
        fetchServerList();
    }, []);

    // function : getUserServerListResponse 함수 //
    const getUserServerListResponse = (responseBody: GetUserServerListResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
        if (code === 'NU') Alert.alert('유저 정보를 불려오지 못하였습니다.\n 다시 시도해주세요.');
        if (code !== 'SU') return;

        const { userServerList } = responseBody as GetUserServerListResponseDto;
        setServerList(userServerList);
    }

    // function : sendNotificationResponse 함수 //
    const sendNotificationResponse = (responseBody: SendNotificationResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'NF') Alert.alert('알림 전송 중 오류가 발생하였습니다.');
        if (code !== 'SU') return;
        setIsLoading(false);
        Alert.alert('성공', '문의가 성공적으로 전송되었습니다.')
    }

    // function : sendEmailResponse 함수 //
    const sendEmailResponse = (responseBody: SendEmailResponseDto | ResponseDto | null) => {

        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DI') Alert.alert('존재하지 않는 계정입니다. 재로그인 후 다시 시도하십시오.');
        if (code === 'MF') Alert.alert('이메일 전송 중 오류가 발생하였습니다.');
        if (code !== 'SU') return;
        
        setSelectedServer(0);
        setContent('');

        if(loginUser?.id){
            const requestBody: SendNotificationRequestDto = {
                title: "고객 지원 알림",
                message: `${loginUser.id} 님의 고객 지원 요청이 왔습니다. 이메일을 확인해주세요`
            };
            SendNotificationToAdminRequest(requestBody).then(sendNotificationResponse)
        }else{
            Alert.alert('유저 정보를 불려오지 못하였습니다. 다시 시도해주세요.');
            return;
        }
    }

    // function : fetchServerList - 유저의 서버 리스트 가져오기 //
    const fetchServerList = async () => {
        if (loginUser?.id) {
            getUserServerListRequest(loginUser.id).then(getUserServerListResponse);
        }
    };

    // event handler : 유저 서버 클릭 이벤트 //
    const serverClickEventHandler = (serverId: number) => {
        setSelectedServer(serverId);
        const selectedServerInfo = serverList.find(server => server.id === serverId);
        if (selectedServerInfo) {
            const serverInfoString = 
            `\n
            서버 ID: ${selectedServerInfo.id}
            서버 이름: ${selectedServerInfo.name}
            게임 제목: ${selectedServerInfo.gameTitle}
            서버 내용: ${selectedServerInfo.content}
            서버 위치: ${selectedServerInfo.location}
            서버 성능: ${selectedServerInfo.performance}
            디스크: ${selectedServerInfo.disk}
            백업: ${selectedServerInfo.backup}
            청구 금액: ${selectedServerInfo.billingAmount}
            요청 세부사항: ${selectedServerInfo.requestDetails}
            모드 개수: ${selectedServerInfo.modeCount}
            상태: ${selectedServerInfo.status}
            서버 주소: ${selectedServerInfo.serverAddress}
                            `.trim();
            setServerInformation(serverInfoString);
        } else {
            setServerInformation('');
        }
    };

    // event handler : 문의 전송 버튼 클릭 이벤트 처리 //
    const sendInquiryEventHandler = async () => {
        
        if (!content) {
            Alert.alert('오류', '내용을 모두 입력해주세요.');
            return;
        }
        if(loginUser?.id == null && loginUser?.email == null) {
            Alert.alert('로그인 정보를 가져오는 과정에서 문제가 발생하였습니다. 재로그인 후 다시 시도해주세요.');
            return;
        }

        setIsLoading(true);

        const requestBody: SendEmailRequestDto = {
            id: loginUser.id,
            email: loginUser.email,
            serverInformation,
            content
        };

        SendEmailRequest(requestBody).then(sendEmailResponse);
    };

    // render : customerService 스크린 렌더링 //
    return (
        <View style={styles.container}>
            <Text style={styles.title}>고객 문의</Text>
            <Picker
                selectedValue={selectedServer}
                onValueChange={serverClickEventHandler}
                style={styles.picker}
            >
                <Picker.Item label="서버 선택 (선택사항)" value="" />
                {serverList.map((server) => (
                    <Picker.Item key={server.id} label={server.name} value={server.id} />
                ))}
            </Picker>
            <TextInput
                style={[styles.input, styles.contentInput]}
                placeholder="내용"
                value={content}
                onChangeText={setContent}
                multiline
            />
            {/* 이메일 전송 중일 때는 로딩 스피너를 표시 */}
            {isLoading ? (
                <ActivityIndicator size="large" color="#6200ea" />
            ) : (
                <TouchableOpacity style={styles.button} onPress={sendInquiryEventHandler}>
                    <Text style={styles.buttonText}>문의 보내기</Text>
                </TouchableOpacity>
            )}
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
    picker: {
        height: 50,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    contentInput: {
        height: 120,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#6200ea',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CustomerServiceScreen;
