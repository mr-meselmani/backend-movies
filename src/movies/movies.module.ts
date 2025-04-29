import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  imports: [ReviewsModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
