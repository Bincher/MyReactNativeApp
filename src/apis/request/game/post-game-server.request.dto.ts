export default interface PostGameServerRequestDto{
    name: string;
    content: string;
    location: string;
    performance: string;
    disk: string;
    backup: boolean;
    billingAmount: string;
    requestDetails: string;
    modeCount: number;
    gameTitle: string;
}