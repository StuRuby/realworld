import { Injectable, Module } from '@nestjs/common';
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
