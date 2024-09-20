import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ResponseDto from '../../apis/response/Response.dto';
import { GetUserResponseDto } from '../../apis/response/user';
import { getUserRequest } from '../../apis';
import { useAuth } from '../../context/Auth';
import useLoginUserStore from '../../stores/login-user.store';


type RootStackParamList = {
  Main: undefined;
  MyProfile: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyProfile'>;

const MyProfile: React.FC = () =>  {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const { logout } = useAuth();

  const { loginUser } = useLoginUserStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // function: get user response 처리 함수 //
  const getUserResponse =(responseBody: GetUserResponseDto | ResponseDto | null)=>{
    if(!responseBody) return;
    const { code } = responseBody;
    if (code === 'NU') Alert.alert('존재하지 않는 유저입니다.');
    if (code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
    if (code !== 'SU'){
      return;
    }

    //const {email, id, profileImage} = responseBody as GetUserResponseDto;
  }

  // // effect: email path variable 변경시 실행 할 함수 //
  // useEffect(()=>{
  //   getUserRequest(userEmail).then(getUserResponse);

  // },[userEmail])



  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
          <Image
            source={{ uri: loginUser?.profileImage || 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250' }}
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