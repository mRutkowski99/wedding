import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="min-h-[618px] flex flex-col justify-center items-center text-center py-section-gap relative"
    >
      <div class="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0">
        <img
          alt="Botanical background"
          class="w-full h-full object-cover"
          data-alt="soft botanical eucalyptus leaf pattern background fading into white airy organic wedding texture"
          ngSrc="hero-bg.png"
          fill
          priority
        />
      </div>
      <div class="relative z-10 space-y-6">
        <img
          ngSrc="logo.png"
          alt="Hero image"
          width="150"
          height="150"
          priority
          class="block mx-auto"
        />
        <h1 class="text-display-lg text-primary mb-4 italic">Witajcie na naszym weselu!</h1>
        <p class="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Dziękujemy, że jesteście z nami w tym wyjątkowym dniu. Cieszcie się każdą chwilą, twórzcie
          wspomnienia i bawcie się do białego rana.
        </p>
      </div>
    </section>
  `,
  imports: [NgOptimizedImage],
})
export class HeroComponent {}
