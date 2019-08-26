import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { SECRET } from '../config';
import { UserRO } from './user.interface';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';

// 通过`Injectable`注解一个类，使其变成一个提供者。
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async findOne(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const findOneOptions = {
            email: loginUserDto.email,
            password: crypto.createHmac('sha256', loginUserDto.password).digest('hex'),
        };
        return await this.userRepository.findOne(findOneOptions);
    }

    async create(dto: CreateUserDto): Promise<UserRO> {
        const { username, email, password } = dto;
        const qb = await getRepository(UserEntity)
            .createQueryBuilder('user')
            .where('user.username= :username', { username })
            .orWhere('user.email= :email', { email });
        const user = await qb.getOne();

        if(user) {
            const errors = { username: 'Username and email must be unique' };
            throw new HttpException({ message: `Input data validation failed`, errors }, HttpStatus.BAD_REQUEST);
        }

        const newUser = new UserEntity();
        newUser.username = username;
        newUser.email = email;
        newUser.password = password;
        // newUser.articles = [];

        const errors = await validate(newUser);
        if(errors.length > 0) {
            const _errors = { username: 'User input is not valid.' };
            throw new HttpException({ message: 'Input data validation failed', _errors }, HttpStatus.BAD_REQUEST);
        } else {
            const savedUser = await this.userRepository.save(newUser);
            return this.buildUserRO(savedUser);
        }
    }

    async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
        const toUpdate = await this.userRepository.findOne(id);
        delete toUpdate.password;
        delete toUpdate.favorites;

        const updated = Object.assign(toUpdate, dto);
        return await this.userRepository.save(updated);
    }

    async delete(email: string): Promise<DeleteResult> {
        return await this.userRepository.delete({ email });
    }

    async findById(id: number): Promise<UserRO> {
        const user = await this.userRepository.findOne(id);
        if(!user) {
            const errors = { User: 'Not found' };
            throw new HttpException({ errors }, 401);
        }
        return this.buildUserRO(user);
    }

    async findByEmail(email: string): Promise<UserRO> {
        const user = await this.userRepository.findOne({ email });
        return this.buildUserRO(user);
    }

    private buildUserRO(user: UserEntity) {
        const userRO = {
            username: user.username,
            email: user.email,
            bio: user.bio,
            token: this.generateJWT(user),
            image: user.image,
        };
        return { user: userRO };
    }

    private generateJWT(user) {
        const now = new Date();
        const exp = new Date(now);
        exp.setDate(now.getDate() + 60);

        return jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            exp: exp.getTime() / 1000,
        }, SECRET);
    }
}
