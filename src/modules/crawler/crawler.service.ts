import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Crawlers, CrawlersDocument } from './crawlers.schema';
import { Model } from 'mongoose';
import config from '../../config';

@Injectable()
export class CrawlerService {
  constructor(@InjectModel(Crawlers.name) private crawlersModel: Model<CrawlersDocument>) {}

  async getCrawler(crawlerName: string): Promise<CrawlersDocument> {
    const crawler = await this.crawlersModel.findOne({
      crawlerName,
      crawlerGroup: config.configCrawler.crawlerGroup,
    });
    if (!crawler) {
      const newCrawler = new this.crawlersModel({
        crawlerName,
        crawlerGroup: config.configCrawler.crawlerGroup,
        lastBlock: config.configCrawler.fromBlock,
      });
      await newCrawler.save();
    }
    return crawler;
  }

  async saveCrawler(crawlerName: string, lastBlock: number): Promise<void> {
    await this.crawlersModel.updateOne(
      {
        crawlerName,
        crawlerGroup: config.configCrawler.crawlerGroup,
      },
      { $set: { lastBlock } },
    );
    console.log(`CrawlersService saveCrawler: ${crawlerName} lastBlock: ${lastBlock}`);
  }
}
