import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BaseEvent {
  @Prop({
    type: String,
  })
  tx: string;

  @Prop({
    type: Number,
  })
  blockNumber: number;

  @Prop({
    type: Number,
  })
  logIndex: number;

  @Prop({
    type: Number,
  })
  blockTimestamp: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  isResolved?: boolean;
}
