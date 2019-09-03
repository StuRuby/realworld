import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import * as Joi from '@hapi/joi';

@Injectable()
export class ValidationPipe implements PipeTransform {
    constructor(private readonly schema: object) { }
    transform(value: any, metadata: ArgumentMetadata) {
        const { error } = Joi.validate(value, this.schema);
        if(error) {
            throw new BadRequestException('Validation failed');
        }
        return value;
    }
}
