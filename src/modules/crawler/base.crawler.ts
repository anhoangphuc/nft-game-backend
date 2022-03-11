import { Injectable } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { getLatestBlock } from '../../shares/provider.util';
import { sleep } from '../../shares/utils';

export interface ICrawlerParams {
  crawlerName?: string;
  blocksPerBatch?: number;
  tickTimeout?: number;
  nextTickWait?: number;
  delayedBlock?: number;
}
@Injectable()
export abstract class BaseCrawler {
  protected _crawlerName: string;
  protected _blocksPerBatch = 100;
  protected _tickTimeout = 30000;
  protected _nextTickWait = 2000;
  protected _delayedBlock = 6;

  private _countBlockNotChange = 1;
  private _preBlockNum: number;
  protected constructor(protected readonly crawlerService: CrawlerService) {}
  public async start(param: ICrawlerParams) {
    this.setupParams(param);
    if (!this._crawlerName) throw new Error(`Invalid crawler name`);
    while (true) await this.tick();
  }

  protected async tick() {
    try {
      const crawlerDoc = await this.crawlerService.getCrawler(this._crawlerName);
      this._handleNotifyWhenBlockNotChange(crawlerDoc.lastBlock);
      const fromBlock = crawlerDoc.lastBlock + 1;
      const targetBlock = fromBlock + this._blocksPerBatch - 1;

      const latestBlock = await getLatestBlock();
      const toBlock = Math.min(targetBlock, latestBlock - this._delayedBlock);
      if (toBlock < fromBlock) {
        throw new Error(`RPC error: get old data toBlock: ${toBlock} < fromBlock: ${fromBlock}`);
      }
      if (fromBlock <= toBlock) {
        await this.processBlocks(fromBlock, toBlock);
        await this.crawlerService.saveCrawler(this._crawlerName, toBlock);
      }
    } catch (e) {
      console.error(e);
    }
    await sleep(this._nextTickWait);
  }
  protected abstract processBlocks(fromBlock: number, toBlock: number);
  private _handleNotifyWhenBlockNotChange(blockNum: number) {
    if (this._preBlockNum === blockNum) {
      this._countBlockNotChange++;
    } else {
      this._countBlockNotChange = 1;
    }
    this._preBlockNum = blockNum;
    console.error(`Crawler ${this._crawlerName} crawler at ${this._preBlockNum} in ${this._countBlockNotChange} times`);
  }
  protected setupParams(param?: ICrawlerParams) {
    if (param?.crawlerName) this._crawlerName = param.crawlerName;
    if (param?.blocksPerBatch) this._blocksPerBatch = param.blocksPerBatch;
    if (param?.nextTickWait) this._nextTickWait = param.nextTickWait;
    if (param?.tickTimeout) this._tickTimeout = param.tickTimeout;
    if (param?.delayedBlock) this._delayedBlock = param.delayedBlock;
  }
}
