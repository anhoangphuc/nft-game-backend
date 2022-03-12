import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
export function randomMinMax(minNumber: number, maxNumber: number) {
  //Include minValue, exclude maxValue
  const diff = maxNumber - minNumber;
  return Math.floor(Math.random() * diff) + minNumber;
}

export function valueNullOrUndefined(x: unknown) {
  return x === null || x === undefined;
}

let mongod: MongoMemoryServer;
export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

export const closeInMongodConnection = async () => {
  if (mongod) await mongod.stop();
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const callWithChunk = async (events: any[], callback: (array: any[]) => Promise<any> | any, chunk_size = 50) => {
  if (!Array.isArray(events)) {
    console.log('must be an array');
    return;
  }
  const eventsLength = events.length;
  for (let index = 0; index < eventsLength; index += chunk_size) {
    const eventsChunk = events.slice(index, index + chunk_size);
    console.log(`processing ${callback.name} ${index + eventsChunk.length}/${eventsLength}`);

    await callback(eventsChunk);
  }
};
