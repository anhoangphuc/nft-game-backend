import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Transform} from "class-transformer";
import {ObjectId, Document} from "mongoose";
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

export type SummonersDocument = Summoners & Document;
export const SummonersSchema = SchemaFactory.createForClass(Summoners);
SummonersSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

SummonersSchema.set('toObject', { virtuals: true });
SummonersSchema.set('toJSON', { virtuals: true });
