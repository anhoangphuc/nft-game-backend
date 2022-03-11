import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummonersModule } from './modules/summoners/summoners.module';
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    SummonersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
