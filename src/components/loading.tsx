// Loading.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

// 스타일 객체의 타입 정의
type Styles = {
  container: ViewStyle;
};

// Loading 컴포넌트 정의
export function Loading(): JSX.Element {
  const { container } = styles;
  return (
    <View style={container}>
      <Text>잠시만 기다려주세요...</Text>
    </View>
  );
}

// 스타일 정의
const styles = StyleSheet.create<Styles>({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Loading;