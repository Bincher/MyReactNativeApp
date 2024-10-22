import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { serverData } from '../../mocks';
import { Server } from '../../types/Server';
import { StackNavigationProp } from '@react-navigation/stack';

// 미완성

type RootStackParamList = {
    CustomerService: undefined;
    Main: undefined;
};

type CustomerServiceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CustomerService'>;

const CustomerService: React.FC = () => {
    const navigation = useNavigation<CustomerServiceScreenNavigationProp>();
    const [selectedTab, setSelectedTab] = useState<'server' | 'other'>('server');
    const [selectedServer, setSelectedServer] = useState<Server | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSendInquiry = () => {
        if (!title || !content) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        // 문의 보내기 로직 처리
        Alert.alert('문의 전송 완료', '문의가 성공적으로 전송되었습니다.');
        setTitle('');
        setContent('');
        setSelectedServer(null);
        navigation.navigate('Main');
    };

    const handleCancel = () => {
        setTitle('');
        setContent('');
        setSelectedServer(null);
        navigation.navigate('Main');
    };

    const renderServerItem = ({ item }: { item: Server }) => (
        <TouchableOpacity onPress={() => setSelectedServer(item)} style={styles.serverItem}>
            <Text style={styles.serverItemText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <Button
                    title="나의 서버 문의"
                    onPress={() => setSelectedTab('server')}
                    color={selectedTab === 'server' ? '#6200ea' : 'gray'}
                />
                <Button
                    title="기타 문의"
                    onPress={() => setSelectedTab('other')}
                    color={selectedTab === 'other' ? '#6200ea' : 'gray'}
                />
            </View>
            {selectedTab === 'server' && (
                <>
                    <FlatList
                        data={serverData}
                        renderItem={renderServerItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.serverList}
                    />
                    {selectedServer && (
                        <Text style={styles.selectedServerText}>선택된 서버: {selectedServer.name}</Text>
                    )}
                </>
            )}
            <View style={styles.divider} />
            <TextInput
                style={styles.input}
                placeholder="문의 제목"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="문의 내용"
                value={content}
                onChangeText={setContent}
                multiline
            />
            <View style={styles.buttonContainer}>
                <Button title="문의 보내기" onPress={handleSendInquiry} color="#6200ea" />
                <Button title="취소" onPress={handleCancel} color="red" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    serverList: {
        marginBottom: 10,
    },
    serverItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    serverItemText: {
        fontSize: 16,
        color: '#6200ea',
    },
    selectedServerText: {
        fontSize: 16,
        color: '#6200ea',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#6200ea',
        marginVertical: 10,
    },
});

export default CustomerService;
