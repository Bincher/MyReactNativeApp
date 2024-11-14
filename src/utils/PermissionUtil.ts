import { Alert, Platform } from "react-native";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";

/**
 * '앱의 권한'을 공통으로 관리하는 유틸입니다.
 */
class PermissionUtil {

    /**
     * [필수] 모든 권한에 대해서 기본적으로 디바이스 플랫폼을 체크합니다.
     * @returns {boolean} true : 사용 가능 디바이스 플랫폼, false : 사용 불가능 디바이스 플랫폼
     */
    cmmDevicePlatformCheck = (): boolean => {
        let isUseDevice = true;
        if (Platform.OS !== "ios" && Platform.OS !== "android") !isUseDevice;
        return isUseDevice;
    }

		/**
     * 카메라 권한
     * @return 
     */
    cmmReqCameraPermission = async (): Promise<void> => {
        
        // 모든 권한에 대해 디바이스 플랫폼을 체크합니다. (해당 되지 않는 경우 종료합니다.)
        if (!this.cmmDevicePlatformCheck()) return;
        const platformPermissions = Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
        try {
            // Request Permission
            const result = await request(platformPermissions);

            if (result == RESULTS.GRANTED) {
                console.log("권한이 허용되었습니다.")
            }
        } catch (err) {
            Alert.alert("Camera permission err");
            console.warn(err);
        }
    }
}
export default new PermissionUtil();