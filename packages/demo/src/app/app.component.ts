import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

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
