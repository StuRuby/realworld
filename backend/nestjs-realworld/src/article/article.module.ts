import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ArticleEntity, CommentEntity])],
})
export class ArticleModule {}
