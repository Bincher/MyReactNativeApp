// PaymentResult.tsx
import React from 'react';
import {
  ArrowBackIcon,
  CheckCircleIcon,
  IconButton,
  List,
  Text,
  View,
  WarningIcon,
} from 'native-base';

// Define types for props
interface PaymentResultProps {
  route: {
    params: {
      imp_success: string | boolean;
      success: string | boolean;
      imp_uid: string;
      merchant_uid?: string;
      error_msg?: string;
    };
  };
  navigation: {
    navigate: (screen: string) => void;
  };
}

const PaymentResult: React.FC<PaymentResultProps> = ({ route, navigation }) => {
  const { imp_success, success, imp_uid, merchant_uid, error_msg } = route.params;

  // Determine if the payment was successful
  const isSuccess = !(
    imp_success === 'false' ||
    imp_success === false ||
    success === 'false' ||
    success === false
  );

  return (
    <View>
      {isSuccess ? <CheckCircleIcon /> : <WarningIcon />}
      <Text>{`결제에 ${isSuccess ? '성공' : '실패'}하였습니다`}</Text>
      <List>
        <List.Item>
          <Text>아임포트 번호</Text>
          <Text>{imp_uid}</Text>
        </List.Item>
        {isSuccess ? (
          <List.Item>
            <Text>주문번호</Text>
            <Text>{merchant_uid}</Text>
          </List.Item>
        ) : (
          <List.Item>
            <Text>에러메시지</Text>
            <Text>{error_msg}</Text>
          </List.Item>
        )}
      </List>
      <IconButton
        icon={<ArrowBackIcon />}
        onPress={() => navigation.navigate('Menu')}
      >
        <Text>돌아가기</Text>
      </IconButton>
    </View>
  );
};

export default PaymentResult;