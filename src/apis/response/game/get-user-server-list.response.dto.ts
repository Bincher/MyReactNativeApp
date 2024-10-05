import ServerListItem from "../../../types/interface/server-list-item.interface";
import ResponseDto from "../response.dto";

export default interface GetUserServerListResponseDto extends ResponseDto{
    userServerList: ServerListItem[];
}