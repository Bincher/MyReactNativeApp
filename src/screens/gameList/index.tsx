import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { Game } from '../../types/Game';
import { gameData } from '../../mocks';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import useLoginUserStore from '../../stores/login-user.store';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RootStackParamList = {
    GameList: undefined;
    ServerMaking: {game: Game};
};

type GameListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameList'>;

const GameList: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredGames, setFilteredGames] = useState<Game[]>(gameData);
    const { loginUser } = useLoginUserStore();
    const navigation = useNavigation<GameListScreenNavigationProp>();

    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [newGameImage, setNewGameImage] = useState<string | null>(null);
    const [newGameTitle, setNewGameTitle] = useState('');
    const [newGameDescription, setNewGameDescription] = useState('');

    const handleSearch = (query: string) => {
        const filtered = gameData.filter(game =>
            game.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredGames(filtered);
        setSearchQuery(query);
    };

    const handleCardPress = (game: Game) => {
        navigation.navigate('ServerMaking', {game});
    };

    const renderGameCard = ({ item }: { item: Game }) => (
        <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.card}>
            <Image source={{uri : item?.gameImage}} style={styles.gameImage} />
            <View style={styles.gameInfo}>
                <Text style={styles.gameName}>{item.title}</Text>
                <Text style={styles.genre}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    const handleAddGame = () => {
        setIsDialogVisible(true);
    };

    const handleSaveGame = () => {
        // 여기에 백엔드 연동 로직을 추가할 수 있습니다.
        console.log('New game:', { image: newGameImage, title: newGameTitle, description: newGameDescription });
        setIsDialogVisible(false);
        // 상태 초기화
        setNewGameImage(null);
        setNewGameTitle('');
        setNewGameDescription('');
    };

    const handleImageUpload = () => {
        // 이미지 업로드 로직을 여기에 구현합니다.
        // 예를 들어, 이미지 피커를 열고 선택된 이미지의 URI를 setNewGameImage로 설정합니다.
        console.log('Image upload');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search"
                onChangeText={handleSearch}
                value={searchQuery}
            />
            <FlatList
                data={filteredGames}
                renderItem={renderGameCard}
                keyExtractor={item => item.title.toString()}
            />
            {loginUser?.role === 'ROLE_ADMIN' && (
                <TouchableOpacity style={styles.addButton} onPress={handleAddGame}>
                    <Icon name="add" size={24} color="#fff" />
                </TouchableOpacity>
            )}
            <Modal
                visible={isDialogVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {newGameImage ? (
                            <Image source={{uri: newGameImage}} style={styles.imagePreview} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Text>No Image</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                            <Text style={styles.buttonText}>Upload Image</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder="Game Title"
                            value={newGameTitle}
                            onChangeText={setNewGameTitle}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Game Description"
                            value={newGameDescription}
                            onChangeText={setNewGameDescription}
                            multiline
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleSaveGame}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => setIsDialogVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    searchInput: {
        height: 40,
        borderColor: '#6200ea',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
    },
    gameImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginRight: 15,
    },
    gameInfo: {
        flex: 1,
    },
    gameName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6200ea',
    },
    genre: {
        fontSize: 16,
        color: '#666',
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6200ea',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
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
    input: {
        width: '100%',
        height: 40,
        borderColor: '#6200ea',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        backgroundColor: '#6200ea',
        padding: 10,
        borderRadius: 5,
        width: '45%',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default GameList;
