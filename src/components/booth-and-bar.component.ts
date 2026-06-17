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
            <h2 class="text-headline-md  text-primary italic mb-2">Drink Bar</h2>
            <div class="w-full inline-block bg-primary/10 px-4 py-1 rounded-full mb-4">
              <span class="text-label-sm text-on-surface-variant">Czynny do 02:00</span>
            </div>
          </div>
          <ul class="space-y-4 flex-grow">
            @for (drink of drinks; track drink.name) {
              <li class="flex justify-between items-center gap-6 border-b border-tertiary/20 pb-2">
                <span class="text-body-md text-on-surface font-semibold text-left">{{
                  drink.name
                }}</span>
                <span class="text-body-md text-tertiary italic text-sm text-right">{{
                  drink.ingredients
                }}</span>
              </li>
            }
          </ul>

          <h3 class="text-headline-sm text-primary italic mb-4 mt-6">Bezalkoholowe</h3>
          <ul class="space-y-4 flex-grow">
            @for (drink of nonAlcoholicDrinks; track drink.name) {
              <li class="flex justify-between items-center gap-6 border-b border-tertiary/20 pb-2">
                <span class="text-body-md text-on-surface font-semibold text-left">{{
                  drink.name
                }}</span>
                <span class="text-body-md text-tertiary italic text-sm text-right">{{
                  drink.ingredients
                }}</span>
              </li>
            }
          </ul>

          <p class="text-body-md text-tertiary italic  text-center mt-6">
            Zachęcamy do spróbowania twistów w wersji molekularnej
          </p>
        </div>
      </div>
    </section>
  `,
})
export class BoothAndBar {
  drinks = [
    { name: 'Mojito', ingredients: '%, mięta, limonka' },
    { name: 'Pear Collins', ingredients: '%, mus gruszka, limonka, rozmaryn' },
    { name: 'Cosmopolitan', ingredients: '%, mus truskawka, limonka, żurawina' },
    { name: 'Grapepiroska', ingredients: '%, limonka, pomarańcza, grapefruit' },
    { name: 'Cuba Libre', ingredients: '%, limonka, pepsi' },
    { name: 'Sex on the Beach', ingredients: '%, kokos, pomarańcza, żurawina, brzoskwinia' },
    { name: 'Amaretto Sour ', ingredients: '%, amaretto, limonka, bitter' },
    { name: 'Yellow Lady Fizz', ingredients: '%, mango, orient, limonka' },
    { name: 'Bellini', ingredients: '%, Brzoskwinia, soda' },
    { name: 'Aperol Spritz', ingredients: '%, Aperol, soda' },
    { name: 'Hugo', ingredients: '% Czarny bez, limonka, soda' },
  ];

  nonAlcoholicDrinks = [
    { name: 'Virgin Mojito', ingredients: 'Mięta, limonka' },
    { name: 'Cucumber fresh', ingredients: 'czarny bez, ogórek, limonka, soda' },
    { name: 'Classic lemonade', ingredients: 'cytrusy' },
  ];
}
