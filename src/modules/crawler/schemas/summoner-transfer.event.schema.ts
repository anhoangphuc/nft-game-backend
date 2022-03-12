import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEvent } from '../../../shares/base-event.schema';

@Schema({ timestamps: true, collection: 'events-transfer-summoner' })
export class EventTransferSummoner extends BaseEvent {
  @Prop({
    type: Number,
  })
  summonerId: number;

  @Prop({
    type: String,
    index: true,
  })
  fromAddress: string;

  @Prop({
    type: String,
  })
  toAddress: string;
}

export const EventTransferSummonerSchema = SchemaFactory.createForClass(EventTransferSummoner);
EventTransferSummonerSchema.index({ tx: 1, blockNumber: 1, logIndex: 1 }, { unique: true });
