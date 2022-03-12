import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventTransferSummoner, EventTransferSummonerDocument } from '../schemas/summoner-transfer.event.schema';
import { Model } from 'mongoose';

@Injectable()
export class SummonerCrawlerUtilsService {
  constructor(
    @InjectModel(EventTransferSummoner.name) private summonerTransferModel: Model<EventTransferSummonerDocument>,
  ) {}

  async createEventSummonerTransfer(event: EventTransferSummoner) {
    try {
      await this.summonerTransferModel.create(event);
      console.log(`Create eventSummonerTransfer success`);
      console.log(event);
    } catch (e) {
      if (e.message.includes('E11000 duplicate key error collection')) return;
      console.error(`Create eventSummonerTransfer failed ${e.toString()}`);
    }
  }
}