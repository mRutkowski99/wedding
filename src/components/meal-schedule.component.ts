import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'meal-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-12" id="schedule">
      <div class="text-center mb-12">
        <h2 class="text-headline-md text-primary italic">Plan Posiłków</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        @for (meal of meals; track $index) {
          <div class="rounded-lg p-6 border border-primary/20 relative overflow-hidden bg-surface">
            <div class="relative z-10">
              <h3 class="text-headline-md text-2xl text-on-surface mb-2">{{ meal.title }}</h3>
              <p class="text-body-md text-tertiary">
                {{ meal.description }}
              </p>
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class MealSchedule {
  meals = [
    {
      title: 'Uroczysty Obiad',
      description:
        'Rosół z makaronem, mix mięs pieczonych z ziemniakami lub kluskami i zestawem surówek',
    },
    {
      title: 'Deser',
      description: 'Tarta jabłkowa z lodami',
    },
    {
      title: 'Pierwsza Kolacja',
      description: 'Polędwiczki wieprzowe w sosie borowikowym oraz risotto',
    },
    {
      title: 'Druga Kolacja',
      description: 'Mix roladek z pieczonymi półksiężycami w ziołach i surówką',
    },
    {
      title: 'Tort',
      description: 'Tort wiśniowo-orzechowy',
    },
    {
      title: 'Trzecia Kolacja',
      description: 'Barszcz czerwony z pierogiem',
    },
  ];
}
