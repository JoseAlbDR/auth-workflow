import CustomAPIError from "./custom-error";
import { StatusCodes } from "http-status-codes";

class Unauthorized extends CustomAPIError {
  constructor(public message: string) {
    super(message, StatusCodes.FORBIDDEN);
  }
}

export default Unauthorized;
