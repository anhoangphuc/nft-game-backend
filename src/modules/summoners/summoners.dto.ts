import {Exclude, Expose} from "class-transformer";
import {IsEnum, IsNumber} from "class-validator";
import {Schema} from "mongoose";
import {SummonersClass} from "./summoners.cls.enum";
import {ApiProperty} from "@nestjs/swagger";

@Exclude()
export class SummonersPublicInfoResponseDto {
  @Expose()
  @ApiProperty({
    type: Number,
  })
  summonerId: number;

  @Expose()
  @IsEnum(SummonersClass)
  @ApiProperty({
    enum: SummonersClass,
  })
  cls: SummonersClass;

  @Expose()
  @ApiProperty({
    type: Number,
  })
  strength: number;

  @Expose()
  @ApiProperty({
    type: Number,
  })
  power: number;
}