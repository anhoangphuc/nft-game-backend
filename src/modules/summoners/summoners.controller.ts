import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SummonersPublicInfoResponseDto } from './summoners.dto';
import { SummonersService } from './summoners.service';
import { plainToClass } from 'class-transformer';

@Controller('summoners')
export class SummonersController {
  constructor(private readonly summonersService: SummonersService) {}
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
  async helloSummoners(): Promise<string> {
    return 'Hello Summoners';
  }

  @Get('/:id')
  @ApiOperation({
    operationId: 'summonerInfo',
    summary: 'Get public summoner info',
  })
  @ApiParam({
    name: 'id',
    description: 'Id of summoner',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  async getPublicSummonerInfo(
    @Param('id', ParseIntPipe) summonerId: number,
  ): Promise<SummonersPublicInfoResponseDto> {
    const summoner = await this.summonersService.getSummonersInfo(summonerId);
    return plainToClass(SummonersPublicInfoResponseDto, summoner);
  }
}
