export interface PaymentData {
    // pg?: string; // PG사 코드 (예: html5_inicis, kcp 등)
    // pay_method?: string; // 결제 방식 (예: card, trans 등)
    // merchant_uid?: string; // 주문번호 (고유값)
    name: string; // 상품명
    amount: number; // 결제 금액
    // buyer_email?: string; // 구매자 이메일
    // buyer_name?: string; // 구매자 이름
    // buyer_tel?: string; // 구매자 전화번호
    // buyer_addr?: string; // 구매자 주소
    // buyer_postcode?: string; // 구매자 우편번호
    // app_scheme?: string; // iOS 앱 스킴 이름
    serverId: number;
}