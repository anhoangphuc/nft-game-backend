import { Controller, Get, HttpStatus, Param, ParseEnumPipe, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SummonersPublicInfoResponseDto } from './summoners.dto';
import { SummonersService } from './summoners.service';
import { plainToClass, plainToInstance } from 'class-transformer';
import { SummonersClass } from './summoners.cls.enum';

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
  @ApiQuery({
    name: 'cls',
    enum: SummonersClass,
    description: 'Class of summoner',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: SummonersPublicInfoResponseDto,
    isArray: true,
  })
  async getPublicSummonerInfos(
    @Query('userAddress') userAddress: string,
    @Query('cls', new ParseEnumPipe(SummonersClass)) cls: SummonersClass,
  ): Promise<SummonersPublicInfoResponseDto[]> {
    const queryFilter = {};
    if (userAddress) queryFilter['userAddress'] = userAddress;
    if (cls) queryFilter['cls'] = cls;
    const summoners = await this.summonersService.getSummonerInfos(queryFilter);
    return plainToInstance(SummonersPublicInfoResponseDto, summoners);
  }
}
