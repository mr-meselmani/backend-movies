import { Timestamp } from '@google-cloud/firestore';

export interface IReview {
  movieId: string;
  username?: string;
  reviewText: string;
  createdAt?: Timestamp | Date;
}

export interface IReviewResponse {
  id: string;
  movieId: string;
  username: string;
  reviewText: string;
  createdAt: Timestamp | Date;
}
