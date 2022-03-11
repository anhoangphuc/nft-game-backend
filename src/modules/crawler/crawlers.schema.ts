import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Crawlers {
  @Prop({
    type: String,
    unique: true,
  })
  crawlerName: string;

  @Prop({
    type: String,
  })
  crawlerGroup: string;

  @Prop({
    type: Number,
  })
  lastBlock: number;
}

export type CrawlersDocument = Crawlers & Document;
export const CrawlersSchema = SchemaFactory.createForClass(Crawlers);
