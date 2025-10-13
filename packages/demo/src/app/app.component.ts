import { Apollo, gql, onlyComplete } from 'apollo-angular';
import { Subject } from 'rxjs';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import type { ObservableQuery } from '@apollo/client/core';

@Component({
  selector: 'app-root',
  template: `
    <main>
      <header>
        <h1><a routerLink="/">Star Wars</a></h1>
      </header>
      <router-outlet></router-outlet>
    </main>
  `,
  standalone: true,
  imports: [RouterOutlet, RouterLink],
})
export class AppComponent {}
