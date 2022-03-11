import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Crawlers, CrawlersSchema } from './crawlers.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Crawlers.name, schema: CrawlersSchema }])],
  providers: [CrawlerService],
})
export class CrawlerModule {}
