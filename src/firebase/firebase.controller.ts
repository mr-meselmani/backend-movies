import { Controller, Get } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FIREBASE_PATHS } from '_paths/firebase';

@Controller(FIREBASE_PATHS.PATH_PREFIX)
export class FirebaseController {
  constructor(private firebaseService: FirebaseService) {}

  // Get doc records
  @Get(FIREBASE_PATHS.GET_DOC_RECORDS)
  public async getDocRecords() {
    return await this.firebaseService.getCollectionRecords('reviews');
  }
}
