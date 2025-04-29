import { createZodDto } from 'nestjs-zod';
import { reviewResponseSchema, reviewSchema } from './reviews.schema';

export class ReviewDto extends createZodDto(reviewSchema) {}

export class ReviewResponseDto extends createZodDto(reviewResponseSchema) {}
