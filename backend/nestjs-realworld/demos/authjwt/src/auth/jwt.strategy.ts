import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // 提供从请求中提取`JWT`的方法
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 配置是否忽略到期
            ignoreExpiration: false,
            // 密钥
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        return {
            id: payload.sub,
            username: payload.username,
        };
    }
}
