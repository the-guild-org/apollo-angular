import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Film {
  id: number;
  title: string;
  director: string;
  releaseDate: string;
}

interface Query {
  allFilms: { films: Film[] };
}

@Component({
  selector: 'movies-page',
  template: `
    @if (films$ | async; as films) {
      <ul>
        @for (film of films; track film.id) {
          <li>
            <a [routerLink]="['/movie', film.id]">{{ film.title }}</a>
            by {{ film.director }} ({{ film.releaseDate }})
          </li>
        }
      </ul>
    } @else {
      <p>Loading ...</p>
    }
  `,
  standalone: true,
  imports: [RouterLink, AsyncPipe],
})
export class MoviesPageComponent implements OnInit {
  films$!: Observable<Film[]>;

  constructor(private readonly apollo: Apollo) {}

  ngOnInit() {
    this.films$ = this.apollo
      .watchQuery<Query>({
        query: gql`
          query AllFilms {
            allFilms {
              films {
                id
                title
                director
                releaseDate
              }
            }
          }
        `,
      })
      .valueChanges.pipe(map(result => result.data!.allFilms.films)) as any;
  }
}
