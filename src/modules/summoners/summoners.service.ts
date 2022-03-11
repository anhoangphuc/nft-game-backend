import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Summoners, SummonersDocument} from "./summoners.schema";
import {ClientSession, Model} from 'mongoose';
import {randomMinMax} from "../../shares/utils";
import {getARandomSummonerClass} from "./summoners.class.enum";
@Injectable()
export class SummonersService {
  constructor(
    @InjectModel(Summoners.name) private summonersModel: Model<SummonersDocument>,
  ) {}

  async startTransaction(): Promise<ClientSession> {
    const session = await this.summonersModel.startSession();
    session.startTransaction();
    return session;
  }

  async createRandomSummoner(userAddress: string, summonerId: number): Promise<SummonersDocument> {
    try {
      return await this.summonersModel.create({
        summonerId,
        strength: randomMinMax(1, 100),
        power: randomMinMax(1, 100),
        cls: getARandomSummonerClass(),
      });
    } catch (e) {
      console.error(`Create summoner ${summonerId} for ${userAddress}\n ${e}`);
    }
  }
}
