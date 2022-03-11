import {Prop, Schema} from "@nestjs/mongoose";
import {Transform} from "class-transformer";
import {ObjectId} from "mongoose";
import {SummonersClass} from "./summoners.class.enum";

@Schema({ timestamps: true })
export class Summoners {
  @Transform(({ value}) => value.toString())
  _id: ObjectId;

  @Prop({
    type: Number,
    unique: true,
    index: true,
  })
  summonerId: number;

  @Prop({
    enum: SummonersClass,
  })
  cls: SummonersClass;

  @Prop({
    type: Number,
  })
  strength: number;

  @Prop({
    type: Number,
  })
  power: number;
}