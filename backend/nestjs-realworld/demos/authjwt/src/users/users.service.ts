import { Injectable } from '@nestjs/common';

export interface User {
    id: string;
    name: string;
    password: string;
    age: number;
    job: string;
}

@Injectable()
export class UsersService {
    private readonly users: User[];
    constructor() {
        this.users = [
            {
                id: '001',
                name: 'gujiashu',
                age: 32,
                password: 'gujiashu123',
                job: 'web engineer',
            },
            {
                id: '002',
                name: 'shixingya',
                password: 'shixingya456',
                age: 26,
                job: 'web engineer',
            },
            {
                id: '003',
                name: 'zhufeng',
                password: 'zhufeng789',
                age: 30,
                job: 'web engineer',
            },
            {
                id: '004',
                name: 'yuanyongxin',
                password: 'yuanyongxin789',
                age: 28,
                job: 'web engineer',
            },
        ];
    }

    findOne(name: string) {
        return this.users.find(user => user.name === name);
    }
}
