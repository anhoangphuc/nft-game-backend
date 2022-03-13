import { Test, TestingModule } from '@nestjs/testing';
import { SummonersController } from './summoners.controller';
import { rootMongooseTestModule } from '../../shares/utils';
import { MongooseModule } from '@nestjs/mongoose';
import { Summoners, SummonersSchema } from './summoners.schema';
import { SummonersService } from './summoners.service';
import { SummonerNotExistException } from './summoners.exceptions';

describe('SummonersController', () => {
  let controller: SummonersController;
  let service: SummonersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Summoners.name, schema: SummonersSchema }]),
      ],
      controllers: [SummonersController],
      providers: [SummonersService],
    }).compile();

    controller = module.get<SummonersController>(SummonersController);
    service = module.get<SummonersService>(SummonersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('summoner get info correct', async () => {
    await service.createRandomSummoner('0x123', 1);
    const summoner = await controller.getPublicSummonerInfo(1);
    expect(summoner.summonerId).toEqual(1);
    expect(summoner.userAddress).toEqual('0x123');
  });

  it('get summonerInfos correct', async () => {
    const address = '0x123';
    await service.createRandomSummoner(address, 1);
    await service.createRandomSummoner(address, 2);
    const summoners = await controller.getPublicSummonerInfos(address);
    expect(summoners.length).toEqual(2);
    expect(new Set(summoners.map((x) => x.summonerId))).toContain(1);
    expect(new Set(summoners.map((x) => x.summonerId))).toContain(2);
  });

  it(`Throw exception when get incorrect summonerId`, async () => {
    await expect(controller.getPublicSummonerInfo(1)).rejects.toThrowError(SummonerNotExistException);
  });
});
