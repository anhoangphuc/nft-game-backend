import { Injectable } from '@nestjs/common';
import { BaseCrawler } from './base.crawler';
import { CrawlerName } from '../crawler-name.enum';
import { CrawlerService } from '../crawler.service';
import { getContractAllEvents, getContractInstance } from '../../../shares/provider.util';
import config from '../../../config';
import * as abi from '../../../shares/contracts/abi/Summoner.json';
import { callWithChunk, valueNullOrUndefined } from '../../../shares/utils';
import { ethers, Event } from 'ethers';
import { SummonerCrawlerUtilsService } from '../services/summoner-crawler-utils.service';

@Injectable()
export class SummonerCrawlerService extends BaseCrawler {
  protected _crawlerName = CrawlerName.Summoner;
  private iface: ethers.utils.Interface;
  constructor(
    private readonly summonerCrawlerUtilsService: SummonerCrawlerUtilsService,
    protected readonly crawlerService: CrawlerService,
  ) {
    super(crawlerService);
    this.iface = new ethers.utils.Interface(abi);
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
    switch (event.event) {
      case 'Transfer':
        await this._handleTransferEvent(event);
        break;
      default:
        console.info(`Dont handle event ${event.event}`);
        break;
    }
  }

  private async _handleTransferEvent(event: Event) {
    const tx = event.transactionHash;
    const { blockNumber, logIndex } = event;
    const logDescription = this.iface.parseLog(event);
    const { from, to, tokenId } = logDescription.args;
    const eventCreated = await this.summonerCrawlerUtilsService.createEventSummonerTransfer({
      summonerId: tokenId.toNumber(),
      fromAddress: from,
      toAddress: to,
      tx,
      blockNumber,
      logIndex,
      blockTimestamp: Date.now(),
    });
    if (eventCreated?.isResolved === false) {
      const summoner = await this.summonerCrawlerUtilsService.createNewSummoner(to, tokenId.toNumber());
      if (!valueNullOrUndefined(summoner))
        await this.summonerCrawlerUtilsService.updateResolvedSummonerTransfer(tx, blockNumber, logIndex);
    }
  }
}
