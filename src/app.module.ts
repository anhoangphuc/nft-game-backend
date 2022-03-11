import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummonersModule } from './modules/summoners/summoners.module';

@Module({
  imports: [SummonersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
