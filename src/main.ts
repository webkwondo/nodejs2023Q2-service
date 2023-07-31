import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { load as yamlLoad } from 'js-yaml';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const SWAGGER_DOCS_ENDPOINT = '/doc';

  const app = await NestFactory.create(AppModule);

  // const swaggerConfig = new DocumentBuilder()
  //   .setTitle('Home Library Service Documentation')
  //   .setDescription('Home Library REST Service Documentation')
  //   .setVersion('1.0.0')
  //   .addTag('REST Service')
  //   .build();

  // const document = SwaggerModule.createDocument(app, swaggerConfig);

  // const document = JSON.parse();

  try {
    const contents = (
      await readFile(join(process.cwd(), 'doc', 'api.yaml'))
    ).toString('utf-8');
    const document = yamlLoad(contents) as OpenAPIObject;
    SwaggerModule.setup(SWAGGER_DOCS_ENDPOINT, app, document);
  } catch (error) {
    console.info(error);
  }

  await app.listen(PORT);
}

bootstrap();
