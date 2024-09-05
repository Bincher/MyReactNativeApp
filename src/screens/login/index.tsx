import React, { ChangeEvent, useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image, Pressable, SafeAreaView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import  * as KakaoLogin from '@react-native-seoul/kakao-login';
import SignInResponseDto from '../../apis/response/auth/sign-in-response.dto';
import ResponseDto from '../../apis/response/response.dto';
import { SignInRequestDto, SignUpRequestDto } from '../../apis/request/auth';
import { signUpRequest, signInRequest } from '../../apis';
import { SignUpResponseDto } from '../../apis/response/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
    Login: undefined;
    Main: undefined;
    Signup: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
        // state: 아이디 요소 참조 상태 //
        const idRef = useRef<HTMLInputElement | null>(null);

        // state: 이메일 요소 참조 상태 //
        const emailRef = useRef<HTMLInputElement | null>(null);

        // state: 패스워드 요소 참조 상태 //
        const passwordRef = useRef<HTMLInputElement | null>(null);
        
        // state: 패스워드 확인 요소 참조 상태 //
        const passwordCheckRef = useRef<HTMLInputElement | null>(null);

        // state: 아이디 상태 //
        const [id, setId] = useState<string>('');

        // state: 아이디 상태 //
        const [emailCertification, setEmailSertification] = useState<string>('');

        // state: 이메일 상태 //
        const [email, setEmail] = useState<string>('');

        // state: 패스워드 상태 //
        const [password, setPassword] = useState<string>('');

        // state: 패스워드 확인 상태 //
        const [passwordCheck, setPasswordCheck] = useState<string>('');

        // state: 개인 정보 동의 상태 //
        const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);

        // state: 패스워드 타입 상태 //
        const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');

        // state: 패스워드 체크 타입 상태 //
        const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password');

        // state: 아이디 에러 상태 //
        const [isIdError, setIdError] = useState<boolean>(false);

        // state: 이메일 에러 상태 //
        const [isEmailError, setEmailError] = useState<boolean>(false);

        // state: 패스워드 에러 상태 //
        const [isPasswordError, setPasswordError] = useState<boolean>(false);

        // state: 패스워드 확인 에러 상태 //
        const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);

        // state: 개인 정보 동의 에러 상태 //
        const [isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false);

        // state: 아이디 에러 메세지 상태 //
        const [idErrorMessage, setIdErrorMessage] = useState<string>('');

        // state: 이메일 에러 메세지 상태 //
        const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');

        // state: 패스워드 에러 메세지 상태 //
        const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');

        // state: 패스워드 확인 에러 메세지 상태 //
        const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');

        const [showTerms, setShowTerms] = useState(false);

        // function: sign up response 처리 함수 //
        const signUpResponse = (responseBody: SignUpResponseDto | ResponseDto | null) => {
            if(!responseBody){
            Alert.alert("네트워크 이상입니다.");
            return;
            } 
            const{code} = responseBody;
    
            if(code === "DE"){
                setEmailError(true);
                setEmailErrorMessage("중복되는 이메일 주소입니다.");
            }
            if(code === "VF"){
                Alert.alert("모든 값을 입력하세요.");
            }
            if(code === "DBE"){
                Alert.alert("데이터베이스 오류입니다.");
            }
    
            if(code !== "SU")return;
    
            setView('sign-in');
        }

        // event handler: 이메일 변경 이벤트 처리 //
        const onIdChangeHandler = (value: string) => {
            setId(value);
            setIdError(false);
            setIdErrorMessage('');
        };

        // event handler: 이메일 변경 이벤트 처리 //
        const onEmailChangeHandler = (value: string) => {
            setEmail(value);
            setEmailError(false);
            setEmailErrorMessage('');
        };
    
        // event handler: 패스워드 변경 이벤트 처리 //
        const onPasswordChangeHandler = (value: string)=>{
            setPassword(value);
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
    
        // event handler: 패스워드 변경 체크 이벤트 처리 //
        const onPasswordCheckChangeHandler = (value: string)=>{
            setPasswordCheck(value);
            setPasswordCheckError(false);
            setPasswordCheckErrorMessage('');
        }

        // event handler: 개인 정보 동의 체크 박스 클릭 이벤트 처리 //
        const onAgreedPersonalClickHandler =()=>{
            setAgreedPersonal(!agreedPersonal);
            setAgreedPersonalError(false);
        }

        // event handler: 다음 버튼 클릭 이벤트 처리 //
        const onSignUpButtonClickHandler=()=>{

            const emailPattern = /^[a-zA-Z0-9]*@([-,]?[a-zA-Z0-9])*\.[a-zA-z]{2,4}$/;
    
            const isEmailPattern = emailPattern.test(email);
            if(!isEmailPattern){
                setEmailError(true);
                setEmailErrorMessage('이메일 주소 포맷이 맞지 않습니다.');
            }
    
            const isCheckedPassword = password.trim().length >= 8;
            if(!isCheckedPassword){
                setPasswordError(true);
                setPasswordErrorMessage('비밀번호를 8자 이상으로 설정해야합니다.');
            }
    
            const isEqualPassword = password === passwordCheck;
            if(!isEqualPassword){
                setPasswordCheckError(true);
                setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다');
            }
    
            if(!isEmailPattern || !isCheckedPassword || !isEqualPassword) return;

            if(!agreedPersonal){
                setAgreedPersonalError(true);
            }

            if(!agreedPersonal) return;

            const requestBody: SignUpRequestDto = {
                id, email, password, agreedPersonal
            }
    
            signUpRequest(requestBody).then(signUpResponse);
        }

        // event handler: 로그인 링크 클릭 이벤트 처리 //
        const onSignInLinkClickHandler =()=>{
            setView('sign-in');
        }

        const checkIdDuplicate = () => {
            // ID 중복 체크 로직 구현
            console.log("ID 중복 체크");
        };
    
        const sendVerificationEmail = () => {
            // 이메일 인증 로직 구현
            console.log("이메일 인증 코드 전송");
        };
    
        const verifyEmailCode = () => {
            // 이메일 인증 코드 확인 로직 구현
            console.log("이메일 인증 코드 확인");
        };

        return (
            <View style={styles.signInContainer}>
                <Text style={styles.signInTitle}>회원가입</Text>
                <View style={styles.signUpInputContainer}>
                    <View style={styles.inputWithButton}>
                        <TextInput
                            style={[styles.input, styles.inputWithButtonStyle]}
                            placeholder="아이디"
                            value={username}
                            onChangeText={setUsername}
                        />
                        <TouchableOpacity style={styles.inputButton} onPress={checkIdDuplicate}>
                            <Text style={styles.inputButtonText}>중복체크</Text>
                        </TouchableOpacity>
                    </View>
                    {isIdError ? <Text style={styles.errorText}>{idErrorMessage}</Text> : null}
    
                    <View style={styles.inputWithButton}>
                        <TextInput
                            style={[styles.input, styles.inputWithButtonStyle]}
                            placeholder="이메일"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TouchableOpacity style={styles.inputButton} onPress={sendVerificationEmail}>
                            <Text style={styles.inputButtonText}>인증</Text>
                        </TouchableOpacity>
                    </View>
                    {isEmailError ? <Text style={styles.errorText}>{emailErrorMessage}</Text> : null}
    
                    <View style={styles.inputWithButton}>
                        <TextInput
                            style={[styles.input, styles.inputWithButtonStyle]}
                            placeholder="이메일 인증 코드"
                        />
                        <TouchableOpacity style={styles.inputButton} onPress={verifyEmailCode}>
                            <Text style={styles.inputButtonText}>확인</Text>
                        </TouchableOpacity>
                    </View>
    
                    <TextInput
                        style={styles.input}
                        placeholder="비밀번호"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    {isPasswordError ? <Text style={styles.errorText}>{passwordErrorMessage}</Text> : null}
    
                    <TextInput
                        style={styles.input}
                        placeholder="비밀번호 확인"
                        value={passwordCheck}
                        onChangeText={setPasswordCheck}
                        secureTextEntry
                    />
                    {isPasswordCheckError ? <Text style={styles.errorText}>{passwordCheckErrorMessage}</Text> : null}
                </View>
                <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={() => setShowTerms(true)}>
                        <Text style={styles.checkboxLabel}>약관 동의</Text>
                    </TouchableOpacity>
                    {isAgreedPersonalError ? <Text style={styles.errorText}>약관에 동의해야 합니다.</Text> : null}
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
                                        setAgreedPersonal(true);
                                        setShowTerms(false);
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>동의</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.modalButton} 
                                    onPress={() => {
                                        setAgreedPersonal(false);
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
    mainContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
});


export default Login;
