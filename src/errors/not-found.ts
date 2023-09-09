import CustomAPIError from "./custom-error";
import { StatusCodes } from "http-status-codes";
class NotFoundError extends CustomAPIError {
  constructor(public message:string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export default NotFoundError;
