import { registerAs } from '@nestjs/config';

export interface OmdbConfig {
  apiKey: string;
  baseUrl: string;
}

export default registerAs('omdb', () => ({
  apiKey: process.env.OMDB_API_KEY,
  baseUrl: process.env.OMDB_BASE_URL || 'http://www.omdbapi.com',
}));
