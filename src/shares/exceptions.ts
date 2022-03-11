import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(msg: string, httpStatus: HttpStatus) {
    super(msg, httpStatus);
  }
}
