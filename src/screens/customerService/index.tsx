import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { serverData } from '../../mocks';
import { Server } from '../../types/Server';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { ServerListItem } from '../../types/interface';
import { useAuth } from '../../context/Auth';
import { getUserServerListRequest } from '../../apis';
import useLoginUserStore from '../../stores/login-user.store';
import { GetUserServerListResponseDto } from '../../apis/response/game';
import { ResponseDto } from '../../apis/response';

// 미완성

type RootStackParamList = {
    CustomerService: undefined;
    Main: undefined;
};

type CustomerServiceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CustomerService'>;

const CustomerService: React.FC = () => {
    const [selectedServer, setSelectedServer] = useState<string>('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [serverList, setServerList] = useState<ServerListItem[]>([]);

    const navigation = useNavigation<CustomerServiceScreenNavigationProp>();
    const { getAccessToken } = useAuth();

    /// 로그인 정보 저장소 접근
    const { loginUser } = useLoginUserStore();

    useEffect(() => {
        fetchServerList();
    }, []);

    // function : getUserServerListResponse 함수 //
    const getUserServerListResponse = (responseBody: GetUserServerListResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
        if (code === 'VF') Alert.alert('제목과 내용은 필수입니다.');
        if (code !== 'SU') return;

        const { userServerList } = responseBody as GetUserServerListResponseDto;
        setServerList(userServerList);
    }

    const fetchServerList = async () => {
        if (loginUser?.id) getUserServerListRequest(loginUser.id).then(getUserServerListResponse);
    };

    const handleSendInquiry = async () => {
        if (!subject || !content) {
        Alert.alert('오류', '제목과 내용을 모두 입력해주세요.');
        return;
        }

        // const accessToken = await getAccessToken();
        // if (accessToken) {
        //     const response = await sendInquiryRequest({
        //         serverId: selectedServer,
        //         subject,
        //         content
        //     }, accessToken);

        //     if (response && response.code === 'SU') {
        //         Alert.alert('성공', '문의가 성공적으로 전송되었습니다.');
        //         setSelectedServer('');
        //         setSubject('');
        //         setContent('');
        //     } else {
        //         Alert.alert('오류', '문의 전송에 실패했습니다. 다시 시도해주세요.');
        //     }
        // }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>고객 문의</Text>
        
            <Picker
                selectedValue={selectedServer}
                onValueChange={(itemValue) => setSelectedServer(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="서버 선택 (선택사항)" value="" />
                {serverList.map((server) => (
                <Picker.Item key={server.id} label={server.name} value={server.id} />
                ))}
            </Picker>
        
            <TextInput
                style={styles.input}
                placeholder="제목"
                value={subject}
                onChangeText={setSubject}
            />
        
            <TextInput
                style={[styles.input, styles.contentInput]}
                placeholder="내용"
                value={content}
                onChangeText={setContent}
                multiline
            />
        
            <TouchableOpacity style={styles.button} onPress={handleSendInquiry}>
                <Text style={styles.buttonText}>문의 보내기</Text>
            </TouchableOpacity>
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

export default CustomerService;
