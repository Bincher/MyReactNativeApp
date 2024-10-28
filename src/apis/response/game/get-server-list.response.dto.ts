import { AdminServerListItem } from "../../../types/interface";
import ResponseDto from "../response.dto";

export default interface GetServerListResponseDto extends ResponseDto{
    serverList: AdminServerListItem[];
}