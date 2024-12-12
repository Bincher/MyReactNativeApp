import React from 'react';
import IMP from 'iamport-react-native';
import Loading from '../../components/loading';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PaymentData } from '../../types/interface';
import { Alert } from 'react-native';

// RootStackParamList 타입 정의
type RootStackParamList = {
    ServerMakingScreen: {paymentData : PaymentData};
    PaymentScreen: {paymentData : PaymentData};
};

// 네비게이션 및 라우트 타입 정의
type PaymentNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentScreen'>;
type PaymentRouteProp = RouteProp<RootStackParamList, 'PaymentScreen'>;

const PaymentScreen: React.FC = () => {

    const navigation = useNavigation<PaymentNavigationProp>();
    const route = useRoute<PaymentRouteProp>();

    const {paymentData} = route.params;
    const itemName = paymentData?.name;
    const amount = paymentData?.amount;
    if(itemName == null || amount == null) {
        navigation.goBack;
        return;
    }

    function callback(response : any) {
        console.log(response);
        if (response.imp_success === "true") {
            Alert.alert(
                "결제가 완료되었습니다.",
                "서버 제작까지 최대 24시간이 소요될 수 있습니다."
            );
            navigation.goBack();
        } else {
            Alert.alert(
                "결제에 실패했습니다.",
                "다시 시도해주세요."
            );
            navigation.goBack();
        }
        
    }

    const data = {
        pg: 'kakaopay',
        pay_method: 'card',
        name: itemName,
        merchant_uid: `mid_${new Date().getTime()}`,
        amount: amount,
        escrow: false,
        buyer_name: '',
        buyer_tel: '',
        buyer_email: 'example@naver.com',
        buyer_addr: '',
        buyer_postcode: '06018',
        app_scheme: 'example',
        // [Deprecated v1.0.3]: m_redirect_url
    };

    return (
        <IMP.Payment
          userCode={'imp06227276'}    // 가맹점 식별코드
          loading={<Loading />}   // 웹뷰 로딩 컴포넌트
          data={data}             // 결제 데이터
          callback={callback}     // 결제 종료 후 콜백
        />
    );
};

export default PaymentScreen;