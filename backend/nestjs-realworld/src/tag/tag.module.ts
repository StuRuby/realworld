import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TagEntity])],
})
export class TagModule {}
