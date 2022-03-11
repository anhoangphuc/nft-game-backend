import {Controller, Get, HttpStatus} from '@nestjs/common';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('summoners')
export class SummonersController {
  @Get('hello')
  @ApiOperation({
    operationId: 'helloSummoners',
    summary: 'Test Summoners as a first service',
  })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async helloSummoners(): Promise<String> {
    return "Hello Summoners";
  }
}
