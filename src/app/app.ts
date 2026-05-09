import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <main class="mx-auto w-full max-w-container-max">
      <router-outlet />
    </main>

    <footer
      class="bg-footer-bg mb-0 flex w-full shrink-0 flex-col items-center justify-center space-y-4 px-12 py-12"
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
  host: {
    class: 'flex min-h-dvh flex-col gap-12',
  },
})
export class App {}
