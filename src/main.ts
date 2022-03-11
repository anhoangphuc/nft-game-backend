require("dotenv").config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {INestApplication} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as fs from "fs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await _setupSwagger(app);
  await app.listen(3000);
}

async function _setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle("Game NFT service")
    .setDescription("Swagger documentation for Game NFT Apis")
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  try {
    const outputSwaggerFile = `${process.cwd()}/output-specs/api-game-nft.json`;
    fs.writeFileSync(outputSwaggerFile, JSON.stringify(document, null, 2), { encoding: 'utf8'});
  } catch (e) {
    console.warn(`Could not save swagger docs into file: ${e}`);
  }
  SwaggerModule.setup(`/docs/`, app, document, {
    customSiteTitle: 'GameNFT Services',
  });
}
bootstrap();
