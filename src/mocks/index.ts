import { Game, Server } from "../types/interface";


export const gameData: Game[] = [
    {
        gameImage: 'http://localhost:4000/file/42a8e91e-d4d2-4997-b860-0e58ce584998.png',
        title: '광부의전설',
        description: '어드벤쳐',
        amountLevel: '1',
    },
    {
        gameImage: 'http://localhost:4000/file/42a8e91e-d4d2-4997-b860-0e58ce584998.png',
        title: '엘든팰',
        description: 'RPG',
        amountLevel: '2',
    },
    {
        gameImage: 'http://localhost:4000/file/42a8e91e-d4d2-4997-b860-0e58ce584998.png',
        title: '사이비펑크',
        description: '액션',
        amountLevel: '4',
    },
];

// 설계 변경으로 인해 작동 X
// export const serverData: Server[] = [
//     {
//         id: '1',
//         gameI: require('C:/dev/ReactNativeApp/MyReactNativeApp/src/assets/images/광부의전설.png'),
//         gameName: '광부의전설',
//         genre: '어드벤쳐',
//         serverName: '동아리전용서버',
//         description: '동아리원들끼리 플레이할 서버',
//         creationDate: '2023-06-01',
//         ipAddress: '192.168.0.1',
//         serverStatus: '활성됨',
//         serverOptions: 'Pro',
//         estimatedCost: '월 80000원',
//     },
//     {
//         id: '2',
//         gameImage: require('C:/dev/ReactNativeApp/MyReactNativeApp/src/assets/images/엘든팰.png'),
//         gameName: '엘든팰',
//         genre: 'RPG',
//         serverName: '친구끼리 할 서버',
//         description: '애들이랑 할꺼고 3달뒤에 접을듯?',
//         creationDate: '2023-06-02',
//         ipAddress: '192.168.0.2',
//         serverStatus: '활성됨',
//         serverOptions: 'Standard',
//         estimatedCost: '월 10000원',
//     },
//     {
//         id: '3',
//         gameImage: require('C:/dev/ReactNativeApp/MyReactNativeApp/src/assets/images/사이비펑크.png'),
//         gameName: '사이비펑크',
//         genre: '액션',
//         serverName: '서버 테스트용',
//         description: '테스트 중...',
//         creationDate: '2023-06-03',
//         ipAddress: '192.168.0.3',
//         serverStatus: '중지됨',
//         serverOptions: 'Basic',
//         estimatedCost: '월 6000원',
//     },
// ];
