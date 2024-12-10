import React from 'react';
import IMP, { IMPData } from 'iamport-react-native';
import Loading from '../../components/loading';
import { SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// PaymentParams 타입 정의
interface PaymentParams {
    params: IMPData.PaymentData;
    userCode: string;
    tierCode?: string;
}

// RootStackParamList 타입 정의
type RootStackParamList = {
    GameListScreen: undefined;
    Payment: { data: PaymentParams };
    PaymentResult: any; // PaymentResult 화면으로 전달할 데이터 타입 (필요에 따라 수정)
};

// 네비게이션 및 라우트 타입 정의
type PaymentNavigationProp = StackNavigationProp<RootStackParamList, 'Payment'>;
type PaymentRouteProp = RouteProp<RootStackParamList, 'Payment'>;

interface Props {
    navigation: PaymentNavigationProp;
    route: PaymentRouteProp;
}

const Payment: React.FC<Props> = ({ route, navigation }) => {
    const { data } = route.params; // route에서 data 추출
    const { params, tierCode, userCode } = data; // data 내부의 값 추출

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            <IMP.Payment
                userCode={userCode}
                tierCode={tierCode}
                loading={<Loading />}
                data={params} // 결제 데이터 전달
                callback={(response) => navigation.replace('PaymentResult', response)} // 결제 결과 처리
            />
        </SafeAreaView>
    );
};

export default Payment;