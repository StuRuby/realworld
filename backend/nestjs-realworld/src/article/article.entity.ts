import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from './comment.entity';

@Entity('article')
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @Column()
    title: string;

    @Column({ default: '' })
    description: string;

    @Column({ default: '' })
    body: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updated = new Date();
    }

    // 使用`simple-array`列类型，将原始数组值存储在单个字符串列中。所有值以逗号分隔
    @Column('simple-array')
    tagList: string[];

    @Column({ default: 0 })
    favoriteCount: number;

    @ManyToOne(type => UserEntity, user => user.articles)
    author: UserEntity;

    @OneToMany(type => CommentEntity, comment => comment.article)
    comments: CommentEntity[];
}
