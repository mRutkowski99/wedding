import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'booth-and-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-12" id="booth">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl mx-auto text-center">
        <!-- Photo Booth -->
        <div class="md:col-span-6 bg-surface rounded-xl p-8 border border-primary/20 flex flex-col">
          <span
            class="material-symbols-outlined text-4xl text-primary mb-4"
            style="font-variation-settings: 'FILL' 0;"
            >camera_enhance</span
          >
          <h2 class="text-headline-md text-primary mb-2 italic">Fotobudka</h2>
          <div class="inline-block bg-primary/10 px-4 py-1 rounded-full mb-4">
            <span class="text-label-sm text-on-surface-variant">Czynna od 18:00 do 22:00</span>
          </div>
          <p class="text-body-md text-on-surface-variant">
            Zabierzcie śmieszne gadżety, zróbcie pamiątkowe zdjęcie i wklejcie je do naszej księgi
            gości!
          </p>
        </div>
        <!-- Drink Bar -->
        <div
          class="md:col-span-6 bg-surface rounded-xl p-8 border border-primary/20 flex flex-col"
          id="menu"
        >
          <div class="text-center mb-6">
            <span
              class="material-symbols-outlined text-4xl text-primary mb-2"
              style="font-variation-settings: 'FILL' 0;"
              >local_bar</span
            >
            <h2 class="text-headline-md  text-primary italic">Drink Bar</h2>
          </div>
          <ul class="space-y-4 flex-grow">
            @for (drink of drinks; track drink.name) {
              <li class="flex justify-between items-end border-b border-tertiary/20 pb-2">
                <span class="text-body-md text-on-surface font-semibold">{{ drink.name }}</span>
                <span class="text-body-md text-tertiary italic text-sm">{{
                  drink.ingredients
                }}</span>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class BoothAndBar {
  drinks = [
    { name: 'Mojito', ingredients: 'Rum, mięta, limonka' },
    { name: 'Aperol Spritz', ingredients: 'Aperol, Prosecco, soda' },
    { name: 'Whisky Sour', ingredients: 'Burbon, cytryna, syrop' },
    { name: 'Virgin Mojito', ingredients: 'Bezalkoholowe' },
  ];
}
