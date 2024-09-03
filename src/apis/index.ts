import axios from "axios";
import { SignInRequestDto, SignUpRequestDto } from "./request/auth";
import SignInResponseDto from "./response/auth/sign-in-response.dto";
import ResponseDto from "./response/response.dto";
import { SignUpResponseDto } from "./response/auth";

const DOMAIN = 'http://localhost:4000';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization =(accessToken: string)=>{
    return {headers: {Authorization: `Bearer ${accessToken}`}}
}

const SIGN_IN_URL =()=> `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL =()=> `${API_DOMAIN}/auth/sign-up`;

export const signInRequest = async (requestBody: SignInRequestDto)=>{
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(response =>{
            const responseBody: SignInResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const SignUpRequest = async (requestBody: SignUpRequestDto)=>{
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