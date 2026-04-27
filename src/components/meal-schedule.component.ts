import { Component } from '@angular/core';

@Component({
  selector: 'meal-schedule',
  template: `
    <section class="py-12" id="schedule">
      <div class="text-center mb-12">
        <h2 class="text-headline-md text-primary italic">Plan Posiłków</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        @for (meal of meals; track meal.time) {
          <div class="rounded-lg p-6 border border-primary/20 relative overflow-hidden bg-surface">
            <div class="relative z-10">
              <div class="text-label-sm text-primary uppercase tracking-widest mb-2">
                {{ meal.time }}
              </div>
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
      time: '16:00',
      title: 'Uroczysty Obiad',
      description: 'Rosół z domowym makaronem, wybór mięs pieczonych z zestawem surówek',
    },
    {
      time: '19:00',
      title: 'Pierwsze Danie Gorące',
      description: 'Krem z białych warzyw z grzankami i prażonymi migdałami',
    },
    {
      time: '21:00',
      title: 'Drugie Danie Gorące',
      description: 'Polędwiczki wieprzowe w sosie kurkowym z opiekanymi ziemniakami',
    },
    {
      time: '23:00',
      title: 'Trzecie Danie Gorące',
      description: 'Tradycyjny barszcz czerwony z pasztecikami z ciasta francuskiego',
    },
  ];
}
