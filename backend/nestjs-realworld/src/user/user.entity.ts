import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { IsEmail, Validate } from 'class-validator';
import * as crypto from 'crypto';
import { ArticleEntity } from '../article/article.entity';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    bio: string;

    @Column()
    image: string;

    @Column()
    password: string;

    @BeforeInsert()
    hashPassword() {
        this.password = crypto.createHmac('sha256', this.password).digest('hex');
    }
    // 指定依赖关系，`type`指定依赖的实体，第二个参数指定实体中对应的属性依赖
    @OneToMany(type => ArticleEntity, article => article.author)
    articles: ArticleEntity[];

    // 描述多对多的关系。 一个用户可能有多个喜爱的文章，一个文章也可能被多个用户喜爱
    @ManyToMany(type => ArticleEntity)
    @JoinTable()
    favorites: ArticleEntity[];
}
