import * as local from './local.json';

const env = process.env.APP_ENV || 'local';
const configs = { local };

const config: Config = configs[env];
config.env = env;

export interface Config {
  env: string;
  configCrawler: {
    fromBlock: number;
    crawlerGroup: number;
  };
}

export default config;
