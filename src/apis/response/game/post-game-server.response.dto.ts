import { Game } from "../../../types/Game";
import ResponseDto from "../response.dto";

export default interface PostGameServerResponseDto extends ResponseDto, Game{

}