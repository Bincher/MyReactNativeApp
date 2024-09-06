import React, { ChangeEvent, useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image, Pressable, SafeAreaView, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import  * as KakaoLogin from '@react-native-seoul/kakao-login';
import SignInResponseDto from '../../apis/response/auth/sign-in-response.dto';
import ResponseDto from '../../apis/response/response.dto';
import { CheckCertificationRequestDto, EmailCertificationRequestDto, IdCheckRequestDto, SignInRequestDto, SignUpRequestDto } from '../../apis/request/auth';
import { signUpRequest, signInRequest, idCheckRequest, emailCertificationRequest, checkCertificationRequest } from '../../apis';
import { CheckCertificationResponseDto, EmailCertificationResponseDto, IdCheckResponseDto, SignUpResponseDto } from '../../apis/response/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResponseBody, ResponseCode } from '../../types/enum';

type RootStackParamList = {
    Login: undefined;
    Main: undefined;
    Signup: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');
    

    const login = () => {
        KakaoLogin.login().then((result) => {
            console.log("Login Success", JSON.stringify(result));
            navigation.replace('Main');
        }).catch((error) => {
            if (error.code === 'E_CANCELLED_OPERATION') {
                console.log("Login Cancel", error.message);
            } else {
                console.log(`Login Fail(code:${error.code})`, error.message);
            }
        });
    };

    const handleBack = () => {
        navigation.navigate('Main');
    };

    const SignInCard =()=>{

        // state: 아이디 상태 //
        const [id, setId] = useState<string>('');

        // state: 패스워드 상태 //
        const [password, setPassword] = useState<string>('');

        // state: 패스워드 타입 상태 //
        const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
        
        // state: 에러 상태 //
        const [error, setError] = useState<boolean>(false);

        // function: sign in response 처리 함수 //
        const signInResponse = async (responseBody: SignInResponseDto | ResponseDto | null)=>{

            if(!responseBody){
                Alert.alert('네트워크 이상입니다.');
                return;
            }
            const{code} = responseBody;
            if(code === 'DBE')Alert.alert('데이터베이스 오류입니다.');
            if(code === 'SF' || code === 'VF') setError(true);
            if(code !== 'SU') return;
    
            const {token} = responseBody as SignInResponseDto;

            try {
                await AsyncStorage.setItem('accessToken', token);

                navigation.replace('Main');  // 로그인 후 Main 화면으로 이동
            } catch (e) {
                console.log('Failed to save the token', e);
            }
        }

        // event handler: 로그인 버튼 클릭 이벤트 처리 //
        const onSignInButtonClickHandler =()=>{
            if(!id || !password){
                Alert.alert("아이디와 비밀번호를 모두 입력하세요.");
                return;
            }

            const requestBody: SignInRequestDto = {
                id, password
            }
            signInRequest(requestBody).then(signInResponse);
        }
    
        // event handler: 회원가입 링크 클릭 이벤트 처리 //
        const onSignUpButtonClickHandler=()=>{
            setView('sign-up');
        }
    
        return (
            <View style={styles.signInContainer}>
                <Text style={styles.signInTitle}>로그인</Text>
                <View style={styles.socialLoginContainer}>
                    <TouchableOpacity
                        style={styles.kakaoLoginButton}
                        onPress={login}
                    >
                        <Text style={styles.kakaoLoginButtonText}>카카오 로그인</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.signInInputContainer}>
                    <TextInput
                        style={[styles.input, error && styles.errorInput]}
                        placeholder="아이디"
                        value={id}
                        onChangeText={(text) => setId(text)}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={[styles.input, error && styles.errorInput]}
                        placeholder="비밀번호"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry={passwordType === 'password'}
                    />
                    {error && 
                        <Text style={styles.errorText}>{'아이디 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요.'}</Text>
                    }
                </View>
                    <TouchableOpacity style={styles.button} onPress={onSignInButtonClickHandler}>
                        <Text style={styles.buttonText}>로그인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onSignUpButtonClickHandler}>
                        <Text style={styles.buttonText}>회원가입</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleBack}>
                        <Text style={styles.buttonText}>뒤로가기</Text>
                    </TouchableOpacity>
                </View>
        );
    }

    const SignUpCard =()=>{

        // state: 아이디 상태 //
        const [id, setId] = useState<string>('');

        // state: 아이디 에러 상태 //
        const [isIdError, setIdError] = useState<boolean>(false);


        // state: 아이디 중복 체크 상태 //
        const [isIdCheck, setIdCheck] = useState<boolean>(false);

        // state: 아이디 중복 체크 메세지 상태 //
        const [idCheckMessage, setIdCheckMessage] = useState('');


        // state: 이메일 상태 //
        const [email, setEmail] = useState<string>('');

        // state: 이메일 체크 상태 //
        const [isEmailCheck, setEmailCheck] = useState<boolean>(false);

        // state: 이메일 에러 상태 //
        const [isEmailError, setEmailError] = useState<boolean>(false);

        // state: 이메일 메세지 상태 //
        const [emailMessage, setEmailMessage] = useState<string>('');


        // state: 이메일 인증 번호 상태 //
        const [certificationNumber, setCertificationNumber] = useState<string>('');

        // state: 이메일 인증 번호 확인 상태 //
        const [isCertificationNumberCheck, setIsCertificationNumberCheck] = useState<boolean>(false);

        // state: 이메일 확인 넘버 에러 상태 //
        const [isCertificationNumberError, setIsCertificationNumberError] = useState<boolean>(false);

        // state: 이메일 확인 넘버 메세지 상태 //
        const [certificationNumberMessage, setCertificationNumberMessage] = useState<string>('');


        // state: 패스워드 상태 //
        const [password, setPassword] = useState<string>('');

        // state: 패스워드 에러 상태 //
        const [isPasswordError, setPasswordError] = useState<boolean>(false);

        // state: 패스워드 메세지 상태 //
        const [passwordMessage, setPasswordMessage] = useState<string>('');


        // state: 패스워드 확인 상태 //
        const [passwordCheck, setPasswordCheck] = useState<string>('');

        // state: 패스워드 확인 에러 상태 //
        const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);

        // state: 패스워드 확인 에러 메세지 상태 //
        const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');


        // state: 개인 정보 동의 에러 상태 //
        const [isAgreedPersonalError, setIsAgreedPersonalError] = useState<boolean>(false);

        // state: 개인 정보 동의 상태 //
        const [isAgreedPersonal, setIsAgreedPersonal] = useState<boolean>(false);


        // state: 이게 뭐였더라... //
        const [showTerms, setShowTerms] = useState(false);

        // function: id check response 처리 함수 //
        const idCheckResponse = (responseBody: ResponseBody<IdCheckResponseDto>) => {
            
            if(!responseBody) return;
            const {code} = responseBody;
            if (code === ResponseCode.VALIDATION_FAIL) {
                Alert.alert('아이디를 입력하세요.');}
            if (code === ResponseCode.DUPLICATE_ID){
                setIdError(true);
                setIdCheckMessage('이미 사용중인 아이디 입니다.');
                setIdCheck(false);
            }
            
            if(code === ResponseCode.DATABASE_ERROR) Alert.alert('데이터베이스 오류입니다.');
            if(code !== ResponseCode.SUCCESS) return;
            
            setIdError(false);
            setIdCheckMessage('사용 가능한 아이디 입니다.');
            setIdCheck(true);

        }

        // function: email certification response 처리 함수 //
        const emailCertificationResponse = (responseBody: ResponseBody<EmailCertificationResponseDto>) => {
            if(!responseBody) return;
            const {code} = responseBody;

            if(code === ResponseCode.VALIDATION_FAIL) Alert.alert('아이디와 이메일을 다시 확인해주세요.');
            if(code === ResponseCode.DUPLICATE_ID){
                setIdError(true);
                setIdCheckMessage('이미 사용중인 아이디 입니다.');
                setIdCheck(false);
            }

            if(code === ResponseCode.MAIL_FAIL) Alert.alert('이메일 전송에 실패했습니다.');
            if(code === ResponseCode.DATABASE_ERROR) Alert.alert('데이터베이스 오류입니다.');
            if(code !== ResponseCode.SUCCESS){
                setEmailCheck(false);
                return;
            } 

            setEmailError(false);
            setEmailCheck(true);
            setEmailMessage('인증번호가 전송되었습니다.');
        }

        // function: check certification response 처리 함수 //
        const checkCertificationResponse = (responseBody: ResponseBody<CheckCertificationResponseDto>) => {
            if(!responseBody) return;
            const {code} = responseBody;

            if(code === ResponseCode.VALIDATION_FAIL) Alert.alert('아이디와 이메일을 다시 확인해주세요.');
            if(code === ResponseCode.CERTIFICATION_FAIL){
                setIsCertificationNumberError(true);
                setCertificationNumberMessage('인증번호가 일치하지 않습니다');
                setIsCertificationNumberCheck(false);
            }

            if(code === ResponseCode.DATABASE_ERROR) Alert.alert('데이터베이스 오류입니다.');
            if(code !== ResponseCode.SUCCESS) return;

            setIsCertificationNumberError(false);
            setCertificationNumberMessage('인증번호가 확인되었습니다.')
            setIsCertificationNumberCheck(true);
        }

        // function: sign up response 처리 함수 //
        const signUpResponse = (responseBody: SignUpResponseDto | ResponseDto | null) => {

            if(!responseBody){
                Alert.alert("네트워크 이상입니다.");
                return;
            } 
            const{code} = responseBody;

            if(code === ResponseCode.VALIDATION_FAIL) Alert.alert('아이디, 이메일, 인증번호를 모두 입력하세요.');
            if(code === ResponseCode.CERTIFICATION_FAIL) {
                setIsCertificationNumberError(true);
                setCertificationNumberMessage('인증번호가 일치하지 않습니다.');
                setIsCertificationNumberCheck(false);
            }
            if(code === ResponseCode.DUPLICATE_ID){
                setIdError(true);
                setIdCheckMessage("중복되는 아이디 입니다.");
                setIdCheck(false);
            }
            if(code === ResponseCode.DATABASE_ERROR) Alert.alert("데이터베이스 오류입니다.");
            
            if(code !== "SU")return;
    
            setView('sign-in');
            Alert.alert('회원가입이 완료되었습니다.\n로그인하여 주십시오.');
        }


        // event handler: 로그인 링크 클릭 이벤트 처리 //
        const onSignInLinkClickHandler =()=>{
            setView('sign-in');
        }

        // event handler: 아이디 중복 확인 버튼 클릭 이벤트 처리 //
        const onIdDuplicateButtonHandler = () => {
            
            const requestBody: IdCheckRequestDto = {id};
            idCheckRequest(requestBody).then(idCheckResponse);
        };
    
        // event handler: 이메일 인증 번호 전송 버튼 클릭 이벤트 처리 //
        const onCertificationEmailButtonClickHandler = () => {
            const emailPattern = /^[a-zA-Z0-9]*@([-,]?[a-zA-Z0-9])*\.[a-zA-z]{2,4}$/;
            console.log(email);

            const checkedEmail = emailPattern.test(email);
            if(!checkedEmail){
                setEmailError(true);
                setEmailMessage('이메일 형식이 아닙니다.');
                return;
            }

            const requestBody: EmailCertificationRequestDto = {id, email};
            emailCertificationRequest(requestBody).then(emailCertificationResponse);
        };
    
        // event handler: 이메일 인증 번호 확인 버튼 클릭 이벤트 처리 //
        const onCertificationNumberButtonClickHandler = () => {
            
            const requestBody: CheckCertificationRequestDto = {id, email, certificationNumber};
            checkCertificationRequest(requestBody).then(checkCertificationResponse);
        };

        // event handler: 로그인 버튼 클릭 이벤트 처리 //
        const onSignUpButtonClickHandler=()=>{

            const emailPattern = /^[a-zA-Z0-9]*@([-,]?[a-zA-Z0-9])*\.[a-zA-z]{2,4}$/;

            if(!isIdCheck){
                Alert.alert('아이디 중복체크를 다시 눌려주세요.');
                return;
            }
            if(!isEmailCheck){
                Alert.alert('인증 코드를 다시 받아주세요.');
                return;
            }
            if(!isCertificationNumberCheck){
                Alert.alert('이메일 인증 코드를 다시 확인하세요.')
                return;
            }
    
            const isEmailPattern = emailPattern.test(email);
            if(!isEmailPattern){
                setEmailError(true);
                setEmailMessage('이메일 주소 포맷이 맞지 않습니다.');
            }
    
            const isCheckedPassword = password.trim().length >= 8;
            if(!isCheckedPassword){
                setPasswordError(true);
                setPasswordMessage('비밀번호를 8자 이상으로 설정해야합니다.');
            }
    
            const isEqualPassword = password === passwordCheck;
            if(!isEqualPassword){
                setPasswordCheckError(true);
                setPasswordCheckMessage('비밀번호가 일치하지 않습니다');
            }
    
            if(!isEmailPattern || !isCheckedPassword || !isEqualPassword) return;

            if(!isAgreedPersonal){
                setIsAgreedPersonalError(true);
                Alert.alert('약관 동의를 하셔야합니다.');
                return;
            }

            const requestBody: SignUpRequestDto = {
                id, email, password, certificationNumber, agreedPersonal: isAgreedPersonal
            }
    
            signUpRequest(requestBody).then(signUpResponse);
        }

        
        return (
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.signInContainer}>
                    <Text style={styles.signInTitle}>회원가입</Text>
                    <View style={styles.signUpInputContainer}>
                        <View style={styles.inputWithButton}>
                            <TextInput
                                style={[styles.input, styles.inputWithButtonStyle, isIdError && styles.errorInput]}
                                placeholder="아이디"
                                value={id}
                                onChangeText={(text) => setId(text)}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity style={styles.inputButton} onPress={onIdDuplicateButtonHandler}>
                                <Text style={styles.inputButtonText}>중복체크</Text>
                            </TouchableOpacity>
                        </View>
                        {idCheckMessage !== '' && (
                            <Text style={[styles.errorText, !isIdError && styles.successText]}>
                                {idCheckMessage}
                            </Text>
                        )}
                        <View style={styles.inputWithButton}>
                            <TextInput
                                style={[styles.input, styles.inputWithButtonStyle]}
                                placeholder="이메일"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                autoCapitalize="none"
                                autoComplete="email"
                                keyboardType="email-address"
                            />
                            <TouchableOpacity style={styles.inputButton} onPress={onCertificationEmailButtonClickHandler}>
                                <Text style={styles.inputButtonText}>인증</Text>
                            </TouchableOpacity>
                        </View>
                        {emailMessage !== '' && (
                            <Text style={[styles.errorText, !isIdError && styles.successText]}>
                                {emailMessage}
                            </Text>
                        )}
        
                        <View style={styles.inputWithButton}>
                            <TextInput
                                style={[styles.input, styles.inputWithButtonStyle]}
                                value={certificationNumber}
                                placeholder="이메일 인증 코드"
                                onChangeText={(text) => setCertificationNumber(text)}
                                autoCapitalize="none"
                                keyboardType="numeric"
                            />
                            <TouchableOpacity style={styles.inputButton} onPress={onCertificationNumberButtonClickHandler}>
                                <Text style={styles.inputButtonText}>확인</Text>
                            </TouchableOpacity>
                        </View>
                        {certificationNumberMessage !== '' && (
                            <Text style={[styles.errorText, !isIdError && styles.successText]}>
                                {certificationNumberMessage}
                            </Text>
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder="비밀번호"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                        />
                        {isPasswordError ? <Text style={styles.errorText}>{passwordMessage}</Text> : null}
        
                        <TextInput
                            style={styles.input}
                            placeholder="비밀번호 확인"
                            value={passwordCheck}
                            onChangeText={(text) => setPasswordCheck(text)}
                            secureTextEntry
                        />
                        {isPasswordCheckError ? <Text style={styles.errorText}>{passwordCheckMessage}</Text> : null}
                    </View>
                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity onPress={() => setShowTerms(true)}>
                            <Text style={styles.checkboxLabel}>약관 동의</Text>
                        </TouchableOpacity>
                    </View>
        
                    <TouchableOpacity style={styles.button} onPress={onSignUpButtonClickHandler}>
                        <Text style={styles.buttonText}>회원가입</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setView('sign-in')}>
                        <Text style={styles.buttonText}>로그인으로 돌아가기</Text>
                    </TouchableOpacity>
        
                    <Modal visible={showTerms} animationType="slide" transparent={true}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>이용약관</Text>
                                <Text style={styles.modalText}>
                                    여기에 약관 내용을 넣으세요...
                                </Text>
                                <View style={styles.modalButtonContainer}>
                                    <TouchableOpacity 
                                        style={styles.modalButton} 
                                        onPress={() => {
                                            setIsAgreedPersonal(true);
                                            setShowTerms(false);
                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>동의</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.modalButton} 
                                        onPress={() => {
                                            setIsAgreedPersonal(false);
                                            setShowTerms(false);
                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>비동의</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        );
    }
    

    return (
        <View style={styles.mainContainer}>
            {view === 'sign-in' && <SignInCard />}
            {view === 'sign-up' && <SignUpCard />}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    mainContainer: {
        flex: 1,
        width: '100%',
        paddingVertical: 20,
        justifyContent: 'center',
        backgroundColor: '#6200ea',
    },
    signInContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20, // 좌우 여백 추가
        backgroundColor: '#6200ea',
    },
    signInTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#fff',
    },
    signInInputContainer: {
        width: '100%', // 가로폭을 부모 컨테이너에 맞게 조정
        marginBottom: 20, // 요소 간의 여백 추가
    },
    socialLoginContainer: {
        marginBottom: 20,
        width: '100%',
    },
    button: {
        width: '100%', // 버튼이 화면의 너비를 적절히 채우도록 설정
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#6200ea',
    },
    input: {
        width: '100%', // 입력창이 화면의 너비를 차지하도록 설정
        paddingVertical: 15, // 상하 패딩을 설정하여 입력창의 높이 조정
        paddingHorizontal: 15,
        fontSize: 16, // 글자 크기 조정
        color: '#6200ea',
        borderColor: '#ccc',
        borderWidth: 1,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        // 비밀번호 입력칸의 높이를 직접 설정
        height: 50, // 필요에 따라 조정
    },
    errorText: {
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabel: {
        marginLeft: 10,
        color: '#fff',
    },
    errorInput: {
        borderColor: 'red',
    },
    kakaoLoginButton:{
        width: '100%', // 버튼이 화면의 너비를 적절히 채우도록 설정
        backgroundColor: '#ff0',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 100,
        alignItems: 'center',
        marginVertical: 10,
    },
    kakaoLoginButtonText:{
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    signUpInputContainer:{
        width: '100%', // 가로폭을 부모 컨테이너에 맞게 조정
        marginBottom: 20, // 요소 간의 여백 추가
    },
    inputWithButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    inputWithButtonStyle: {
        flex: 1,
        marginRight: 10,
    },
    inputButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    inputButtonText: {
        color: '#6200ea',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalButton: {
        backgroundColor: '#6200ea',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    successText: {
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
      },
});


export default Login;
