import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { abortOnError: false });
    app.enableCors({
      origin: 'http://localhost:5173', // <== Add your frontend's URL here
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept, Authorization,App-Token', // <== Add necessary headers
      credentials: true, // <== If you use cookies or authentication headers
    });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
