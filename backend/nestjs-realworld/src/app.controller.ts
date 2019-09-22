import { Get, Controller } from '@nestjs/common';

@Controller('app')
export class AppController {
    @Get()
    root(): string {
        return 'Hello Nestjs';
    }
}
