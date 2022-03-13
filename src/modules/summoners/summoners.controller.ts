import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SummonersPublicInfoResponseDto } from './summoners.dto';
import { SummonersService } from './summoners.service';
import { plainToClass, plainToInstance } from 'class-transformer';

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
    type: SummonersPublicInfoResponseDto,
  })
  async getPublicSummonerInfo(@Param('id', ParseIntPipe) summonerId: number): Promise<SummonersPublicInfoResponseDto> {
    const summoner = await this.summonersService.getSummonersInfo(summonerId);
    return plainToInstance(SummonersPublicInfoResponseDto, summoner);
  }

  @Get('')
  @ApiQuery({
    name: 'userAddress',
    description: 'Address of user',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: SummonersPublicInfoResponseDto,
    isArray: true,
  })
  async getPublicSummonerInfos(@Query('userAddress') userAddress: string): Promise<SummonersPublicInfoResponseDto[]> {
    const queryFilter = {};
    if (userAddress) queryFilter[userAddress] = userAddress;
    const summoners = await this.summonersService.getSummonerInfos(queryFilter);
    return plainToInstance(SummonersPublicInfoResponseDto, summoners);
  }
}
