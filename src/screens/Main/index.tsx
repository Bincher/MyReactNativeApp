import React from 'react';
import { Image } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Main = () => {
    const handleMenuPress = () => {
        console.log('Menu button pressed');
    };

    const handleMyPagePress = () => {
        console.log('MyPage button pressed');
    };

    const handleContentButtonPress = (buttonName: string) => {
        console.log(`${buttonName} button pressed`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleMenuPress} style={styles.button}>
                    <Icon name="menu" style={styles.buttonIcon} size={30} />
                </TouchableOpacity>
                <Text style={styles.appName}>App Name</Text>
                <TouchableOpacity onPress={handleMyPagePress} style={styles.button}>
                    <Icon name="manage-accounts" style={styles.buttonIcon} size={30} />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <TouchableOpacity onPress={() => handleContentButtonPress('Button 3')} style={styles.contentButton}>
                    <Image source={require('C:/dev/ReactNativeApp/MyReactNativeApp/src/assets/images/game_server.png')} style={styles.image} />
                    <Text style={styles.contentButtonText}>나의 서버</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleContentButtonPress('Button 4')} style={styles.contentButton}>
                    <Image source={require('C:/dev/ReactNativeApp/MyReactNativeApp/src/assets/images/game.png')} style={styles.image} />
                    <Text style={styles.contentButtonText}>나의 게임</Text>
                </TouchableOpacity>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => handleContentButtonPress('Button 1')} style={styles.rowButton}>
                        <Icon name="settings" style={styles.buttonIcon} size={70} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleContentButtonPress('Button 2')} style={styles.rowButton}>
                        <Icon name="headset-mic" style={styles.buttonIcon} size={70} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        backgroundColor: '#6200ea',
        height: 60,
    },
    button: {
        padding: 10,
    },
    buttonIcon: {
        color: '#ffffff',
    },
    appName: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center',
    },
    contentButton: {
        width: '80%',
        height: '30%',
        padding: 15,
        backgroundColor: '#6200ea',
        borderRadius: 8,
        marginVertical: 20,
        alignItems: 'center',
    },
    contentButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: '40%',
        paddingHorizontal: 35,
        marginTop: 10,
    },
    rowButton: {
        flex: 1,
        height: '50%',
        backgroundColor: '#6200ea',
        borderRadius: 8,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    }
});

export default Main;