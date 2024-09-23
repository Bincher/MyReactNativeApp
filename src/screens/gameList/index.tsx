import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { Game } from '../../types/Game';
import { gameData } from '../../mocks';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import useLoginUserStore from '../../stores/login-user.store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, MediaType } from 'react-native-image-picker'; 
import { fileUploadRequest, postGameRequest} from '../../apis';
import { PostGameResponseDto } from '../../apis/response/game';
import { ResponseDto } from '../../apis/response';
import { PostGameRequestDto } from '../../apis/request/game';

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
    const [newGameImageFile, setNewGameImageFile] = useState<any>(null);
    const [newGameTitle, setNewGameTitle] = useState('');
    const [newGameDescription, setNewGameDescription] = useState('');

    // function: post board response 처리 함수 //
    const postGameResponse =(responseBody : PostGameResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const {code} = responseBody;
        if(code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
        if(code === 'VF') Alert.alert('제목과 내용은 필수입니다.');
        if(code !== 'SU') return;
  
        // Reset form
        setNewGameImage(null);
        setNewGameImageFile(null);
        setNewGameTitle('');
        setNewGameDescription('');
        setIsDialogVisible(false);

        Alert.alert('성공', '게임이 성공적으로 저장되었습니다.');
      }

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


    const handleImageUpload = () => {
        const options = {
            mediaType : "photo" as MediaType,
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('이미지 선택을 취소하였습니다.');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const source = { uri: response.assets[0].uri };
                setNewGameImage(source.uri as string);
                setNewGameImageFile(response.assets[0]);
            }
        });
    };

    const handleSaveGame = async () => {
        if (!newGameImageFile || !newGameTitle || !newGameDescription) {
            Alert.alert('Error', '타이틀, 설명, 이미지를 모두 작성해주세요');
            return;
        }

        const formData = new FormData();
        formData.append('file', {
            uri: newGameImageFile.uri,
            type: newGameImageFile.type,
            name: newGameImageFile.fileName,
        });

        try {
            const imageUrl = await fileUploadRequest(formData);
            if (!imageUrl) {
                throw new Error('Failed to upload image');
            }

            const gameImage = imageUrl;
            const title = newGameTitle;
            const description = newGameDescription;
            const requestBody: PostGameRequestDto = {
                title, description, gameImage
            }

            console.log('New game:', { image: imageUrl, title: newGameTitle, description: newGameDescription });
            postGameRequest(requestBody).then(postGameResponse);

            
        } catch (error) {
            console.error('Error saving game:', error);
            Alert.alert('Error', 'Failed to save game');
        }
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
