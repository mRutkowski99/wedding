import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'credits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-8" id="credits">
      <div class="text-center mb-6">
        <h2 class="text-headline-md text-primary italic">
          O niezapomniane wspomniania naszych gości dbają
        </h2>
      </div>

      <ul
        class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 w-fit mx-auto list-none p-0 m-0"
      >
        @for (credit of credits; track credit.name) {
          <li class="flex items-center gap-3">
            <span
              class="material-symbols-outlined text-2xl text-primary shrink-0"
              style="font-variation-settings: 'FILL' 0;"
              >{{ credit.icon }}</span
            >
            <span class="text-label-sm text-on-surface-variant shrink-0 w-20">{{
              credit.type
            }}</span>
            <a
              class="text-body-md text-primary font-semibold no-underline hover:text-tertiary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary truncate"
              [href]="credit.url"
              [attr.aria-label]="credit.name + ' (otwiera w nowej karcie)'"
              target="_blank"
              rel="noopener noreferrer"
              >{{ credit.name }}</a
            >
          </li>
        }
      </ul>
    </section>
  `,
})
export class Credits {
  credits = [
    {
      icon: 'sound_detection_loud_sound',
      type: 'DJ',
      name: 'Piotrek Jędrych',
      url: 'https://www.instagram.com/dj_wodzirej_piotrekjedrych',
    },
    {
      icon: 'photo_camera',
      type: 'Fotograf',
      name: 'The Moon',
      url: 'https://www.instagram.com/atelier_themoon',
    },
    {
      icon: 'local_bar',
      type: 'Drink Bar',
      name: 'Coctail Atelier',
      url: 'https://cocktail-atelier.pl/',
    },
    {
      icon: 'tablet_camera',
      type: 'Fotobudka',
      name: 'Fotosbudka',
      url: 'https://www.fotosbudka.pl/',
    },
  ];
}
