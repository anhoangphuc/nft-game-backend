import { BaseException } from '../../shares/exceptions';
import { HttpStatus } from '@nestjs/common';

export class SummonerNotExistException extends BaseException {
  constructor(summonerId: number) {
    super(`Summoner ${summonerId} not exists`, HttpStatus.BAD_REQUEST);
  }
}
