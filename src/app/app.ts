import { Component } from '@angular/core';
import { HeroComponent } from '../components/hero.component';
import { PhotoUpload } from '../components/photo-upload.component';
import { BotanicalDivider } from '../components/botanical-divider.component';
import { MealSchedule } from '../components/meal-schedule.component';
import { BoothAndBar } from '../components/booth-and-bar.component';
import { Footer } from '../components/footer.component';

@Component({
  selector: 'app-root',
  imports: [HeroComponent, PhotoUpload, BotanicalDivider, MealSchedule, BoothAndBar, Footer],
  templateUrl: './app.html',
})
export class App {}
