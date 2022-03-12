// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { BootstrapConsole } from 'nestjs-console';
import { AppModule } from './app.module';
import { sleep } from './shares/utils';

const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: true,
});

bootstrap.init().then(async (app) => {
  try {
    await app.init();
    await bootstrap.boot();
    process.exit(0);
  } catch (e) {
    console.error(`Something went wrong. Process will be restart shortly... with error: ${e.toString()}`);
    await sleep(30000);
    process.exit(1);
  }
});
