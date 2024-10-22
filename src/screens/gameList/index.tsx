import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { Game } from '../../types/Game';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import useLoginUserStore from '../../stores/login-user.store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, MediaType } from 'react-native-image-picker'; 
import { fileUploadRequest, getGameListRequest, postGameRequest} from '../../apis';
import { PostGameResponseDto } from '../../apis/response/game';
import { ResponseDto } from '../../apis/response';
import { PostGameRequestDto } from '../../apis/request/game';
import GetGameListResponseDto from '../../apis/response/game/get-game-list.response.dto';
import { Picker } from '@react-native-picker/picker';

type RootStackParamList = {
    GameList: undefined;
    ServerMaking: {game: Game};
};

type GameListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameList'>;

const GameList: React.FC = () => {

    // state: 검색 쿼리 상태 //
    const [searchQuery, setSearchQuery] = useState('');

    // state: 검색된 게임 상태 //
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);

    // state: 게임 리스트 상태 //
    const [gameData, setGameData] = useState<Game[]>([]);

    // state: 유저 정보 //
    const { loginUser } = useLoginUserStore();

    // state: 네비게이션 상태 //
    const navigation = useNavigation<GameListScreenNavigationProp>();

    // state: 다이얼로그 상태 //
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    // state: 추가할 게임 이미지 상태 //
    const [newGameImage, setNewGameImage] = useState<string | null>(null);

    // state: 추가할 게임 이미지 저장 상태 //
    const [newGameImageFile, setNewGameImageFile] = useState<any>(null);

    // state: 추가할 게임 타이틀 상태 //
    const [newGameTitle, setNewGameTitle] = useState('');

    // state: 추가할 게임 설명 상태 //
    const [newGameDescription, setNewGameDescription] = useState('');

    // state: 추가할 게임 요금 등급 상태 //
    const [newAmountLevel, setNewAmountLevel] = useState('');

    // function: post game response 처리 함수 //
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

    // function: get game list response 처리 함수 //
    const getGameListResponse =(responseBody: GetGameListResponseDto | ResponseDto | null)=>{
        if (!responseBody) return;
        const {code} = responseBody;
        if (code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
        if (code !== 'SU') return;
        
        const { gameList } = responseBody as GetGameListResponseDto;
        setGameData(gameList);
        setFilteredGames(gameList)
    }

    // event handler: 검색 이벤트 처리 //
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredGames(gameData);
        } else {
            const filtered = gameData.filter(game =>
            game.title.toLowerCase().includes(query.toLowerCase()) ||
            game.description.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredGames(filtered);
        }
    };

    // event handler: 게임 리스트 클릭 이벤트 처리 //
    const handleCardPress = (game: Game) => {
        navigation.navigate('ServerMaking', {game});
    };

    // event handler: 게임 리스트 카드 출력 이벤트 처리 //
    const renderGameCard = ({ item }: { item: Game }) => {
        const imageUrl = item.gameImage.replace('localhost', '10.0.2.2'); // Android 에뮬레이터용
        // const imageUrl = item.gameImage.replace('localhost', '127.0.0.1'); // iOS 시뮬레이터용
        // console.log('Game Image URL: ', imageUrl);
        return (
            <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.card}>
                <Image 
                    source={{uri: imageUrl}} 
                    style={styles.gameImage} 
                    onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
                />
                <View style={styles.gameInfo}>
                    <Text style={styles.gameName}>{item.title}</Text>
                    <Text style={styles.genre}>{item.description}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    // event handler: 게임 추가 버튼 클릭 이벤트 처리 //
    const handleAddGame = () => {
        setIsDialogVisible(true);
    };

    // event handler: 이미지 업로드 버튼 클릭 이벤트 처리 //
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

    // event handler: 게임 저장 버튼 클릭 이벤트 처리 //
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
            const amountLevel = newAmountLevel;
            const requestBody: PostGameRequestDto = {
                title, description, gameImage, amountLevel
            }

            // console.log('New game:', { image: imageUrl, title: newGameTitle, description: newGameDescription });
            postGameRequest(requestBody).then(postGameResponse);

        } catch (error) {
            console.error('Error saving game:', error);
            Alert.alert('Error', 'Failed to save game');
        }
    };

    // effect: 첫 마운트 시 실행될 함수 //
    useEffect(()=>{
        getGameListRequest().then(getGameListResponse);
    },[])

    // render: gameList 렌더링 //
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
                        <Text style={styles.label}>Price Grade</Text>
                        <Picker
                            selectedValue={newAmountLevel}
                            style={styles.picker}
                            onValueChange={(itemValue) => setNewAmountLevel(itemValue)}
                            >
                            <Picker.Item label="N" value="N" />
                            <Picker.Item label="A" value="A" />
                            <Picker.Item label="B" value="B" />
                            <Picker.Item label="C" value="C" />
                            <Picker.Item label="D" value="D" />
                        </Picker>
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
    label: {
        fontSize: 16,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    picker: {
        width: '100%',
        height: 50,
        marginBottom: 10,
    },
});

export default GameList;
