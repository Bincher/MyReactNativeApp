export interface PaymentResponse {
    success: boolean; // 결제 성공 여부 (true/false)
    imp_uid?: string; // 아임포트 고유 ID
    merchant_uid?: string; // 상점 주문번호
    error_msg?: string; // 에러 메시지 (결제가 실패한 경우)
}