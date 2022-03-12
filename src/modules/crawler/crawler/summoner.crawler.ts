import { Injectable } from '@nestjs/common';
import { BaseCrawler } from './base.crawler';
import { CrawlerName } from '../crawler-name.enum';
import { CrawlerService } from '../crawler.service';
import { getContractAllEvents, getContractInstance } from '../../../shares/provider.util';
import config from '../../../config';
import * as abi from '../../../shares/contracts/abi/Summoner.json';
import { callWithChunk } from '../../../shares/utils';
import { Event } from 'ethers';
import { SummonerEvent } from '../../../shares/events/summoner.event';
import { SummonerCrawlerUtilsService } from '../services/summoner-crawler-utils.service';

@Injectable()
export class SummonerCrawlerService extends BaseCrawler {
  protected _crawlerName = CrawlerName.Summoner;
  constructor(
    private readonly summonerCrawlerUtilsService: SummonerCrawlerUtilsService,
    protected readonly crawlerService: CrawlerService,
  ) {
    super(crawlerService);
  }
  protected async processBlocks(fromBlock: number, toBlock: number) {
    console.log(`processBlocks: ${fromBlock.toLocaleString()} -> ${toBlock.toLocaleString()}`);
    const contract = getContractInstance(config.addresses.summoner, abi as any);
    const events = await getContractAllEvents(contract, fromBlock, toBlock);
    await callWithChunk(events, this._processEventWithChunk);
  }

  private _processEventWithChunk = async (events: Event[]) => {
    try {
      await Promise.all(events.map(async (event) => this.processOneEvent(event)));
    } catch (e) {
      throw e;
    }
  };

  private async processOneEvent(event: Event) {
    await this._createHistoryRecord(event);
  }

  private async _createHistoryRecord(event: Event) {
    const tx = event.transactionHash;
    const [eventHash, from, to, tokenId] = event.topics;
    console.log(`eventHash ${eventHash} ${from} ${to} ${tokenId}`);
    const { blockNumber, logIndex } = event;
    const baseHistory = {
      blockNumber,
      logIndex,
      tx,
    };
    const eventName = event.event;
    switch (eventName) {
      case SummonerEvent.Transfer:
        await this.summonerCrawlerUtilsService.createEventSummonerTransfer({
          summonerId: +tokenId,
          fromAddress: from,
          toAddress: to,
          ...baseHistory,
          blockTimestamp: Date.now(),
        });
    }
  }
}
