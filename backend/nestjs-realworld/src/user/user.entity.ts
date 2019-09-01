import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import * as crypto from 'crypto';
import { ArticleEntity } from '../article/article.entity';

@Entity('user')
export class UserEntity {
    // 创建自动生成的列
    @PrimaryGeneratedColumn()
    id: number;

    // 列数据类型
    @Column()
    username: string;

    @Column()
    @IsEmail()
    email: string;

    @Column({ default: '' })
    bio: string;

    @Column({ default: '' })
    image: string;

    @Column()
    password: string;

    @BeforeInsert()
    hashPassword() {
        this.password = crypto.createHmac('sha256', this.password).digest('hex');
    }

    @ManyToMany(type => ArticleEntity)
    @JoinTable()
    favorites: ArticleEntity[];

    @OneToMany(type => ArticleEntity, article => article.author)
    articles: ArticleEntity[];
}
