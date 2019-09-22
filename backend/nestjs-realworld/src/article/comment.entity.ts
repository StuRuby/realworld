import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity('comment')
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    body: string;

    @ManyToOne(type => ArticleEntity, article => article.comments)
    article: ArticleEntity;
}
