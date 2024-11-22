import axios, { AxiosResponse } from "axios";
import { CheckCertificationRequestDto, EmailCertificationRequestDto, IdCheckRequestDto, SignInRequestDto, SignUpRequestDto } from "./request/auth";
import { ResponseDto } from "./response";
import { SignUpResponseDto, SignInResponseDto, IdCheckResponseDto, EmailCertificationResponseDto, CheckCertificationResponseDto } from "./response/auth";
import { CheckCertificationForChangeResponseDto, EmailCertificationForChangeResponseDto, GetSignInUserResponseDto, GetUserResponseDto, IsPasswordRightResponseDto, PatchEmailResponseDto, PatchPasswordResponseDto, PatchProfileImageResponseDto } from "./response/user";
import { PostGameRequestDto } from "./request/game";
import { DeleteGameServerResponseDto, GetServerListResponseDto, PatchGameServerResponseDto, PostGameResponseDto } from "./response/game";
import GetGameListResponseDto from "./response/game/get-game-list.response.dto";
import PostGameServerRequestDto from "./request/game/post-game-server.request.dto";
import PostGameServerResponseDto from "./response/game/post-game-server.response.dto";
import GetUserServerListResponseDto from "./response/game/get-user-server-list.response.dto";
import PatchGameServerRequestDto from "./request/game/patch-game-server.request.dto";
import PatchServerRequestDto from "./request/game/patch-server.request.dto";
import PatchServerResponseDto from "./response/game/patch-server.response.dto";
import { PatchFcmTokenRequestDto, SendEmailRequestDto, SendNotificationRequestDto } from "./request/support";
import { PatchFcmTokenResponseDto, SendEmailResponseDto, SendNotificationResponseDto } from "./response/support";
import { CheckCertificationForChangeRequestDto, EmailCertificationForChangeRequestDto, IsPasswordRightRequestDto, PatchEmailRequestDto, PatchPasswordRequestDto, PatchProfileImageRequestDto } from "./request/user";


const DOMAIN = 'http://10.0.2.2:4000';
// http://localhost:4000

const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization =(accessToken: string)=>{
    return {headers: {Authorization: `Bearer ${accessToken}`}}
}

const SIGN_IN_URL =()=> `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL =()=> `${API_DOMAIN}/auth/sign-up`;
const ID_CHECK_URL =()=> `${API_DOMAIN}/auth/id-check`;
const EMAIL_CERTIFICATION_URL =()=> `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL =()=> `${API_DOMAIN}/auth/check-certification`;
const GET_SIGN_IN_USER_URL =()=>`${API_DOMAIN}/user`;
const GET_USER_URL =(id: string)=> `${API_DOMAIN}/user/${id}`
const POST_GAME_URL =()=> `${API_DOMAIN}/game`;
const GET_GAME_LIST_URL =()=> `${API_DOMAIN}/game/game-list`;
const POST_GAME_SERVER_URL =()=> `${API_DOMAIN}/game/server`;
const GET_USER_SERVER_LIST_URL =(id: string)=> `${API_DOMAIN}/game/user-server-list/${id}`;
const GET_ADMIN_SERVER_LIST_URL =()=> `${API_DOMAIN}/game/admin/server-list`;
const PATCH_GAME_SERVER_URL =(serverId: number)=> `${API_DOMAIN}/game/server/${serverId}`;
const PATCH_SERVER_URL =(serverId: number)=> `${API_DOMAIN}/game/admin/server/${serverId}`;
const DELETE_GAME_SERVER_URL =(serverId: number)=> `${API_DOMAIN}/game/server/${serverId}`;
const SEND_EMAIL_URL =()=> `${API_DOMAIN}/support/email`;
const PATCH_FCM_TOKEN_URL =()=> `${API_DOMAIN}/notification/fcm`
const SEND_NOTIFICATION_TO_ADMIN_URL =()=> `${API_DOMAIN}/notification/send-to-admins`
const SEND_NOTIFICATION_TO_USER_URL =(userId: string)=> `${API_DOMAIN}/notification/send-to-user/${userId}`
const PATCH_EMAIL_URL =()=>`${API_DOMAIN}/user/email`;
const PATCH_PASSWORD_URL =()=>`${API_DOMAIN}/user/password`;
const PATCH_PROFILE_IMAGE_URL =()=>`${API_DOMAIN}/user/profile-image`;
const IS_PASSWORD_RIGHT_URL =()=>`${API_DOMAIN}/user/password/is-right`;
const EMAIL_CERTIFICATION_FOR_CHANGE_URL =()=> `${API_DOMAIN}/user/email-certification`;
const CHECK_CERTIFICATION_FOR_CHANGE_URL =()=> `${API_DOMAIN}/user/check-certification`;

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

export const GetSignInUserRequest = async (accessToken: string) =>{
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
        .then(response =>{
            const responseBody: GetSignInUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
} 

export const getUserRequest = async (id: string) =>{
    const result = await axios.get(GET_USER_URL(id))
        .then(response =>{
            const responseBody: GetUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const postGameRequest = async (requestBody: PostGameRequestDto) =>{
    const result = await axios.post(POST_GAME_URL(), requestBody)
        .then(response => {
            const responseBody: PostGameResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getGameListRequest = async () => {
    const result = await axios.get(GET_GAME_LIST_URL())
        .then(response => {
            const responseBody: GetGameListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const postGameServerRequest = async (requestBody: PostGameServerRequestDto, accessToken: string) =>{
    const result = await axios.post(POST_GAME_SERVER_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostGameServerResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getUserServerListRequest = async(id: string)=>{
    const result = await axios.get(GET_USER_SERVER_LIST_URL(id))
        .then(response => {
            const responseBody: GetServerListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })

    return result;
}

export const getAdminServerListRequest = async(accessToken: string)=>{
    const result = await axios.get(GET_ADMIN_SERVER_LIST_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetServerListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })

    return result;
}

export const patchServerRequest = async (serverId: number, requestBody: PatchGameServerRequestDto, accessToken: string)=>{
    const result = await axios.patch(PATCH_GAME_SERVER_URL(serverId), requestBody, authorization(accessToken))
        .then(response => { 
            const responseBody: PatchGameServerResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const patchAdminServerRequest = async (serverId: number, requestBody: PatchServerRequestDto, accessToken: string)=>{
    const result = await axios.patch(PATCH_SERVER_URL(serverId), requestBody, authorization(accessToken))
        .then(response => { 
            const responseBody: PatchServerResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const deleteGameServerRequest =async (serverId: number, accessToken: string)=>{
    const result = await axios.delete(DELETE_GAME_SERVER_URL(serverId), authorization(accessToken))
        .then(response =>{
            const responseBody: DeleteGameServerResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const SendEmailRequest = async (requestBody: SendEmailRequestDto) =>{
    const result = await axios.post(SEND_EMAIL_URL(), requestBody)
        .then(responseHandler<SendEmailResponseDto>)
        .catch(errorHandler)
    return result;
}

export const sendFcmTokenToServer = async (requestBody: PatchFcmTokenRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_FCM_TOKEN_URL(), requestBody, authorization(accessToken))
        .then(response =>{
            const responseBody: PatchFcmTokenResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const SendNotificationToAdminRequest = async (requestBody: SendNotificationRequestDto) => {
    const result = await axios.post(SEND_NOTIFICATION_TO_ADMIN_URL(), requestBody)
    .then(response =>{
        const responseBody: SendNotificationResponseDto = response.data;
        return responseBody;
    })
    .catch(error =>{
        if(!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}

export const SendNotificationToUserRequest = async (requestBody: SendNotificationRequestDto, userId: string) => {
    const result = await axios.post(SEND_NOTIFICATION_TO_USER_URL(userId), requestBody)
    .then(response =>{
        const responseBody: SendNotificationResponseDto = response.data;
        return responseBody;
    })
    .catch(error =>{
        if(!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}

export const patchEmailRequest =async (requestBody: PatchEmailRequestDto,accessToken: string)=>{
    const result = await axios.patch(PATCH_EMAIL_URL(), requestBody, authorization(accessToken))
        .then(response =>{
            const responseBody: PatchEmailResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const patchPasswordRequest =async (requestBody: PatchPasswordRequestDto,accessToken: string)=>{
    const result = await axios.patch(PATCH_PASSWORD_URL(), requestBody, authorization(accessToken))
        .then(response =>{
            const responseBody: PatchPasswordResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const patchProfileImageRequest =async (requestBody: PatchProfileImageRequestDto, accessToken: string)=>{
    const result = await axios.patch(PATCH_PROFILE_IMAGE_URL(), requestBody, authorization(accessToken))
        .then(response =>{
            const responseBody: PatchProfileImageResponseDto = response.data;
            return responseBody;
        })
        .catch(error =>{
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const isPasswordRightRequest = async (requestBody: IsPasswordRightRequestDto, accessToken: string) =>{
    const result = await axios.post(IS_PASSWORD_RIGHT_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<IsPasswordRightResponseDto>)
        .catch(errorHandler)
    return result;
}

export const emailCertificationForChangeRequest = async (requestBody: EmailCertificationForChangeRequestDto, accessToken: string) =>{
    const result = await axios.post(EMAIL_CERTIFICATION_FOR_CHANGE_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<EmailCertificationForChangeResponseDto>)
        .catch(errorHandler)
    return result;
}

export const checkCertificationForChangeRequest = async (requestBody: CheckCertificationForChangeRequestDto, accessToken: string) =>{
    const result = await axios.post(CHECK_CERTIFICATION_FOR_CHANGE_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<CheckCertificationForChangeResponseDto>)
        .catch(errorHandler)
    return result;
}

const FILE_DOMAIN = `${DOMAIN}/file`;
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;

export const fileUploadRequest = async (data: FormData) => {
    try {
        const response = await axios.post(FILE_UPLOAD_URL(), data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
};

