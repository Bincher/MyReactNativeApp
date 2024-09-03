import React, { ChangeEvent, useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image, Pressable, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import  * as KakaoLogin from '@react-native-seoul/kakao-login';
import SignInResponseDto from '../../apis/response/auth/sign-in-response.dto';
import ResponseDto from '../../apis/response/response.dto';
import { SignInRequestDto, SignUpRequestDto } from '../../apis/request/auth';
import { SignUpRequest, signInRequest } from '../../apis';
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

    const handleLogin = () => {
        if (username === 'admin' && password === 'password') {
            Alert.alert('로그인 성공', '환영합니다!');
            navigation.navigate('Main');
        } else {
            Alert.alert('로그인 실패', '아이디 또는 비밀번호가 잘못되었습니다.');
        }
    };

    const handleBack = () => {
        navigation.navigate('Main');
    };


    const handleSignup = () => {
        navigation.navigate('Signup');
    };

    const SignInCard =()=>{
        // state: 이메일 요소 참조 상태 //
        const emailRef = useRef<HTMLInputElement | null>(null);

        // state: 패스워드 요소 참조 상태 //
        const passwordRef = useRef<HTMLInputElement | null>(null);

        // state: 이메일 상태 //
        const [email, setEmail] = useState<string>('');

        // state: 패스워드 상태 //
        const [password, setPassword] = useState<string>('');

        // state: 패스워드 타입 상태 //
        const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');

        // state: 패스워드 버튼 아이콘 상태 //
        const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
        
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
    
            const {token, expirationTime} = responseBody as SignInResponseDto;
            const now = new Date().getTime();
            const expires = new Date(now + expirationTime * 1000);

    
            try {
                await AsyncStorage.setItem('accessToken', token);
                navigation.replace('Main');  // 로그인 후 Main 화면으로 이동
            } catch (e) {
                console.log('Failed to save the token', e);
            }
        }
    
        // event handler: 로그인 버튼 클릭 이벤트 처리 //
        const onSignInButtonClickHandler =()=>{
            const requestBody: SignInRequestDto = {
            email, password
            }
            signInRequest(requestBody).then(signInResponse);
        }
    
        // event handler: 회원가입 링크 클릭 이벤트 처리 //
        const onSignUpButtonClickHandler=()=>{
            setView('sign-up');
        }
    
        // event handler: 패스워드 버튼 클릭 이벤트 처리 //
        const onPasswordButtonClickHandler=()=>{
            if(passwordType === 'text'){
                setPasswordType('password');
                setPasswordButtonIcon('eye-light-off-icon');
            }else{
                setPasswordType('text');
                setPasswordButtonIcon('eye-light-on-icon');
            }
        }
    
        return (
            <View style={styles.signInContainer}>
                <Text style={styles.title}>로그인</Text>
                <View style={styles.socialLoginContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={login}
                    >
                        <Text style={styles.buttonText}>카카오 로그인</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="아이디"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="비밀번호"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
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

        // state: 패스워드 버튼 아이콘 상태 //
        const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

        // state: 패스워드 확인 버튼 아이콘 상태 //
        const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

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

        // event handler: 패스워드 버튼 클릭 이벤트 처리 //
        const onPasswordButtonClickHandler =()=>{
            if(passwordButtonIcon === 'eye-light-off-icon'){
                setPasswordButtonIcon('eye-light-on-icon');
                setPasswordType('text');
            }else{
                setPasswordButtonIcon('eye-light-off-icon');
                setPasswordType('password');
            }
        }

        // event handler: 패스워드 확인 버튼 클릭 이벤트 처리 //
        const onPasswordCheckButtonClickHandler =()=>{
            if(passwordCheckButtonIcon === 'eye-light-off-icon'){
                setPasswordCheckButtonIcon('eye-light-on-icon');
                setPasswordCheckType('text');
            }else{
                setPasswordCheckButtonIcon('eye-light-off-icon');
                setPasswordCheckType('password');
            }
        }

        // event handler: 다음 버튼 클릭 이벤트 처리 //
        const onNextButtonClickHandler=()=>{

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
        }

        // event handler: 회원 가입 버튼 클릭 이벤트 처리 //
        const onSignUpButtonClickHandler =()=>{
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
    
            if(!isEmailPattern || !isCheckedPassword || !isEqualPassword){
                return;
            };
    
            if(!agreedPersonal){
                setAgreedPersonalError(true);
            }
    
            if(!agreedPersonal) return;
    
            const requestBody: SignUpRequestDto = {
                id, email, password, agreedPersonal
            }
    
            SignUpRequest(requestBody).then(signUpResponse);
        }

        // event handler: 로그인 링크 클릭 이벤트 처리 //
        const onSignInLinkClickHandler =()=>{
            setView('sign-in');
        }

        return (
            <View style={styles.signUpContainer}>
                <Text style={styles.title}>회원가입</Text>
                <TextInput
                    style={styles.input}
                    placeholder="아이디"
                    value={username}
                    onChangeText={setUsername}
                />
                {isIdError ? <Text style={styles.errorText}>{idErrorMessage}</Text> : null}

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
                    placeholder="이메일"
                    value={email}
                    onChangeText={setEmail}
                />
                {isEmailError ? <Text style={styles.errorText}>{emailErrorMessage}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="비밀번호 확인"
                    value={passwordCheck}
                    onChangeText={setPasswordCheck}
                    secureTextEntry
                />
                {isPasswordCheckError ? <Text style={styles.errorText}>{passwordCheckErrorMessage}</Text> : null}

                <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={() => setAgreedPersonal(!agreedPersonal)}>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#6200ea',
    },
    signInContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#6200ea',
    },
    signUpContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#6200ea',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
    },
    socialLoginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    button: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 5,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#6200ea',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
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
});


export default Login;
