import { Game } from "../../../types/Game";
import ResponseDto from "../Response.dto";

export default interface PostGameResponseDto extends ResponseDto, Game{

}