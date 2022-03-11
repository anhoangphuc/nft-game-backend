import { MongoMemoryServer} from "mongodb-memory-server";
import {MongooseModule, MongooseModuleOptions} from "@nestjs/mongoose";
export function randomMinMax(minNumber: number, maxNumber: number) {
  //Include minValue, exclude maxValue
  const diff = maxNumber - minNumber;
  return Math.floor(Math.random() * diff) + minNumber;
}

export function valueNullOrUndefined(x: unknown) {
  return (x === null || x === undefined);
}

let mongod: MongoMemoryServer;
export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) => MongooseModule.forRootAsync({
  useFactory: async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    return {
      uri: mongoUri,
      ...options,
    }
  }
});

export const closeInMongodConnection = async () => {
  if (mongod) await mongod.stop();
}
