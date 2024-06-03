import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Game } from '../../types/Game'; // 게임 타입을 가져옵니다.
import { gameData } from '../../mocks'; // 게임 목록 데이터를 가져옵니다.
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
    GameList: undefined;
    ServerMaking: {game: Game};
};

type GameListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameList'>;

const GameList: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>(''); // 검색어 상태를 초기화합니다.
    const [filteredGames, setFilteredGames] = useState<Game[]>(gameData); // 필터링된 게임 목록 상태를 초기화합니다.
    const navigation = useNavigation<GameListScreenNavigationProp>();

    // 검색어가 변경될 때마다 호출되는 함수입니다.
    const handleSearch = (query: string) => {
        const filtered = gameData.filter(game =>
            game.gameName.toLowerCase().includes(query.toLowerCase()) // 게임 이름에서 검색어를 포함하는 게임을 찾습니다.
        );
        setFilteredGames(filtered); // 필터링된 게임 목록을 업데이트합니다.
        setSearchQuery(query); // 검색어를 업데이트합니다.
    };

    const handleCardPress = (game: Game) => {
        navigation.navigate('ServerMaking', {game});
    };

    const renderGameCard = ({ item }: { item: Game }) => (
        <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.card}>
            <Image source={item.gameImage} style={styles.gameImage} />
            <View style={styles.gameInfo}>
                <Text style={styles.gameName}>{item.gameName}</Text>
                <Text style={styles.genre}>{item.genre}</Text>
            </View>
        </TouchableOpacity>
    );

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
                keyExtractor={item => item.id.toString()}
            />
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
});

export default GameList;
