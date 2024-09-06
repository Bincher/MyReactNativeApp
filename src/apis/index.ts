import axios, { AxiosResponse } from "axios";
import { CheckCertificationRequestDto, EmailCertificationRequestDto, IdCheckRequestDto, SignInRequestDto, SignUpRequestDto } from "./request/auth";
import { ResponseDto } from "./response";
import { SignUpResponseDto, SignInResponseDto, IdCheckResponseDto, EmailCertificationResponseDto, CheckCertificationResponseDto } from "./response/auth";


const DOMAIN = 'http://10.0.2.2:4000';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization =(accessToken: string)=>{
    return {headers: {Authorization: `Bearer ${accessToken}`}}
}

const SIGN_IN_URL =()=> `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL =()=> `${API_DOMAIN}/auth/sign-up`;
const ID_CHECK_URL =()=> `${API_DOMAIN}/auth/id-check`;
const EMAIL_CERTIFICATION_URL =()=> `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL =()=> `${API_DOMAIN}/auth/check-certification`;

const responseHandler = <T>(response: AxiosResponse<any, any>)=>{
    const responseBody: T = response.data;
    return responseBody;
}

const errorHandler = (error: any)=>{
    console.log(error);
    if(!error.response || !error.response.data) return null;
    const responseBody: ResponseDto = error.response.data;
    return responseBody;
}

export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const result = await axios.post(ID_CHECK_URL(), requestBody)
        .then(responseHandler<IdCheckResponseDto>)
        .catch(errorHandler);
    return result;
}

export const emailCertificationRequest = async (requestBody: EmailCertificationRequestDto) =>{
    const result = await axios.post(EMAIL_CERTIFICATION_URL(), requestBody)
        .then(responseHandler<EmailCertificationResponseDto>)
        .catch(errorHandler)
    return result;
}

export const checkCertificationRequest = async (requestBody: CheckCertificationRequestDto) =>{
    const result = await axios.post(CHECK_CERTIFICATION_URL(), requestBody)
        .then(responseHandler<CheckCertificationResponseDto>)
        .catch(errorHandler)
    return result;
}

export const signInRequest = async (requestBody: SignInRequestDto)=>{
    console.log(requestBody);
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(responseHandler<SignInResponseDto>)
        .catch(errorHandler);
    return result;
}

export const signUpRequest = async (requestBody: SignUpRequestDto)=>{
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(response =>{
            const responseBody:SignUpResponseDto = response.data;
            return responseBody;
        })
        .catch(error=>{
            if(!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}