import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Switch, Modal, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';
import { Game } from '../../types/game';
import PostGameServerRequestDto from '../../apis/request/game/post-game-server.request.dto';
import { postGameServerRequest } from '../../apis';
import PostGameServerResponseDto from '../../apis/response/game/post-game-server.response.dto';
import { ResponseDto } from '../../apis/response';
import { useAuth } from '../../context/Auth';
import Icon from 'react-native-vector-icons/MaterialIcons';


type RootStackParamList = {
    ServerMakingScreen: { game: Game };
};

type ServerMakingScreenRouteProp = RouteProp<RootStackParamList, 'ServerMakingScreen'>;

const ServerMakingScreen: React.FC = () => {

    /// 네비게이션 등록
    const navigation = useNavigation();

    /// 루트
    const route = useRoute<ServerMakingScreenRouteProp>();

    /// params
    const { game } = route.params;

    /// AccessToken 접근
    const { getAccessToken } = useAuth();

    // state: 서버 이름 상태 //
    const [serverName, setServerName] = useState('');

    // state: 서버 설명 상태 //
    const [serverContent, setServerContent] = useState('');

    // state: 서버 위치 상태 //
    const [serverLocation, setServerLocation] = useState('서울');

    // state: 서버 성능 상태 //
    const [serverPerformance, setServerPerformance] = useState<'BASIC' | 'STANDARD' | 'PLUS' | 'PRO'>('BASIC');

    // state: 서버 저장소 상태 //
    const [serverDisk, setServerDisk] = useState<'BASIC' | 'STANDARD' | 'PRO'>('BASIC');

    // state: 서버 백업 여부 상태 //
    const [serverBackup, setServerBackup] = useState(false);

    // state: 서버 모드 개수 상태 //
    const [serverModeCount, setServerModeCount] = useState<number>(0);

    // state: 서버 요청 사항 input box 데이터 상태 //
    const [inputValue, setInputValue] = useState('');

    // state: 서버 요청 사항 상태 //
    const [serverRequestDetails, setServerRequestDetails] = useState('');

    // state: 서버 생성 에러 상태 //
    const [serverNameError, setServerNameError] = useState('');

    // state: 서버 모드 개수 입력 에러 상태 //
    const [serverModeCountError, setServerModeCountError] = useState('');

    // state: 자세한 정보 모달 상태 //
    const [infoModalVisible, setInfoModalVisible] = useState(false);

    // state: 자세한 정보 내용 상태 //
    const [infoContent, setInfoContent] = useState('');

    // function: calcuateEstimatedCost 함수 //
    const calculateEstimatedCost = (
        gameGrade: string,
        serverPerformance: 'BASIC' | 'STANDARD' | 'PLUS' | 'PRO',
        serverDisk: 'BASIC' | 'STANDARD' | 'PRO',
        serverBackup: boolean,
        modeCount: number
    ): string => {

        if (gameGrade === 'N') {
            return '논의 후 결정';
        }
        
        let baseCost = 0;
        
        // 게임 등급에 따른 기본 비용
        switch (gameGrade) {
            case 'A': baseCost = 50000; break;
            case 'B': baseCost = 70000; break;
            case 'C': baseCost = 90000; break;
            case 'D': baseCost = 120000; break;
        }   
        
        // 서버 성능에 따른 추가 비용
        switch (serverPerformance) {
            case 'BASIC': break; // 기본 비용 추가 없음
            case 'STANDARD': baseCost *= 1.3; break;
            case 'PLUS': baseCost *= 1.6; break;
            case 'PRO': baseCost *= 2; break;
        }
        
        // 서버 저장소에 따른 추가 비용
        switch (serverDisk) {
            case 'BASIC': break; // 기본 비용 추가 없음
            case 'STANDARD': baseCost += 20000; break;
            case 'PRO': baseCost += 50000; break;
        }
        
        // 서버 백업 유무에 따른 추가 비용
        if (serverBackup) {
            baseCost += 20000;
        }

        const additionalModeCost = Math.min(modeCount, 10) * 5000;
        baseCost += additionalModeCost;

        return `${baseCost.toLocaleString()}원`;
    };

    // function : showInfo 함수 //
    const showInfo = (content: string) => {
        setInfoContent(content);
        setInfoModalVisible(true);
    };

    // function: post game server response 처리 함수 //
    const postGameServerResponse =(responseBody : PostGameServerResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const {code} = responseBody;
        if(code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
        if(code === 'VF') Alert.alert('제목과 내용은 필수입니다.');
        if(code === 'NP') Alert.alert('인증 과정에서 문제가 발생하였습니다.');
        if(code !== 'SU') return;

        Alert.alert('성공', '서버가 성공적으로 저장되었습니다.');
        navigation.goBack();
    }

    // event handler: 취소 버튼 클릭 이벤트 처리 //
    const cancelButtonClickEventHandler = () => {
        navigation.goBack();
    };

    // event handler: mode count input box 데이터 입력 이벤트 처리 //
    const inputChangeEventHandler = (text: string) => {
        setInputValue(text);
        const parsedNumber = parseInt(text, 10);
        if (!isNaN(parsedNumber) && parsedNumber > 0) {
            setServerModeCount(parsedNumber);
            setServerModeCountError('');
        } else {
            setServerModeCount(0);
            setServerModeCountError('숫자만 입력 가능합니다');
        }
    };

    // event handler: 생성 버튼 클릭 이벤트 처리 //
    const createServerButtonClickEventHandler = async () => {
        let hasError = false;
    
        if (!serverName) {
            setServerNameError('서버 이름은 필수로 작성하셔야 합니다.');
            hasError = true;
        } else {
            setServerNameError('');
        }

        if (serverModeCount === null) {
            setServerModeCountError('모드 개수는 필수로 작성하셔야 합니다.');
            hasError = true;
        } else {
            setServerModeCountError('');
        }
    
        if (hasError) return;
    
        try {
            const gameTitle = game.title;
            const requestBody: PostGameServerRequestDto = {
                name: serverName,
                content: serverContent,
                location: serverLocation,
                performance: serverPerformance,
                disk: serverDisk,
                backup: serverBackup,
                billingAmount: calculateEstimatedCost(game.amountLevel, serverPerformance, serverDisk, serverBackup, serverModeCount),
                requestDetails: serverRequestDetails,
                modeCount: serverModeCount!,
                gameTitle
            };
        
            const accessToken = await getAccessToken();
            if (accessToken) {
                postGameServerRequest(requestBody, accessToken).then(postGameServerResponse);
            } else {
                Alert.alert('에러', '유저 인증 과정에 문제가 발생하였습니다.');
            }
        } catch (error) {
            Alert.alert('에러', '게임 저장에 실패하였습니다.');
        }
    };

    // render: ServerMaking 스크린 렌더링 //
    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                <Text style={styles.title}>게임: {game.title}</Text>      
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>서버 이름</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={serverName}
                            onChangeText={setServerName}
                            placeholder="서버 이름을 입력하세요"
                            />
                            <TouchableOpacity style={styles.infoButton} onPress={() => showInfo('서버의 이름을 작성하시면 됩니다. \n서버 이름은 중복이 가능합니다.\n생성 후 수정이 가능합니다.')}>
                                <Icon name="help-outline" size={24} color="#6200ea" />
                            </TouchableOpacity>
                        </View>
                    {serverNameError ? <Text style={styles.errorText}>{serverNameError}</Text> : null}
                </View>
        
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>서버 설명</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                        style={styles.input}
                        value={serverContent}
                        onChangeText={setServerContent}
                        placeholder="서버 설명을 입력하세요"
                        multiline
                        />
                        <TouchableOpacity style={styles.infoButton} onPress={() => showInfo('서버의 설명을 작성하시면 됩니다.\n생성 후 수정이 가능합니다.')}>
                            <Icon name="help-outline" size={24} color="#6200ea" />
                        </TouchableOpacity>
                    </View>
                </View>
        
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>서버 위치</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                        selectedValue={serverLocation}
                        onValueChange={(itemValue) => setServerLocation(itemValue)}
                        style={styles.picker}
                        >
                            <Picker.Item label="서울" value="서울" />
                            <Picker.Item label="유럽" value="유럽" />
                            <Picker.Item label="미국" value="미국" />
                            <Picker.Item label="기타" value="기타" />
                        </Picker>
                        <TouchableOpacity style={styles.infoButton} onPress={() => showInfo('서버가 위치할 지역을 선택하세요.\n서버 사용자들의 위치를 우선하여 선정하시면 됩니다.\n 기타 위치를 원하실경우 기타 선택 후 요청사항에 작성해주시길 바랍니다.')}>
                            <Icon name="help-outline" size={24} color="#6200ea" />
                        </TouchableOpacity>
                    </View>
                </View>
        
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>서버 성능</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                        selectedValue={serverPerformance}
                        onValueChange={(itemValue) => setServerPerformance(itemValue)}
                        style={styles.picker}
                        >
                            <Picker.Item label="BASIC PLAN" value="BASIC" />
                            <Picker.Item label="STANDARD PLAN" value="STANDARD" />
                            <Picker.Item label="PLUS PLAN" value="PLUS" />
                            <Picker.Item label="PRO PLAN" value="PRO" />
                        </Picker>
                        <TouchableOpacity style={styles.infoButton} onPress={() => showInfo('서버의 성능을 선택하세요.\n\nBASIC: 1-2명의 사용자를 지원하는 서버로, 소규모 개인 게임이나 테스트용으로 적합합니다.\n\nSTANDARD: 3-10명의 사용자를 지원하는 서버로, 친구들과 함께 하는 소규모 멀티플레이어 게임에 적합합니다.\n\n PLUS: 10-50명의 사용자를 지원하는 서버로, 중형 규모의 게임 커뮤니티에 적합합니다.\n\nPRO: 50명 이상의 사용자를 지원하는 서버로, 대형 게임 커뮤니티나 클랜 활동에 적합합니다')}>
                            <Icon name="help-outline" size={24} color="#6200ea" />
                        </TouchableOpacity>
                    </View>
                </View>
        
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>서버 저장소</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                        selectedValue={serverDisk}
                        onValueChange={(itemValue) => setServerDisk(itemValue)}
                        style={styles.picker}
                        >
                            <Picker.Item label="BASIC" value="BASIC" />
                            <Picker.Item label="STANDARD" value="STANDARD" />
                            <Picker.Item label="PRO" value="PRO" />
                        </Picker>
                        <TouchableOpacity style={styles.infoButton} onPress={() => showInfo('서버의 저장소 성능을 선택하세요.\n\nBASIC: 하드디스크를 사용합니다. PVE 위주의 게임에게 추천드립니다.\n\nSTANDARD: SSD를 사용합니다. PVP 위주의 게임에게 추천드립니다.\n\nPRO: 고품질 SSD를 사용합니다. 대규모 서버에게 추천드립니다.')}>
                            <Icon name="help-outline" size={24} color="#6200ea" />
                        </TouchableOpacity>
                    </View>
                </View>
        
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>서버 백업 여부</Text>
                    <View style={styles.switchContainer}>
                        <Switch
                        value={serverBackup}
                        onValueChange={setServerBackup}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={serverBackup ? "#f5dd4b" : "#f4f3f4"}
                        />
                        <TouchableOpacity style={styles.infoButton} onPress={() => showInfo('서버 백업 여부를 선택해주세요.\n\n서버 백업 서비스를 신청할시 하루마다 이메일로 서버 백업본을 제공합니다.\n\n서버 오류로 인한 백업은 이 선택과 관련없이 제공됩니다.')}>
                            <Icon name="help-outline" size={24} color="#6200ea" />
                        </TouchableOpacity>
                    </View>
                </View>
        
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>게임 모드 개수</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                        style={styles.input}
                        value={inputValue}
                        onChangeText={inputChangeEventHandler}
                        placeholder="모드 개수를 입력하세요"
                        keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.infoButton} onPress={() => showInfo('게임 모드의 개수를 입력해주세요. \n\n요금 결정과 관련된 문제이므로 신중히 작성하여주십시오.\n\n작성을 완료하면 요청 사항에 모드 명을 모두 기입해주시기 바랍니다.\n\n모드에 대한 혼동을 방지하기 위해 모드의 제작자나 링크를 첨부하시면 감사하겠습니다.\n\n일부 게임이나 모드는 지원이 안될 수 있습니다.')}>
                            <Icon name="help-outline" size={24} color="#6200ea" />
                        </TouchableOpacity>
                    </View>
                    {serverModeCountError ? <Text style={styles.errorText}>{serverModeCountError}</Text> : null}
                </View>
        
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>요청 사항(모드 명)</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                        style={styles.input}
                        value={serverRequestDetails}
                        onChangeText={setServerRequestDetails}
                        placeholder="요청 사항을 입력하세요"
                        multiline
                        />
                        <TouchableOpacity style={styles.infoButton} onPress={() => showInfo('위의 개시된 내용을 제외한 나머지 요청 사항들을 작성해주세요. \n\n일부 요청사항은 추가 요금이 발생할 수 있으며, 거부될 수도 있습니다.\n\n위의 작성한 모드 개수에 맞춰 모드 명을 모두 기입해주시기 바랍니다.\n\n모드에 대한 혼동을 방지하기 위해 모드의 제작자나 링크를 첨부하시면 감사하겠습니다.\n\n일부 게임이나 모드는 지원이 안될 수 있습니다.')}>
                            <Icon name="help-outline" size={24} color="#6200ea" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.estimatedCost}>예상 청구 금액: 월 {calculateEstimatedCost(game.amountLevel, serverPerformance, serverDisk, serverBackup, serverModeCount)}</Text>
        
                <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={createServerButtonClickEventHandler}>
                    <Text style={styles.buttonText}>서버 생성</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={cancelButtonClickEventHandler}>
                    <Text style={styles.buttonText}>취소</Text>
                </TouchableOpacity>
                </View>
            </View>
    
            <Modal
                animationType="slide"
                transparent={true}
                visible={infoModalVisible}
                onRequestClose={() => setInfoModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{infoContent}</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setInfoModalVisible(false)}>
                        <Text style={styles.modalButtonText}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
    },
        container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#6200ea',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#6200ea',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    pickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#6200ea',
        borderWidth: 1,
        borderRadius: 5,
    },
    picker: {
        flex: 1,
        height: 40,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    estimatedCost: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#6200ea',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#6200ea',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    imagePreview: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    imagePlaceholder: {
        width: 200,
        height: 200,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    uploadButton: {
        backgroundColor: '#6200ea',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#6200ea',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoButton: {
        marginLeft: 10,
        padding: 5,
    },
});

export default ServerMakingScreen;