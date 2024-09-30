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
    const [serverMode, setServerMode] = useState(0);
    const [inputValue, setInputValue] = useState('');

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
            setServerMode(parsedNumber);
            } else {
            setServerMode(0);
            }
        };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                <Text style={styles.label}>게임: {game.title}</Text>
                <View style={styles.divider} />
                    <Text style={styles.label}>서버 이름</Text>
                    <TextInput
                        style={styles.input}
                        value={serverName}
                        onChangeText={setServerName}
                    />
                    <Text style={styles.label}>서버 설명</Text>
                    <TextInput
                        style={styles.input}
                        value={serverDescription}
                        onChangeText={setServerDescription}
                    />
                <View style={styles.divider} />
                    <Text style={styles.label}>서버 위치</Text>
                    <Picker
                        selectedValue={serverLocation}
                        onValueChange={(itemValue) => setServerLocation(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="서울" value="서울" />
                        <Picker.Item label="도쿄" value="도쿄" />
                        <Picker.Item label="유럽" value="유럽" />
                        <Picker.Item label="북미" value="북미" />
                    </Picker>
                    <Text style={styles.label}>서버 성능</Text>
                    <Picker
                        selectedValue={serverPerformance}
                        onValueChange={(itemValue) => setServerPerformance(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="BASIC" value="BASIC" />
                        <Picker.Item label="STANDARD" value="STANDARD" />
                        <Picker.Item label="PLUS" value="PLUS" />
                        <Picker.Item label="PRO" value="PRO" />
                    </Picker>
                    <Text style={styles.label}>서버 저장소</Text>
                    <Picker
                        selectedValue={serverStorage}
                        onValueChange={(itemValue) => setServerStorage(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="BASIC" value="BASIC" />
                        <Picker.Item label="STANDARD" value="STANDARD" />
                        <Picker.Item label="PRO" value="PRO" />
                    </Picker>
                <View style={styles.divider} />
                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>서버 백업 여부</Text>
                        <Switch
                            value={serverBackup}
                            onValueChange={setServerBackup}
                        />
                    </View>
                <View style={styles.divider} />
                    <Text style={styles.label}>게임 모드 개수(정확히 작성해주세요)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="모드 개수"
                        value={inputValue}
                        onChangeText={handleInputChange}
                        autoCapitalize="none"
                        keyboardType="numeric"
                    />
                    {serverMode === null && inputValue !== '' && (
                        <Text style={styles.errorText}>유효한 숫자를 입력해주세요.</Text>
                    )}
                <Text style={styles.label}>요청 사항(모드 명)</Text>
                <TextInput
                    style={styles.input}
                    value={serverDescription}
                    onChangeText={setServerDescription}
                />
                <View style={styles.divider} />
                <View style={styles.divider} />
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
});

export default ServerMaking;

