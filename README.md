# 게임 호스팅 서비스

- 참고 : https://www.notion.so/bincher/485d7480dc5d4df581d346f9f769d5c6

https://coqoa.tistory.com/145

- 4학년 교양 '창업 마케팅'에서 기말과제로 냈던 창업계획서를 바탕으로 실제 앱을 구현 하는 것이 목표

    - 해당 프로젝트는 스프링, 리액트네이티브, 배포 공부를 위한 프로젝트로 실제로 서비스할 계획은 없다

    - 실제로 서비스하려면 aws나 gcp로 서버를 만드는 과정을 게임마다 공부할 필요가 존재

    - 구글 플레이 스토어에 제출해볼 의향은 있으나 당장은 계획에 없음

- 사용자는 게임 서버에 대한 제작을 운영자에게 맡기는 시스템

    - 사용자는 게임 목록에서 게임을 선택해 서버를 생성할 수 있다

    - 운영자는 사용자로부터 받은 서버를 제작하고 관리한다

    - 사용자는 원하는 때에 서버에 대한 수정과 삭제가 가능하다

    - 사용자는 각 서버에 대한 자세한 문의를 신청할 수 있다

    - 위 기능들은 로그인이 필수이다

- 진행 사항

    - 백엔드 작업 완료 뒤 결제 시스템 구축 예정

## 설명

- 기능

    - 사용자

        - 회원 가입 기능

        - 로그인 기능

        - 서버 생성 기능

        - 서버 관리 기능

        - 서버 삭제 기능

        - 문의 기능

        - 프로필 설정 기능

        - 탈퇴 기능

    - 운영자(admin)

        - 게임 목록 추가 기능

        - 서버 생성 요청 확인 기능

        - 서버 생성 결과 수정 기능

        - 문의 답변 notification 전송 기능

- 사용 방법

    - spring : BoardBackApplication.java 실행

        - 차후 클라우드 서버에 올릴 예정(gcp 또는 aws)

    - react-native : react-native run-android

        - 차후 APK 형식의 파일 생성 예정

        - 또한 구글 플레이 스토어에 등록도 고려

## 스크린 설명

- Main

    - 최초 실행 화면

    - 네비게이션 기준 root에 해당

    - 메뉴 버튼

        - 메뉴 버튼은 현재 삭제 고려중

    - 프로필 버튼

        - 로그인이 안되어있다면 로그인창으로 이동
        
        - 로그인이 되었다면 myProfile 스크린으로 이동

    - 서버 관리 버튼

        - 로그인이 안되어있다면 login 스크린으로 이동

        - 로그인이 되어있다면 myServer 스크린으로 이동

    - 서버 생성 버튼

        - 로그인이 안되어있다면 login 스크린으로 이동

        - 로그인이 되어있다면 gameList 스크린으로 이동

    - 설정 버튼

        - 후순위 구현

        - 알림 설정, 다크 모드, 약관 사항들을 명시할 예정

    - 문의 버튼

        - 로그인이 안되어있다면 login 스크린으로 이동

        - 로그인이 되어있다면 CustomerService 스크린으로 이동

- LoginScreen

    - 첫 시작시 sign in 컴포넌트가 렌더링
        
        - ID, PASSWORD를 입력

        - 소셜 로그인(kakao)은 구현 예정

    - 회원 가입 버튼

        - login 스크린의 sign in 컴포넌트 대신 sign up 컴포넌트가 실행

        - 회원 가입시 메일 인증과 아이디 중복 체크는 필수

        - 현재 고민중인 사항으로 메일 중복 여부도 추가할 예정

- ServerScreen

    - 현재 사용자의 서버 목록또는 전체 서버 목록(admin계정 한정)을 출력

    - 검색창에 서버 이름과 게임 이름으로 검색 가능

    - 임의의 서버 클릭시 해당 게임의 파라미터를 던져주고 ServerDetails로 이동

- ServerDetailsScreen (user 전용)

    - 클릭한 서버의 자세한 정보를 출력

    - 서버 삭제 버튼 클릭시 안내문과 함께 다시 한번 되묻고 삭제

    - 서버 수정 버튼 클릭시 ServerUpdating으로 이동

- ServerUpdatingScreen (user 전용)

    - serverMaking을 기반으로 활용

    - 서버 수정 가능

    - 서버 수정 후 바로 이용이 안되고 status가 확인중으로 변경됨

- ServerManagingScreen (admin 전용)

    - admin에게 허용된 유저의 서버 수정 가능

    - 서버 변경 알림 전송 가능

- GameListScreen

    - 현재 생성할 수 있는 게임 종류가 등장

    - 검색 기능 구현

    - 게임 클릭시 해당 게임의 서버를 생성하는 ServerMakingScreen으로 이동

    - 게임 추가 가능(admin 전용)

- ServerMakingScreen
    
    - 서버 생성 가능

    - 서버에 대한 상세 정보를 기술

    - 서버 생성 버튼 클릭하면 status가 확인중이 되면서 운영자에게 전달

        - 알림 구현 예정

    - 결제 기능 구현 계획중

- CustomerServiceScreen

    - 현재 본인의 서버 정보 중 하나를 클릭하고 해당 서버에 관련된 문의를 이메일로 전송 가능

    - 전송과 동시에 admin들에게 알림 전송

- ProfileScreen

    - 로그인 유저의 정보를 표시

    - 비밀번호 체크 후 프로필 사진 변경, 이메일 변경, 비밀번호 변경 가능

    - 회원 탈퇴 가능(서버가 없다는 전제하)

- settings(가칭)

    - 설정 스크린

    - 예정

## 시작하기

### 필수 조건

### 설치 방법

### 프로그램 실행
