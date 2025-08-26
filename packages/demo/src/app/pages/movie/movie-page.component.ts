import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Character {
  id: string;
  name: string;
}

interface Film {
  title: string;
  characterConnection: {
    characters: Character[];
  };
}

interface Query {
  film: Film;
}

@Component({
  selector: 'author-page',
  template: `
    @if (film$ | async; as film) {
      <h1>Characters seen in {{ film.title }}</h1>
      <ul>
        @for (character of film.characterConnection.characters; track character.id) {
          <li>
            {{ character.name }}
          </li>
        }
      </ul>
    } @else {
      <p>Loading ...</p>
    }
    <a routerLink="/movie">Back to movies</a>
  `,
  standalone: true,
  imports: [RouterLink, AsyncPipe],
})
export class MoviePageComponent implements OnInit {
  film$!: Observable<Film>;

  constructor(
    private readonly apollo: Apollo,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.film$ = this.apollo
      .watchQuery<
        Query,
        {
          id: string;
        }
      >({
        query: gql`
          query FilmCharacters($id: ID) {
            film(id: $id) {
              title
              characterConnection {
                characters {
                  id
                  name
                }
              }
            }
          }
        `,
        variables: {
          id: this.route.snapshot.paramMap.get('id')!,
        },
      })
      .valueChanges.pipe(map(result => result.data!.film));
  }
}
