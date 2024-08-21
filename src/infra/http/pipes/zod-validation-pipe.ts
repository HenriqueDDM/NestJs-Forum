import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}

// import { BadRequestException } from '@nestjs/common';
// import { ZodSchema } from 'zod';

// export class ZodValidationPipe {
//   constructor(private schema: ZodSchema) {}

//   transform(value, metadata) {
//     try {
//       const parsedValue = this.schema.parse(value);
//       return parsedValue;
//     } catch (error) {
//       throw new BadRequestException('Validation failed');
//     }
//   }
// }
