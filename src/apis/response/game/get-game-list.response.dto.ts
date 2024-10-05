import { GameListItem } from "../../../types/interface";
import ResponseDto from "../response.dto";

export default interface GetGameListResponseDto extends ResponseDto{
    gameList: GameListItem[];
}