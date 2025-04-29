import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewDto, ReviewResponseDto } from '_validators/reviews/reviews.dto';
import { CustomSwaggerDecorator } from '_decorators/swagger.decorator';
import { IApiResponse } from '_validators/global/global.model';
import { IReviewResponse } from '_validators/reviews/reviews.model';
import { ZodSerializerDto } from 'nestjs-zod';
import { REVIEWS_PATHS } from '_paths/reviews';

@Controller(REVIEWS_PATHS.PATH_PREFIX)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Get all reviews
  @CustomSwaggerDecorator({
    summary: 'Get all reviews',
    resDec: {
      responseSchema: ReviewResponseDto.schema,
    },
    statusOK: true,
  })
  @Get()
  @ZodSerializerDto(ReviewResponseDto)
  public async getReviews(): Promise<IApiResponse<IReviewResponse[]>> {
    return {
      message: 'success',
      data: await this.reviewsService.getReviews(),
    };
  }

  // Create a new review
  @CustomSwaggerDecorator({
    summary: 'Create a review',
    bodyDec: {
      payloadSchema: ReviewDto.schema,
    },
    createdDec: true,
  })
  @Post()
  @ZodSerializerDto(ReviewResponseDto)
  public async createReview(
    @Body() payload: ReviewDto,
  ): Promise<IApiResponse<IReviewResponse>> {
    return {
      message: 'success',
      data: await this.reviewsService.createReview({ payload }),
    };
  }

  // Get reviews by movie ID
  @CustomSwaggerDecorator({
    summary: 'Get reviews by movie ID',
    resDec: {
      responseSchema: ReviewResponseDto.schema,
    },
    statusOK: true,
  })
  @Get(REVIEWS_PATHS.GET_REVIEWS_BY_MOVIE)
  public async getReviewsByMovieId(
    @Query('id') movieId: string,
  ): Promise<IApiResponse<IReviewResponse>> {
    return {
      message: 'success',
      data: await this.reviewsService.getReviews(movieId),
    };
  }
}
