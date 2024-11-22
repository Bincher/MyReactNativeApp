import { Game } from "../../../types/game";
import ResponseDto from "../response.dto";

export default interface PostGameServerResponseDto extends ResponseDto, Game{

}