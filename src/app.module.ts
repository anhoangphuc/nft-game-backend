import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummonersModule } from './modules/summoners/summoners.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CrawlerModule } from './modules/crawler/crawler.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI), SummonersModule, CrawlerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
