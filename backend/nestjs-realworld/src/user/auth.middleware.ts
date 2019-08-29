import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../config';
import { UserService } from './user.service';

/**
 * `JSON Web Token`应用场景：
 * 1.浏览器将用户名和密码以`post`请求的方式发送给服务器.
 * 2.服务器接受后验证通过，用一个密钥生成一个`JWT`.
 * 3.服务器将这个生成的`JWT`返回给浏览器
 * 4.浏览器将`JWT`包含在`authorization header`里面，然后发送请求给服务器
 * 5.服务器可以在`JWT`中提取用户相关信息，进行验证.
 * 6.服务器验证完成后，发送响应结果给浏览器
 */

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeaders = req.headers.authorization;
        if(authHeaders) {
            const token = authHeaders;
            const decoded: any = jwt.verify(token, SECRET);
            const user = await this.userService.findById(decoded.id);

            if(!user) {
                throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
            }
            (req as any).user = user.user;
            next();
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }
}
