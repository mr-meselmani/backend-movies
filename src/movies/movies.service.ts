import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OmdbConfig } from '_config/omdb.config';
import { IMovieResponse } from '_validators/movies/movies.model';
import axios from 'axios';
import { ReviewsService } from 'src/reviews/reviews.service';

@Injectable()
export class MoviesService {
  constructor(
    private configService: ConfigService,
    private reviewsService: ReviewsService,
  ) {}

  // Get movie by title
  public async getMovieByTitle(title: string): Promise<IMovieResponse> {
    const omdbConfig = this.configService.get<OmdbConfig>('omdb');

    if (!omdbConfig) {
      throw new Error(
        'OMDB configuration is not defined in the environment variables',
      );
    }

    console.log('apiKey: ', omdbConfig.apiKey);
    console.log('baseUrl: ', omdbConfig.baseUrl);

    const encodedTitle = encodeURIComponent(title);

    console.log('encodedTitle: ', encodedTitle);

    const movies = await axios.get(
      `${omdbConfig.baseUrl}?apikey=${omdbConfig.apiKey}&t=${encodedTitle}&plot=full`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!movies.data) {
      throw new Error('No data found for the given title');
    }

    if (typeof movies.data !== 'object') {
      throw new Error('Invalid data format received from OMDB API');
    }

    // Get the reviews for the movie
    const reviews = await this.getMovieReviews(movies.data.imdbID);

    return {
      movie: movies.data,
      reviews: reviews,
    };
  }

  // Get movie by ID
  public async getMovieReviews(movieId: string) {
    const reviews = await this.reviewsService.getReviews(movieId);

    if (!reviews) {
      return [];
    }

    return reviews;
  }
}
