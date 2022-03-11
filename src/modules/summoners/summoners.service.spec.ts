import { Test, TestingModule } from '@nestjs/testing';
import { SummonersService } from './summoners.service';
import { Summoners, SummonersSchema } from './summoners.schema';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../shares/utils';
import { MongooseModule } from '@nestjs/mongoose';
import { SummonersClass } from './summoners.cls.enum';

describe('SummonersService', () => {
  let service: SummonersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Summoners.name, schema: SummonersSchema },
        ]),
      ],
      providers: [SummonersService],
    }).compile();

    service = module.get<SummonersService>(SummonersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it(`Create a random summoner success`, async () => {
    const summoner = await service.createRandomSummoner('0x123', 1);
    expect(summoner).toBeDefined();
    expect(summoner.summonerId).toEqual(1);
    expect(summoner.userAddress).toEqual('0x123');
    expect(summoner.strength).toBeGreaterThanOrEqual(1);
    expect(summoner.strength).toBeLessThan(100);
    expect(summoner.power).toBeGreaterThanOrEqual(1);
    expect(summoner.power).toBeLessThan(100);
    expect([
      SummonersClass.FARMER,
      SummonersClass.FIGHTER,
      SummonersClass.HEALER,
    ]).toContain(summoner.cls);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
