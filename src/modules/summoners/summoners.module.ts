import { Module } from '@nestjs/common';
import { SummonersController } from './summoners.controller';
import { SummonersService } from './summoners.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Summoners, SummonersSchema} from "./summoners.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Summoners.name, schema: SummonersSchema }]),
  ],
  controllers: [SummonersController],
  providers: [SummonersService]
})
export class SummonersModule {}
