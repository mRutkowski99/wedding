import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <main class="max-w-container-max mx-auto">
      <router-outlet />
    </main>

    <footer
      class="bg-footer-bg w-full py-12 flex flex-col items-center justify-center space-y-4 px-12 mt-12 mb-0"
    >
      <div class="text-center space-y-2">
        <p class="text-headline-md text-2xl text-footer-text italic">
          Dziękujemy, że jesteście z nami!
        </p>
        <p class="font-label-sm text-footer-text uppercase tracking-widest">20 czerwca 2026</p>
      </div>
      <p class="font-body-md italic text-xs text-center text-footer-text">Paulina & Miłosz</p>
    </footer>
  `,

  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {}
