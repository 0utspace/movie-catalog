import { Comment } from '../app/interfaces/comment';

export interface Movie {
  cover: string,
  id: number,
  name: string,
  rating: number,
  reviews?: Comment[];
}
