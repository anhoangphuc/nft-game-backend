import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Crawlers, CrawlersSchema } from './crawlers.schema';
import { CrawlerConsoleService } from './crawler.console';
import { SummonerCrawlerService } from './crawler/summoner.crawler';
import { SummonerCrawlerUtilsService } from './services/summoner-crawler-utils.service';
import { EventTransferSummoner, EventTransferSummonerSchema } from './schemas/summoner-transfer.event.schema';
import { ConsoleModule } from 'nestjs-console';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Crawlers.name, schema: CrawlersSchema },
      { name: EventTransferSummoner.name, schema: EventTransferSummonerSchema },
    ]),
    ConsoleModule,
  ],
  providers: [CrawlerService, CrawlerConsoleService, SummonerCrawlerService, SummonerCrawlerUtilsService],
})
export class CrawlerModule {}
