// Picker.tsx
import React from 'react';
import { Select } from 'native-base';

// Props 타입 정의
interface PickerProps {
  selectedValue: string; // 선택된 값 (string으로 가정)
  onValueChange: (value: string) => void; // 값 변경 시 호출되는 함수
  data: Array<{ label: string; value: string }>; // 데이터 배열 (label과 value 포함)
}

// Picker 컴포넌트 정의
export default function Picker(props: PickerProps): JSX.Element {
  const { selectedValue, onValueChange, data } = props;

  return (
    <Select selectedValue={selectedValue} onValueChange={onValueChange}>
      {data.map((e, index) => {
        const { label, value } = e;
        return <Select.Item label={label} value={value} key={index} />;
      })}
    </Select>
  );
}