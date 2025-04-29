import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseConfig } from '_config/firebase.config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleDestroy {
  private readonly firebaseApp: admin.app.App;
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private configService: ConfigService) {
    const firebaseConfig = this.configService.get<FirebaseConfig>('firebase');

    if (!firebaseConfig) {
      this.logger.error('Firebase configuration is missing');
      throw new Error('Firebase configuration is missing');
    }

    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig?.projectId,
          clientEmail: firebaseConfig?.clientEmail,
          privateKey: firebaseConfig?.privateKey,
        }),
        databaseURL: firebaseConfig?.databaseURL,
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  async onModuleDestroy() {
    try {
      await this.firebaseApp.delete();
      this.logger.log('Firebase Admin SDK disconnected successfully');
    } catch (error) {
      this.logger.error('Error disconnecting from Firebase:', error);
    }
  }

  // Expose Firebase services
  // "get" This is a TypeScript/JavaScript `getter` - a special method that allows you to access a class property like a regular property rather than calling it as a method.
  get firestore(): admin.firestore.Firestore {
    return this.firebaseApp.firestore();
  }

  // Original method using the getter
  public async getCollectionRecords(
    collectionName: string,
    limit?: number,
    startAfter?: FirebaseFirestore.DocumentSnapshot,
  ) {
    try {
      let query: admin.firestore.Query<admin.firestore.DocumentData> =
        this.firestore.collection(collectionName);

      if (limit) {
        query = query.limit(limit);
      }

      if (startAfter) {
        query = query.startAfter(startAfter);
      }

      const snapshot = await query.get();

      return {
        docs: snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        total: snapshot.size,
      };
    } catch (error) {
      this.logger.error('Error fetching collection records:', error);
      throw error;
    }
  }
}
