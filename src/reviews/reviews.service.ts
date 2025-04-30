import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import {
  CollectionReference,
  DocumentData,
  Query,
  Timestamp,
} from '@google-cloud/firestore';
import { IReview, IReviewResponse } from '_validators/reviews/reviews.model';
import { faker } from '@faker-js/faker';

@Injectable()
export class ReviewsService {
  constructor(private readonly db: FirebaseService) {}

  // Get all reviews or reviews for a specific movie
  public async getReviews(movieId?: string): Promise<any[] | any> {
    try {
      let query: CollectionReference<DocumentData> | Query<DocumentData> =
        this.db.firestore.collection('reviews').orderBy('createdAt', 'desc');

      if (movieId) {
        query = query.where('movieId', '==', movieId);
      }

      const snapshot = await query.get();
      const reviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return reviews;
    } catch (error) {
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }
  }

  // Create a new review
  public async createReview({
    payload,
  }: {
    payload: IReview;
  }): Promise<IReviewResponse> {
    const { movieId, reviewText } = payload;

    try {
      const review: IReview = {
        movieId,
        reviewText,
        username: faker.internet.username(), // Default username, can be changed later
        createdAt: Timestamp.now(),
      };

      const docRef = await this.db.firestore.collection('reviews').add(review);

      const newDoc = await docRef.get();
      const data = newDoc.data();

      if (!data) {
        throw new Error('Document data is undefined');
      }

      return {
        id: newDoc.id,
        movieId: data.movieId,
        username: data.username,
        reviewText: data.reviewText,
        createdAt: data.createdAt,
      };
    } catch (error) {
      throw new Error(`Failed to create review: ${error.message}`);
    }
  }
}
