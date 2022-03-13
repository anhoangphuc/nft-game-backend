import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventTransferSummoner, EventTransferSummonerDocument } from '../schemas/summoner-transfer.event.schema';
import { ClientSession, Model } from 'mongoose';
import { SummonersService } from '../../summoners/summoners.service';
import { valueNullOrUndefined } from '../../../shares/utils';

@Injectable()
export class SummonerCrawlerUtilsService {
  constructor(
    @InjectModel(EventTransferSummoner.name) private summonerTransferModel: Model<EventTransferSummonerDocument>,
    private readonly summonersService: SummonersService,
  ) {}

  async startTransaction(): Promise<ClientSession> {
    const session = await this.summonerTransferModel.startSession();
    await session.startTransaction();
    return session;
  }
  async createEventSummonerTransfer(event: EventTransferSummoner): Promise<EventTransferSummonerDocument> {
    try {
      return await this.summonerTransferModel.create(event);
    } catch (e) {
      if (e.message.includes('E11000 duplicate key error collection'))
        return this.summonerTransferModel.findOne({
          tx: event.tx,
          blockNumber: event.blockNumber,
          logIndex: event.logIndex,
        });
      return null;
    }
  }

  async createNewSummoner(address: string, summonerId: number) {
    try {
      return await this.summonersService.createRandomSummoner(address, summonerId);
    } catch (e) {
      if (e.message.includes('E11000 duplicate key error collection')) return;
      console.error(`Create eventSummonerTransfer failed ${e.toString()}`);
      return null;
    }
  }

  async updateResolvedSummonerTransfer(tx: string, blockNumber: number, logIndex: number) {
    try {
      await this.summonerTransferModel.findOneAndUpdate(
        {
          tx,
          blockNumber,
          logIndex,
        },
        { isResolved: true },
      );
    } catch (e) {
      console.error(`Update resolved error for ${tx} ${blockNumber} ${logIndex}, ${e}`);
    }
  }
}
