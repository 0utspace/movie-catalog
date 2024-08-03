import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators';
import { of, pipe } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  trendingMovies: any;
  theatreMovies: any;
  popularMovies: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getTrendingMovies();
    this.getPopularMovies();
    this.getTheatreMovies();
  };

  getTrendingMovies() {
    this.http.get<any[]>('https://angular-tv-series-catalog-default-rtdb.europe-west1.firebasedatabase.app/movies/trending-movies.json').pipe(
      map((responseData) => {
        const trendingMoviesArray: any[] = [];

        if (responseData) {

          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              trendingMoviesArray.push(...responseData[key])
            }
          }
        }
        console.log('trending movies array from map pipe:', trendingMoviesArray)
        return trendingMoviesArray
      }),
      switchMap(movies => {

        if (!movies || movies.length < 1) {
          // If the response is an empty array, call the fallback method
          return this.getFallbackTrendingMovies();
        } else {
          // If the response is valid, return the movies
          return of(movies);
        }
      }),
      catchError(() => {
        return this.getFallbackTrendingMovies();
      })
    ).subscribe({
      next: movies => {
        this.trendingMovies = movies;
        console.log('Trending movies:', movies);
      },
      error: error => {
        console.log('before error')
        console.error('Error:', error);
        console.log('after error')
      }
    });
  }

  getTheatreMovies() {
    this.http.get<any[]>('https://angular-tv-series-catalog-default-rtdb.europe-west1.firebasedatabase.app/movies/theatre-movies.json').pipe(
        map((responseData) => {
          const theaterMoviesArray: any[] = [];

          if (responseData) {

            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                theaterMoviesArray.push(...responseData[key])
              }
            }
          }

          console.log('trending Theater movies array from map pipe:', theaterMoviesArray)
          return theaterMoviesArray
        }),
        switchMap((movies) => {
          if (!movies || movies.length < 1 ) {

            return this.getFallbackTheatreMovies();
          } else {

            return of(movies)
          }
        }),
        catchError((error) => {
          console.log('error from getTheater', error)

          return this.getFallbackTheatreMovies();
        })
      )
      .subscribe({
        next: movies => {
          this.theatreMovies = movies
        },
        error: error => console.log('Error is', error)
      });
  };

  getPopularMovies() {
    this.http.get<any[]>('https://angular-tv-series-catalog-default-rtdb.europe-west1.firebasedatabase.app/movies/popular-movies.json')
    .pipe(
      map(responseData => {
        const popularMoviesArray: any[] = [];

        if (responseData) {
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              popularMoviesArray.push(...responseData[key])
            }
          }
        }

        console.log('trending Popular movies array from map pipe:', popularMoviesArray)
        return popularMoviesArray
      }),
      switchMap(moviesArray => {
        if (!moviesArray || moviesArray.length < 1) {

          return this.getFallbackPopularMovies();
        } else {
          console.log('array of movies POPULAR', moviesArray)

          return of(moviesArray);
        }
      })
    )
    .subscribe({
      next: movies => {
        this.popularMovies = movies;
      },
      error: error => {
        console.log('error while fetch popular movies: ', error);
      }
    });
  };

  goToMovie(type: string, id: string) {
    this.router.navigate(['movie', type, id]);
  };

  getFallbackTrendingMovies() {
    return this.http.get('http://localhost:4200/assets/data/trending-movies.json').pipe(
      tap(movies => {
        this.trendingMovies = movies;
        console.log('Fallback movies:', movies);
      }),
      switchMap(movies => {
        // Return an Observable with the POST request
        return this.http.post(
          'https://angular-tv-series-catalog-default-rtdb.europe-west1.firebasedatabase.app/movies/trending-movies.json',
          JSON.stringify(movies)
        ).pipe(
          tap(response => {
            console.log('Response after POST:', response);
          })
        );
      }),
      catchError(error => {
        console.error('Error in fallback method:', error);
        return of([]);
      })
    );
  };

  getFallbackTheatreMovies() {
    return this.http.get('http://localhost:4200/assets/data/theatre-movies.json')
      .pipe(
        tap(movies => {
          this.theatreMovies = movies;
        }),
        switchMap(movies => {
          return this.http.post('https://angular-tv-series-catalog-default-rtdb.europe-west1.firebasedatabase.app/movies/theatre-movies.json', movies)
          .pipe(
            tap(() => {
              console.log('Theater movies was uploaded to Data Base');
            })
          )
        }),
        catchError(error => {
            console.error('Error in fallback method:', error);
            return of([]);
          })
        )
  };

  getFallbackPopularMovies() {
    return this.http
      .get('http://localhost:4200/assets/data/popular-movies.json')
      .pipe(
        tap((movies) => {
          console.log('movies of Popular category - ', movies)
          this.popularMovies = movies;
        }
      ),
      switchMap(movies => {
        return this.http.post('https://angular-tv-series-catalog-default-rtdb.europe-west1.firebasedatabase.app/movies/popular-movies.json', movies)
      }),
      catchError(error => {
        console.log('error :', error);

        return of([])
      }))
  };

  getMovies() {};
}
