import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, Switch } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';
import { Game } from '../../types/Game';

type RootStackParamList = {
    ServerMaking: { game: Game };
};

type ServerMakingRouteProp = RouteProp<RootStackParamList, 'ServerMaking'>;

const ServerMaking: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<ServerMakingRouteProp>();
    const { game } = route.params;

    const [serverName, setServerName] = useState('');
    const [serverDescription, setServerDescription] = useState('');
    const [serverLocation, setServerLocation] = useState('서울');
    const [serverPerformance, setServerPerformance] = useState('BASIC');
    const [serverStorage, setServerStorage] = useState('BASIC');
    const [serverBackup, setServerBackup] = useState(false);
    const [serverModes, setServerModes] = useState<{ [key: string]: boolean }>({
        a모드: false,
        b모드: false,
        c모드: false,
        d모드: false,
    });

    const calculateEstimatedCost = () => {
        // Logic to calculate estimated cost based on server settings
        return '100,000원'; // Example estimated cost
    };

    const handleCreateServer = () => {
        // Logic to create the server with the specified settings
        Alert.alert('Server Created', 'Your server has been created successfully.');
        navigation.goBack();
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                <Text style={styles.label}>게임: {game.gameName}</Text>
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
                <Text style={styles.label}>모드 추가</Text>
                {Object.keys(serverModes).map((mode) => (
                    <View key={mode} style={styles.switchContainer}>
                        <Text style={styles.label}>{mode}</Text>
                        <Switch
                            value={serverModes[mode]}
                            onValueChange={(value) => setServerModes((prevModes) => ({
                                ...prevModes,
                                [mode]: value,
                            }))}
                        />
                    </View>
                ))}
                <View style={styles.divider} />
                <Text style={styles.estimatedCost}>예상 청구 금액: 월 {calculateEstimatedCost()}</Text>
                <View style={styles.divider} />
                <View style={styles.buttonContainer}>
                    <Button title="서버 생성" onPress={handleCreateServer} />
                    <Button title="취소" onPress={handleCancel} color="red" />
                </View>
            </View>
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 20,
    },
    estimatedCost: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    divider: {
        height: 1,
        backgroundColor: '#6200ea',
        marginVertical: 10,
    },
});

export default ServerMaking;
