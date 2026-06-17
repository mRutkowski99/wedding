import { IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';

type Photo = { id: string; url: string };

@Component({
  selector: 'photo-lightbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Podgląd zdjęcia"
      (keydown)="onKeydown($event)"
    >
      <button
        #closeButton
        type="button"
        class="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-inverse-on-surface/10 text-inverse-on-surface transition-colors hover:bg-inverse-on-surface/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse-on-surface"
        aria-label="Zamknij"
        (click)="close()"
      >
        <span class="material-symbols-outlined text-2xl" aria-hidden="true">close</span>
      </button>

      @if (hasPrevious()) {
        <button
          type="button"
          class="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-inverse-on-surface/10 text-inverse-on-surface transition-colors hover:bg-inverse-on-surface/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse-on-surface"
          aria-label="Poprzednie zdjęcie"
          (click)="goPrevious()"
        >
          <span class="material-symbols-outlined text-3xl" aria-hidden="true">chevron_left</span>
        </button>
      }

      <figure class="flex max-h-full max-w-full flex-col items-center gap-4">
        <img
          [ngSrc]="currentPhoto().url"
          [alt]="'Zdjęcie ' + (activeIndex() + 1) + ' z ' + photos().length"
          width="1200"
          height="900"
          priority
          class="max-h-[calc(100vh-8rem)] max-w-[calc(100vw-8rem)] object-contain"
        />
        <figcaption class="sr-only" aria-live="polite">
          Zdjęcie {{ activeIndex() + 1 }} z {{ photos().length }}
        </figcaption>
      </figure>

      @if (hasNext()) {
        <button
          type="button"
          class="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-inverse-on-surface/10 text-inverse-on-surface transition-colors hover:bg-inverse-on-surface/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse-on-surface"
          aria-label="Następne zdjęcie"
          (click)="goNext()"
        >
          <span class="material-symbols-outlined text-3xl" aria-hidden="true">chevron_right</span>
        </button>
      }
    </div>
  `,
  imports: [NgOptimizedImage],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => config.src,
    },
  ],
})
export class PhotoLightboxComponent {
  private readonly _destroyRef = inject(DestroyRef);

  readonly photos = input.required<Photo[]>();
  readonly activeIndex = model.required<number>();
  readonly closed = output<void>();

  private readonly _closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');

  readonly currentPhoto = computed(() => this.photos()[this.activeIndex()]);
  readonly hasPrevious = computed(() => this.activeIndex() > 0);
  readonly hasNext = computed(() => this.activeIndex() < this.photos().length - 1);

  constructor() {
    afterNextRender(() => {
      document.body.style.overflow = 'hidden';
      this._closeButton().nativeElement.focus();
    });

    this._destroyRef.onDestroy(() => {
      document.body.style.overflow = '';
    });
  }

  close(): void {
    this.closed.emit();
  }

  goPrevious(): void {
    if (this.hasPrevious()) {
      this.activeIndex.update((index) => index - 1);
    }
  }

  goNext(): void {
    if (this.hasNext()) {
      this.activeIndex.update((index) => index + 1);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.goPrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.goNext();
        break;
    }
  }
}
