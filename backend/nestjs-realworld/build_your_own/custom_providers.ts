import { Injectable, Module, Inject } from '@nestjs/common';
import { UserService } from '../src/user/user.service';
/**
 * Value providers
 */

const mockUserService = {

};

@Module({
    imports: [UserService],
    providers: [
        {
            provide: UserService,
            useValue: mockUserService,
        },
    ],
})
export class AppModule { }

@Injectable()
export class CatsService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService
    ) { }
}