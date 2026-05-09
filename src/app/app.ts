import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <main class="mx-auto w-full max-w-container-max">
      <router-outlet />
    </main>
  `,

  imports: [RouterOutlet],
  host: {
    class: 'flex min-h-dvh flex-col gap-12',
  },
})
export class App {}
