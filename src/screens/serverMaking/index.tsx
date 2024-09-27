import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, Switch, Modal, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';
import { Game } from '../../types/Game';
import PostGameServerRequestDto from '../../apis/request/game/post-game-server.request.dto';
import { postGameServerRequest } from '../../apis';
import PostGameServerResponseDto from '../../apis/response/game/post-game-server.response.dto';
import { ResponseDto } from '../../apis/response';
import { useAuth } from '../../context/Auth';
import Icon from 'react-native-vector-icons/MaterialIcons';


type RootStackParamList = {
    ServerMaking: { game: Game };
};

type ServerMakingRouteProp = RouteProp<RootStackParamList, 'ServerMaking'>;

const ServerMaking: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<ServerMakingRouteProp>();
    const { game } = route.params;
    const { getAccessToken } = useAuth();

    const [serverName, setServerName] = useState('');
    const [serverContent, setServerContent] = useState('');
    const [serverLocation, setServerLocation] = useState('서울');
    const [serverPerformance, setServerPerformance] = useState('BASIC');
    const [serverDisk, setServerDisk] = useState('BASIC');
    const [serverBackup, setServerBackup] = useState(false);
    const [serverModeCount, setServerModeCount] = useState<number | null>(null);
    const [serverBillingAmount, setServerBillingAmount] = useState("0");
    const [inputValue, setInputValue] = useState('');
    const [serverRequestDetails, setServerRequestDetails] = useState('');

    const [serverNameError, setServerNameError] = useState('');
    const [serverModeCountError, setServerModeCountError] = useState('');
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [infoContent, setInfoContent] = useState('');

    const calculateEstimatedCost = () => {
        // Logic to calculate estimated cost based on server settings
        return '100,000원'; // Example estimated cost
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

    const handleCancel = () => {
        navigation.goBack();
    };

    const handleInputChange = (text: string) => {
        setInputValue(text);
        const parsedNumber = parseInt(text, 10);
        if (!isNaN(parsedNumber) && parsedNumber > 0) {
            setServerModeCount(parsedNumber);
            setServerModeCountError('');
        } else {
            setServerModeCount(null);
            setServerModeCountError('숫자만 입력 가능합니다');
        }
    };

    const handleCreateServer = async () => {
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
                billingAmount: serverBillingAmount,
                requestDetails: serverRequestDetails,
                modeCount: serverModeCount!,
                gameTitle
            };
        
            const accessToken = await getAccessToken();
            if (accessToken) {
                postGameServerRequest(requestBody, accessToken).then(postGameServerResponse);
            } else {
                Alert.alert('Error', 'Failed to save game by accessToken');
            }
        } catch (error) {
            console.error('Error saving game:', error);
            Alert.alert('Error', 'Failed to save game');
        }
    };

    const showInfo = (content: string) => {
        setInfoContent(content);
        setInfoModalVisible(true);
    };

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
                            <TouchableOpacity onPress={() => showInfo('서버의 고유한 이름을 입력하세요.')}>
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
                        <TouchableOpacity onPress={() => showInfo('서버에 대한 간단한 설명을 입력하세요.')}>
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
                            <Picker.Item label="부산" value="부산" />
                            <Picker.Item label="대전" value="대전" />
                        </Picker>
                        <TouchableOpacity onPress={() => showInfo('서버가 위치할 지역을 선택하세요.')}>
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
                            <Picker.Item label="기본" value="BASIC" />
                            <Picker.Item label="고성능" value="HIGH" />
                        </Picker>
                        <TouchableOpacity onPress={() => showInfo('서버의 성능 수준을 선택하세요.')}>
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
                            <Picker.Item label="기본" value="BASIC" />
                            <Picker.Item label="대용량" value="LARGE" />
                        </Picker>
                        <TouchableOpacity onPress={() => showInfo('서버의 저장소 크기를 선택하세요.')}>
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
                        <TouchableOpacity onPress={() => showInfo('서버 데이터의 백업 여부를 선택하세요.')}>
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
                        onChangeText={handleInputChange}
                        placeholder="모드 개수를 입력하세요"
                        keyboardType="numeric"
                        />
                        <TouchableOpacity onPress={() => showInfo('게임 모드의 개수를 숫자로 입력하세요.')}>
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
                        <TouchableOpacity onPress={() => showInfo('추가적인 요청 사항이나 모드 이름을 입력하세요.')}>
                            <Icon name="help-outline" size={24} color="#6200ea" />
                        </TouchableOpacity>
                    </View>
                </View>
        
                <Text style={styles.estimatedCost}>예상 청구 금액: 월 {calculateEstimatedCost()}</Text>
        
                <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleCreateServer}>
                    <Text style={styles.buttonText}>서버 생성</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
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
});

export default ServerMaking;

