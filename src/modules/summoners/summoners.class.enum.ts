import {randomMinMax} from "../../shares/utils";

export enum SummonersClass {
  FIGHTER = "fighter",
  FARMER = "farmer",
  HEALER = "healer",
}

export function getARandomSummonerClass(): SummonersClass {
  const seed = randomMinMax(0, 3);
  if (seed === 0) return SummonersClass.FIGHTER;
  else if (seed === 1) return SummonersClass.FARMER;
  else return SummonersClass.HEALER;
}