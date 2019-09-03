import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
    transform(value: string, metdata: ArgumentMetadata): number {
        const val = parseInt(value, 10);
        if(isNaN(val)) {
            throw new BadRequestException('Validation failed');
        }
        return val;
    }
}