import { z } from 'zod';
import { IReview, IReviewResponse } from './reviews.model';
import { generalResponse } from '_validators/global/global.schema';
import { IApiResponse } from '_validators/global/global.model';

export const reviewSchema: z.ZodSchema<IReview> = z
  .object({
    movieId: z.string().min(1, 'Movie ID is required'),
    reviewText: z.string().min(1, 'Review text is required'),
  })
  .strip();

export const reviewResponseSchema: z.ZodSchema<
  IApiResponse<IReviewResponse[]>
> = generalResponse(
  z.array(
    z.object({
      id: z.string(),
      movieId: z.string(),
      username: z.string(),
      reviewText: z.string(),
      createdAt: z.date(),
    }),
  ),
);
