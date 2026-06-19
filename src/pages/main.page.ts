import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from '../components/hero.component';
import { PhotoUpload } from '../components/photo-upload.component';
import { BotanicalDivider } from '../components/botanical-divider.component';
import { MealSchedule } from '../components/meal-schedule.component';
import { BoothAndBar } from '../components/booth-and-bar.component';
import { Footer } from '../components/footer.component';
import { Credits } from '../components/credits.component';

@Component({
  selector: 'main-page',
  template: `
    <hero />
    <div class="px-gutter md:px-margin-page">
      <photo-upload />
      <botanical-divider />
      <meal-schedule />
      <botanical-divider />
      <booth-and-bar />
      <credits />
    </div>

    <app-footer />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroComponent, PhotoUpload, BotanicalDivider, MealSchedule, BoothAndBar, Footer, Credits],
})
export default class MainPage {}
