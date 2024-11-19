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
  // state: 페이지 상태 //
  const [view, setView] = useState<'profile' | 'change'>('profile');

  // event handler: 뒤로가기 버튼 클릭 이벤트 처리 //
  const handleGoBack = () => {
    navigation.goBack();
  };

  // localhost 주소를 10.0.2.2로 변환하는 함수
  const getProfileImageUri = (uri: string | null | undefined) => {
    if (!uri) return 'http://10.0.2.2:4000/file/e2c53a1e-1519-4a78-b779-0d45b91cff29.jpeg'; // 기본 이미지
    return uri.replace('localhost', '10.0.2.2'); // localhost를 10.0.2.2로 변환
  };

  const ProfileInformation =()=>{

    // event handler: 로그아웃 버튼 클릭 이벤트 처리 //
    const handleLogout = async () => {
      try {
        await logout();
        navigation.navigate('Main');
      } catch (error) {
        Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
      }
    };

    // event handler: 로그아웃 버튼 클릭 이벤트 처리 //
    const handleChange = async () => {
      try {
        setView('change');
      } catch (error) {
        Alert.alert('에러', '예상치못한 에러가 발생하였습니다. 다시 시도해주세요');
      }
    };

    // event handler: 로그아웃 버튼 클릭 이벤트 처리 //
    const handleWithdrawal = async () => {
      try {
        console.log("회원 탈퇴");
        navigation.navigate('Main');
      } catch (error) {
        Alert.alert('에러', '예상치못한 에러가 발생하였습니다. 다시 시도해주세요');
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
        <Image
            source={{ uri: getProfileImageUri(loginUser?.profileImage) }}
            style={styles.profileImage}
            resizeMode='cover'
          />
          <Text style={styles.infoText}>ID: {loginUser?.id}</Text>
          <Text style={styles.infoText}>Email: {loginUser?.email}</Text>
          {/* ROLE_ADMIN인 경우에만 role 정보를 표시 */}
          {loginUser?.role === 'ROLE_ADMIN' && (
            <Text style={styles.infoText}>Role: admin</Text>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          {/* 정보 수정 버튼 */}
          <TouchableOpacity style={styles.button} onPress={handleChange}>
            <Text style={styles.buttonText}>정보 수정</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>로그아웃</Text>
          </TouchableOpacity>
  
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity style={styles.button} onPress={handleGoBack}>
            <Text style={styles.buttonText}>뒤로가기</Text>
          </TouchableOpacity>
  
          {/* 회원탈퇴 버튼 */}
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleWithdrawal}>
            <Text style={styles.buttonText}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const ChangeProfileInformation =()=>{
    return (
      <View style={styles.container}>
        <Text>변경</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
            {view === 'profile' && <ProfileInformation />}
            {view === 'change' && <ChangeProfileInformation />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
        width: '100%',
        paddingVertical: 20,
        justifyContent: 'center',
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
    marginTop: 10, // 간격을 줄임
    fontSize: 16, // 글자 크기 약간 줄임
    marginBottom: 5,
  },
  
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center', // 버튼들을 가운데 정렬
  },
  
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 12, // 세로 패딩을 적당히 설정
    width: '90%', // 가로 길이를 화면의 약간 덜 차도록 설정
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
   },
  
   buttonText:{
     color:'#ffffff',
     fontSize: 16,
     fontWeight:'bold'
   },

   deleteButton:{
     backgroundColor:'#ff1744'
   }
});

export default MyProfile;