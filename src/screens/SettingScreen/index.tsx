import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

const SettingScreen: React.FC = () => {

    return (
        <View style={styles.container}>

            <Text style={styles.noNotification}>세팅 페이지</Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    noNotification: {
        fontSize: 16,
        color: '#999',
    },
});

export default SettingScreen;