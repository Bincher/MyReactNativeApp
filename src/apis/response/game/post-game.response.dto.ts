import { Game } from "../../../types/game";
import ResponseDto from "../Response.dto";

export default interface PostGameResponseDto extends ResponseDto, Game{

}