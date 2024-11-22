import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/Auth';
import useLoginUserStore from '../../stores/login-user.store';
import { checkCertificationForChangeRequest, checkCertificationRequest, emailCertificationForChangeRequest, emailCertificationRequest, fileUploadRequest, getUserRequest, isPasswordRightRequest, patchEmailRequest, patchPasswordRequest, patchProfileImageRequest } from '../../apis';
import { ResponseBody, ResponseCode } from '../../types/enum';
import { CheckCertificationForChangeResponseDto, EmailCertificationForChangeResponseDto, IsPasswordRightResponseDto, PatchEmailResponseDto, PatchPasswordResponseDto, PatchProfileImageResponseDto } from '../../apis/response/user';
import { ResponseDto } from '../../apis/response';
import {MediaType, launchImageLibrary} from 'react-native-image-picker';
import { User } from '../../types/interface';
import { CheckCertificationRequestDto, EmailCertificationRequestDto } from '../../apis/request/auth';
import { CheckCertificationResponseDto, EmailCertificationResponseDto } from '../../apis/response/auth';
import { CheckCertificationForChangeRequestDto, EmailCertificationForChangeRequestDto } from '../../apis/request/user';

type RootStackParamList = {
  Main: undefined;
  MyProfile: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyProfile'>;

const MyProfile: React.FC = () =>  {

  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { logout, getAccessToken } = useAuth();
  const { loginUser, setLoginUser } = useLoginUserStore();
  // state: 페이지 상태 //
  const [view, setView] = useState<'profile' | 'change' | 'password'>('profile');

  const [myProfileImage, setMyProfileImage] = useState<string|null>("");
  const [myEmail, setMyEmail] = useState<string>("");
  const [myId, setMyId] = useState<string>("");
  const [myRole, setMyRole] = useState<string>("");


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
        setView('password');
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

    useEffect(() => {
      if(loginUser != null){
        setMyId(loginUser?.id);
        setMyEmail(loginUser?.email);
        setMyProfileImage(loginUser?.profileImage);
        setMyRole(loginUser?.role);
      }
      
    }, [loginUser]);

    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
        <Image
            source={{ uri: getProfileImageUri(myProfileImage) }}
            style={styles.profileImage}
            resizeMode='cover'
          />
          <Text style={styles.infoText}>ID: {myId}</Text>
          <Text style={styles.infoText}>Email: {myEmail}</Text>
          {/* ROLE_ADMIN인 경우에만 role 정보를 표시 */}
          {myRole === 'ROLE_ADMIN' && (
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

  const CheckPassword = () => {
    const [password, setPassword] = useState('');
  
    const isPasswordRightResponse = (responseBody: IsPasswordRightResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
      if (code === 'PF') Alert.alert('패스워드가 일치하지 않습니다');
      if (code !== 'SU') return;
  
      setView('change');
    };
  
    const handlePasswordCheck = async () => {
      if (!password) {
        Alert.alert('오류', '비밀번호를 입력해주세요.');
        return;
      }
  
      const requestBody = { password };
      const accessToken = await getAccessToken();
      if (accessToken == null) {
        Alert.alert('오류', '인증 문제입니다. 다시 시도해주세요');
        return;
      }
      isPasswordRightRequest(requestBody, accessToken).then(isPasswordRightResponse);
    };
  
    return (
      <View style={styles.passwordContainer}>
        <Text style={styles.passwordLabel}>비밀번호를 입력하세요</Text>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry
          placeholder="비밀번호"
          placeholderTextColor="#aaa" // 흰색 배경에서 잘 보이도록 회색 텍스트
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.passwordButton} onPress={handlePasswordCheck}>
          <Text style={styles.passwordButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ChangeProfileInformation = () => {
    // state: 추가할 게임 이미지 상태 //
    const [newProfileImage, setNewProfileImage] = useState<string | null>(null);

    // state: 추가할 게임 이미지 저장 상태 //
    const [myNewProfileImageFile, setMyNewProfileImageFile] = useState<any>(null);

    // state: 이메일 상태 //
    const [newEmail, setNewEmail] = useState<string>('');

    // state: 이메일 체크 상태 //
    const [isEmailCheck, setEmailCheck] = useState<boolean>(false);

    // state: 이메일 에러 상태 //
    const [isEmailError, setEmailError] = useState<boolean>(false);

    // state: 이메일 인증 번호 상태 //
    const [certificationNumber, setCertificationNumber] = useState<string>('');

    // state: 이메일 인증 번호 확인 상태 //
    const [isCertificationNumberCheck, setIsCertificationNumberCheck] = useState<boolean>(false);

    // state: 이메일 확인 넘버 에러 상태 //
    const [isCertificationNumberError, setIsCertificationNumberError] = useState<boolean>(false);

    
    const [myPassword, setMyPassword] = useState<string>('');

    const [myNewPassword, setMyNewPassword] = useState<string>('');

    // function: email certification response 처리 함수 //
    const emailCertificationForChangeResponse = (responseBody: ResponseBody<EmailCertificationForChangeResponseDto>) => {
      if(!responseBody) return;
      const {code} = responseBody;

      if(code === ResponseCode.VALIDATION_FAILED) Alert.alert('이메일을 다시 확인해주세요.');
      if(code === ResponseCode.MAIL_FAIL) Alert.alert('이메일 전송에 실패했습니다.');
      if(code === ResponseCode.DATABASE_ERROR) Alert.alert('데이터베이스 오류입니다.');
      if(code !== ResponseCode.SUCCESS){
          setEmailCheck(false);
          return;
      } 

      setEmailError(false);
      setEmailCheck(true);
      Alert.alert("인증번호가 전송되었습니다.");
  }

    // function: post game response 처리 함수 //
    const patchProfileImageResponse =(responseBody : PatchProfileImageResponseDto | ResponseDto | null) => {
      
      if(!responseBody) return;
      const {code} = responseBody;
      if(code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
      if(code !== 'SU') return;

      const newLoginUser : User = {
        id : myId,
        email: myEmail,
        profileImage: newProfileImage,
        role: myRole
      }
      setLoginUser(newLoginUser);
      // Reset form
      setNewProfileImage(null);
      setMyNewProfileImageFile(null);

      Alert.alert('성공', '이미지가 성공적으로 저장되었습니다.');
  }

  const patchEmailResponse =(responseBody : PatchEmailResponseDto | ResponseDto | null) => {
      
    if(!responseBody) return;
    const {code} = responseBody;
    if(code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
    if(code !== 'SU') return;

    const newLoginUser : User = {
      id : myId,
      email: newEmail,
      profileImage: myProfileImage,
      role: myRole
    }
    setLoginUser(newLoginUser);
    // Reset form
    setNewEmail("");

    Alert.alert('성공', '이메일이 성공적으로 수정되었습니다.');
}

  // function: check certification response 처리 함수 //
  const checkCertificationForChangeResponse = (responseBody: ResponseBody<CheckCertificationForChangeResponseDto>) => {
    if(!responseBody) return;
    const {code} = responseBody;

    if(code === ResponseCode.VALIDATION_FAILED) Alert.alert('이메일을 다시 확인해주세요.');
    if(code === ResponseCode.CERTIFICATION_FAIL){
        setIsCertificationNumberError(true);
        Alert.alert("인증번호가 일치하지 않습니다.");
        setIsCertificationNumberCheck(false);
    }

    if(code === ResponseCode.DATABASE_ERROR) Alert.alert('데이터베이스 오류입니다.');
    if(code !== ResponseCode.SUCCESS) return;

    setIsCertificationNumberError(false);
    Alert.alert("인증번호가 확인되었습니다.");
    setIsCertificationNumberCheck(true);
}

  const isPasswordRightResponse = async (responseBody: IsPasswordRightResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
    if (code === 'PF') Alert.alert('패스워드가 일치하지 않습니다');
    if (code !== 'SU') return;

    const requestBody = {
      password : myNewPassword
    }
    const accessToken = await getAccessToken();
        if(!accessToken){
          Alert.alert('오류', '유저 정보를 가져오지 못했습니다. 다시 시도해주세요');
          return;
        }

    patchPasswordRequest(requestBody, accessToken).then(patchPasswordResponse)
  };

  const patchPasswordResponse = (responseBody: PatchPasswordResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === 'DBE') Alert.alert('데이터베이스 오류입니다.');
    if (code !== 'SU') return;

    Alert.alert("비밀번호가 성공적으로 저장되었습니다.");
  }

  const handleClickSaveImage = async () => {
    if (!myNewProfileImageFile) {
      Alert.alert('Error', '타이틀, 설명, 이미지를 모두 작성해주세요');
      return;
    }
  
    // 선택한 이미지를 먼저 UI에 반영
    setNewProfileImage(myNewProfileImageFile.uri);
  
    const formData = new FormData();
    formData.append('file', {
      uri: myNewProfileImageFile.uri,
      type: myNewProfileImageFile.type,
      name: myNewProfileImageFile.fileName,
    });
  
    try {
      const imageUrl = await fileUploadRequest(formData);
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }
  
      const profileImage = imageUrl;
      const requestBody = { profileImage };

      const accessToken = await getAccessToken();
        if(!accessToken){
          Alert.alert('오류', '유저 정보를 가져오지 못했습니다. 다시 시도해주세요');
          return;
        }
  
        setMyProfileImage(profileImage);

      // 서버 요청 후 상태 갱신
      patchProfileImageRequest(requestBody, accessToken).then(patchProfileImageResponse);
    } catch (error) {
      console.error('Error saving game:', error);
      Alert.alert('Error', 'Failed to save game');
    }
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
              console.log(response.assets[0])
              setNewProfileImage(source.uri as string);
              setMyNewProfileImageFile(response.assets[0]);
          }
      });
  }; 
  
    // 이메일 인증 코드 전송
    const onCertificationEmailButtonClickHandler = async () => {
      const emailPattern = /^[a-zA-Z0-9]*@([-,]?[a-zA-Z0-9])*\.[a-zA-z]{2,4}$/;

            const checkedEmail = emailPattern.test(newEmail);
            if(!checkedEmail){
                setEmailError(true);
                Alert.alert("이메일 형식이 잘못되었습니다");
                return;
            }

            const accessToken = await getAccessToken();
            if(!accessToken){
              Alert.alert('오류', '유저 정보를 가져오지 못했습니다. 다시 시도해주세요');
              return;
            }
            
            const requestBody: EmailCertificationForChangeRequestDto = {email: newEmail};
            console.log(requestBody);
            emailCertificationForChangeRequest(requestBody, accessToken).then(emailCertificationForChangeResponse);
    };
  
    // 이메일 인증 코드 확인
    const onCertificationNumberButtonClickHandler = async () => {
      const accessToken = await getAccessToken();
            if(!accessToken){
              Alert.alert('오류', '유저 정보를 가져오지 못했습니다. 다시 시도해주세요');
              return;
            }

      const requestBody: CheckCertificationForChangeRequestDto = {email: newEmail, certificationNumber};
            checkCertificationForChangeRequest(requestBody, accessToken).then(checkCertificationForChangeResponse);
    };
  
    // 이메일 변경
    const handleChangeEmail = async () => {
      const requestBody = {
        email : newEmail
      }
      const accessToken = await getAccessToken();
        if(!accessToken){
          Alert.alert('오류', '유저 정보를 가져오지 못했습니다. 다시 시도해주세요');
          return;
        }
      patchEmailRequest(requestBody, accessToken).then(patchEmailResponse);
    };
  
    // 비밀번호 변경
    const handleChangePassword = async () => {

      const requestBody = {
        password: myPassword
      }
      const accessToken = await getAccessToken();
        if(!accessToken){
          Alert.alert('오류', '유저 정보를 가져오지 못했습니다. 다시 시도해주세요');
          return;
        }
      isPasswordRightRequest(requestBody, accessToken).then(isPasswordRightResponse)
    };
  
    return (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        
        {/* 프로필 사진 변경 */}
        <View style={styles.section}>
          <Text style={styles.label}>프로필 사진</Text>
          <TouchableOpacity onPress={handleImageUpload}>
          <Image 
              source={{ uri: getProfileImageUri(newProfileImage != null ? newProfileImage : myProfileImage) }} 
              style={styles.profileImage} 
              resizeMode="cover" 
          />
          </TouchableOpacity>
          <Text style={styles.info}>사진을 클릭하여 변경하세요.</Text>
          <TouchableOpacity style={styles.button} onPress={handleClickSaveImage}>
            <Text style={styles.buttonText}>사진 변경</Text>
          </TouchableOpacity>
        </View>
  
        {/* 이메일 변경 */}
        <View style={styles.section}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="새 이메일"
            value={newEmail}
            onChangeText={(text) => setNewEmail(text)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.button} onPress={onCertificationEmailButtonClickHandler}>
            <Text style={styles.buttonText}>인증 코드 전송</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="인증 코드"
            value={certificationNumber}
            onChangeText={(text) => setCertificationNumber(text)}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={onCertificationNumberButtonClickHandler}>
            <Text style={styles.buttonText}>코드 확인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isCertificationNumberCheck ? styles.activeButton : styles.disabledButton]}
            disabled={!isCertificationNumberCheck}
            onPress={handleChangeEmail}
          >
            <Text style={styles.buttonText}>이메일 변경</Text>
          </TouchableOpacity>
        </View>
  
        {/* 비밀번호 변경 */}
        <View style={styles.section}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="현재 비밀번호"
            value={myPassword}
            onChangeText={setMyPassword}
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="새 비밀번호"
            value={myNewPassword}
            onChangeText={setMyNewPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>비밀번호 변경</Text>
          </TouchableOpacity>
        </View>
        
      </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
            {view === 'profile' && <ProfileInformation />}
            {view === 'password' && <CheckPassword />}
            {view === 'change' && <ChangeProfileInformation />}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
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
  },

  passwordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200ea', // 보라색 배경
    paddingHorizontal: 20,
  },
  passwordLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff', // 흰색 텍스트
    marginBottom: 20,
  },
  passwordInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff', // 흰색 입력창
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  passwordButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3700b3', // 버튼 색상 (보라색 계열)
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordButtonText: {
    color: '#ffffff', // 버튼 텍스트 색상
    fontSize: 16,
    fontWeight: 'bold',
  },

  section: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    width: '90%'
  },
  // 활성화된 버튼 스타일
  activeButton: {
    backgroundColor: '#3700b3', // 짙은 보라색 (활성화 상태)
  },

  // 비활성화된 버튼 스타일
  disabledButton: {
    backgroundColor: '#ccc', // 회색 (비활성화 상태)
    opacity: 0.6, // 약간 투명하게
  },
  info: {
    fontSize: 12, // 작은 글씨 크기
    color: '#888', // 중립적인 회색
    textAlign: 'center', // 중앙 정렬
    marginTop: 5, // 위 요소와 간격
    marginBottom: 5, // 아래 요소와 간격
  },
});

export default MyProfile;