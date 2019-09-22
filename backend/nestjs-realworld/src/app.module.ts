import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [TypeOrmModule.forRoot(), ArticleModule, TagModule, UserModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
    constructor(private readonly connection: Connection) {}
}
