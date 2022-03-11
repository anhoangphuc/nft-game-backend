import { Module } from '@nestjs/common';
import { SummonersController } from './summoners.controller';

@Module({
  controllers: [SummonersController]
})
export class SummonersModule {}
