import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { Logger } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { abortOnError: false });
    app.enableCors({
      origin: 'http://localhost:5173', // <== Add your frontend's URL here
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept, Authorization,App-Token', // <== Add necessary headers
      credentials: true, // <== If you use cookies or authentication headers
    });

  // Apply global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Request logger middleware
  app.use((req: any, res: any, next: any) => {
    const logger = new Logger('HTTP');
    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers['user-agent'] || '';
    const requestTime = new Date().toISOString();

    res.on('finish', () => {
      const { statusCode } = res;
      const logMessage = {
        timestamp: requestTime,
        method,
        url: originalUrl,
        statusCode,
        userAgent,
        ip: ip || 'unknown',
      };

      if (statusCode >= 400) {
        logger.error(JSON.stringify(logMessage));
      } else {
        logger.log(JSON.stringify(logMessage));
      }
    });

    next();
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Nest App API')
    .setDescription('User management API with JWT authentication')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addGlobalParameters({
      name: 'app-token',
      description: 'Application token for authentication',
      required: true,
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
