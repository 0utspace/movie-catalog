import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment } from '../interfaces/comment';
import { Movie } from '../movie.model';
import { MoviesResponse } from '../movies-response.model';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent {
  type: string = '';
  id: string = '';
  url: string = '';
  movies: any;
  movie: any;
  comments: Comment[] = [];
  userName: string = '';
  userReview: string = '';
  userRating: number = 0;
  private moviesResponse!: MoviesResponse;

  constructor(private route: ActivatedRoute, private http: HttpClient, private db: AngularFireDatabase) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.params['type'];
    this.id = this.route.snapshot.params['id'];

    if (this.type === 'trending') {
      this.url = 'https://angular-tv-series-catalog-default-rtdb.europe-west1.firebasedatabase.app/movies/trending-movies.json';
    }
    if (this.type === 'theatre') {
      this.url = 'https://angular-tv-series-catalog-default-rtdb.europe-west1.firebasedatabase.app/movies/theatre-movies.json';
    }
    if (this.type === 'popular') {
      this.url = 'https://angular-tv-series-catalog-default-rtdb.europe-west1.firebasedatabase.app/movies/popular-movies.json';
    }

    this.getMovie();

    const storedComments = localStorage.getItem('movieComments');
    if (storedComments) {
      this.comments = JSON.parse(storedComments) as Comment[];
    };
  }

  getMovie() {
    this.http.get<MoviesResponse>(this.url).subscribe((movies) => {
      console.log('movieS from http:', movies);
      console.log('this.movies in component is:', this.movies)
      this.moviesResponse = movies;
      const moviesArray: Movie[] = [];

      if (movies) {

        for (const key in movies) {
          if (movies.hasOwnProperty(key)) {
            // console.log('data inside obj', movies[key])
            // moviesArray.push(...movies)
            console.log('AHHHHAAAAaa')
            moviesArray.push(...movies[key])
          }
        }
      }

      this.movies = moviesArray;
      let index = this.movies.findIndex(
        (movie: { id: string }) => movie.id == this.id
      );
      if (index > -1) {
        this.movie = this.movies[index];
        console.log('movies', this.movie)
      }
    });
  };

  createComment():Comment {
    const newComment: Comment = {
      author: this.userName,
      rating: this.userRating,
      text: this.userReview,
      published_on: new Date()
    };

    return newComment
  };

  AddNewComment(comment: Comment, moviesResponse: MoviesResponse): void {

    for (const key in moviesResponse) {
      if (moviesResponse.hasOwnProperty(key)) {
        for (let i = 0; i < moviesResponse[key].length; i++) {
          if (moviesResponse[key][i].id === +this.id) {
            console.log('this movie is: ', moviesResponse[key][i])
            if (moviesResponse[key][i].reviews) {
              console.log('Revies in movie', moviesResponse[key][i].reviews)
            } else {
              moviesResponse[key][i].reviews = [];
              console.log('else')
            }
            moviesResponse[key][i].reviews!.push(comment)
            console.log('current array', moviesResponse[key][i].reviews)
          }
        }
      }
    }
  };

  resetForm() {
    this.userName = '';
    this.userReview = '';
    this.userRating = 0;
  }

  onSubmit() {

      const newComment: Comment = this.createComment();
      this.AddNewComment(newComment, this.moviesResponse);
      this.resetForm();
      this.postComment(this.id, this.type);
  };

  onUserRate($event: any) {
    console.log('event data', $event)
    this.userRating = $event;
  };

  getMovieTypeForHttp(type: string): string {
    let typeForRequest: string = '';
    if (this.type === 'trending') {
      typeForRequest = 'trending-movies';
    }
    if (this.type === 'theatre') {
      typeForRequest = 'theatre-movies';
    }
    if (this.type === 'popular') {
      typeForRequest = 'popular-movies';
    }

    return typeForRequest;
  };

  postComment(movieId: string, type: string) {
    const typeForRequest: string = this.getMovieTypeForHttp(type);
    const url = `https://angular-tv-series-catalog-default-rtdb.europe-west1.firebasedatabase.app/movies/${typeForRequest}/${movieId}.json`;
    console.log('url for request', url)
    this.http.get(url).subscribe(response => {
      console.log('response:', response)
    })
  }
};

