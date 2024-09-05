
import { ResponseDto } from "../../apis/response/index.ts";
import ResponseCode from "./response-code.enum.ts";
import ResponseMessage from "./response-code.enum.ts";

export type ResponseBody <T> = T | ResponseDto | null;

export { ResponseCode, ResponseMessage };