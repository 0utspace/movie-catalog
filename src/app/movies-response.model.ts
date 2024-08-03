import { Movie } from "./movie.model";

export interface MoviesResponse {
  [key: string]: Movie[]
}
