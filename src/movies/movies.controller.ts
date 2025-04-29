import { Controller, Get, Logger, Query } from '@nestjs/common';
import { MOVIES_PATHS } from '_paths/movies';
import { MoviesService } from './movies.service';
import { IApiResponse } from '_validators/global/global.model';
import { IMovieResponse } from '_validators/movies/movies.model';

@Controller(MOVIES_PATHS.PATH_PREFIX)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Get movie by title
  @Get(MOVIES_PATHS.GET_MOVIE_BY_TITLE)
  public async getMovieByTitle(
    @Query('title') title: string,
  ): Promise<IApiResponse<IMovieResponse>> {
    Logger.debug('🚀 ~ MoviesController ~ getMovieByTitle ~ title:', title);

    return {
      message: 'success',
      data: await this.moviesService.getMovieByTitle(title),
    };
  }
}
