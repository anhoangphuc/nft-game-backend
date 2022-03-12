import { Command, Console } from 'nestjs-console';
import { SummonerCrawlerService } from './crawler/summoner.crawler';
import { CrawlerName } from './crawler-name.enum';

@Console()
export class CrawlerConsoleService {
  constructor(private readonly summonerCrawlerService: SummonerCrawlerService) {}

  @Command({
    command: 'start_crawler <crawlerName>',
    description: 'start crawler',
  })
  async start(crawlerName: string) {
    console.log(`startCrawler ${crawlerName}`);
    switch (crawlerName) {
      case CrawlerName.Summoner:
        await this.summonerCrawlerService.start();
        break;
      default:
        console.error(`${crawlerName} does not exists`);
        break;
    }
  }
}
