import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark topbar">
      <div class="container">
        <a class="navbar-brand" routerLink="/productos">SportStock · Angular</a>
        <a class="btn btn-sm btn-light fw-semibold" routerLink="/productos/nuevo">Nuevo producto</a>
      </div>
    </nav>

    <main class="container page-wrap">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.css'
})
export class App {}
