import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/Auth';
import useLoginUserStore from '../../stores/login-user.store';

// 미완성 //

type RootStackParamList = {
  Main: undefined;
  MyProfile: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyProfile'>;

const MyProfile: React.FC = () =>  {

  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { logout } = useAuth();
  const { loginUser } = useLoginUserStore();

  // event handler: 로그아웃 버튼 클릭 이벤트 처리 //
  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
    }
  };

  // event handler: 뒤로가기 버튼 클릭 이벤트 처리 //
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
          <Image
            source={{ uri: loginUser?.profileImage || 'http://10.0.2.2:4000/file/7b671d47-8d39-45cd-9bb5-0e5762f1ce29.jpg' }}
            style={styles.profileImage}
            resizeMode='cover'
          />
        <Text style={styles.infoText}>ID: {loginUser?.id}</Text>
        <Text style={styles.infoText}>Email: {loginUser?.email}</Text>
        <Text style={styles.infoText}>Role: {loginUser?.role}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>뒤로가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 10,
    borderColor: '#6200ea',
    borderWidth: 5,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    marginTop: 20,
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyProfile;