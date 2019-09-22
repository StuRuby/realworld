import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const appOptions = { cors: true };
    const app = await NestFactory.create(AppModule, appOptions);
    app.setGlobalPrefix('api');

    const options = new DocumentBuilder()
        .setTitle('NestJS realworld example app')
        .setDescription('The real world api description')
        .setVersion('0.1.0')
        .setBasePath('api')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs', app, document);

    await app.listen(1127);
}

bootstrap();
