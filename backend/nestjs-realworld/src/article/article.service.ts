import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';
import { UserEntity } from '../user/user.entity';
import { CreateArticleDto } from './dto';
import { ArticleRO, ArticlesRO, CommentsRO } from './article.interface';
import slug from 'slug';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async findAll(query): Promise<ArticlesRO> {
        const qb = await getRepository(ArticleEntity)
            .createQueryBuilder('article')
            .leftJoinAndSelect('article.author', 'author');
        qb.where('1=1');

        if('tag' in query) {
            qb.andWhere('article.tagList LIKE :tag', { tag: `%${query.tag}%` });
        }

        if('author' in query) {
            const author = await this.userRepository.findOne({ username: query.author });
            qb.andWhere('article.authorId=:id', { id: author.id });
        }

        if('favorited' in query) {
            const author = await this.userRepository.findOne({ username: query.favorited });
            const ids = author.favorites.map(el => el.id);
            qb.andWhere('article.authorId IN (:ids)', { ids });
        }

        qb.orderBy('article.created', 'DESC');

        const articlesCount = await qb.getCount();

        if('limit' in query) {
            qb.limit(query.limit);
        }

        if('offset' in query) {
            qb.offset(query.offset);
        }

        const articles = await qb.getMany();
        return {
            articles, articlesCount,
        };
    }

    async findOne(where): Promise<ArticleRO> {
        const article = await this.articleRepository.findOne(where);
        return { article };
    }

    async addComment(slugName: string, commentData): Promise<ArticleRO> {
        let article = await this.articleRepository.findOne({ slug: slugName });
        const comment = new CommentEntity();
        comment.body = commentData.body;
        article.comments.push(comment);
        await this.commentRepository.save(comment);
        article = await this.articleRepository.save(article);
        return { article };
    }

    async deleteComment(slugName: string, id: string): Promise<ArticleRO> {
        let article = await this.articleRepository.findOne({ slug: slugName });
        const comment = await this.commentRepository.findOne(id);
        const deleteIndex = article.comments.findIndex(item => item.id === comment.id);
        if(deleteIndex >= 0) {
            const deleteComments = article.comments.splice(deleteIndex, 1);
            await this.commentRepository.delete(deleteComments[0].id);
            article = await this.articleRepository.save(article);
        }
        return { article };
    }
}
