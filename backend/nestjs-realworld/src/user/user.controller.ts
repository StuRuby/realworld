import { Get, Post, Body, Put, Delete, Param, Controller, UsePipes } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { UserRO } from './user.interface';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { User } from './user.decorator';

export class UserController {
    constructor(private readonly userService: UserService) { }
    @Get('user')
    async findMe(@User('email') email: string): Promise<UserRO> {
        return await this.userService.findByEmail(email);
    }

    @Put('user')
    async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto) {
        return await this.userService.update(userId, userData);
    }

    @Post('users')
    async create(@Body('user') userData: CreateUserDto) {
        return this.userService.create(userData);
    }

    @Delete('users/:slug')
    async delete(@Param() params) {
        return await this.userService.delete(params.slug);
    }

    @Post('users/login')
    async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserRO> {
        const user = await this.userService.findOne(loginUserDto);
        const errors = { User: 'Not found' };
        if(!user) {
            throw new HttpException({ errors }, 401);
        }
        const token = await this.userService.generateJWT(user);
        const { email, username, bio, image } = user;
        const resultUser = { email, username, token, bio, image };
        return { user: resultUser };
    }
}
