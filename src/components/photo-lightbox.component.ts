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
  signal,
  viewChild,
} from '@angular/core';
import { LoadingSpinner } from './loading-spinner.component';

export type GalleryPhoto = { id: string; url: string; previewUrl: string };

@Component({
  selector: 'photo-lightbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed inset-0 z-50 flex flex-col bg-inverse-surface/95"
      role="dialog"
      aria-modal="true"
      aria-label="Podgląd zdjęcia"
      (keydown)="onKeydown($event)"
    >
      <div class="flex shrink-0 justify-end p-3">
        <button
          #closeButton
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-full bg-inverse-on-surface/10 text-inverse-on-surface transition-colors hover:bg-inverse-on-surface/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse-on-surface"
          aria-label="Zamknij"
          (click)="close()"
        >
          <span class="material-symbols-outlined text-2xl" aria-hidden="true">close</span>
        </button>
      </div>

      <div class="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-2">
        @if (isImageLoading()) {
          <loading-spinner label="Ładowanie..." />
        }
        <img
          [ngSrc]="currentPhoto().previewUrl"
          [alt]="'Zdjęcie ' + (activeIndex() + 1) + ' z ' + photos().length"
          width="1600"
          height="1600"
          priority
          class="max-h-full max-w-full object-contain transition-opacity duration-300"
          [class.opacity-0]="isImageLoading()"
          (load)="isImageLoading.set(false)"
          (error)="isImageLoading.set(false)"
        />
        <p class="sr-only" aria-live="polite">
          Zdjęcie {{ activeIndex() + 1 }} z {{ photos().length }}
        </p>
      </div>

      <div class="flex shrink-0 items-center justify-center gap-4 px-4 pb-6 pt-2">
        <button
          type="button"
          class="flex h-12 w-12 items-center justify-center rounded-full bg-inverse-on-surface/10 text-inverse-on-surface transition-colors hover:bg-inverse-on-surface/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse-on-surface disabled:opacity-30"
          aria-label="Poprzednie zdjęcie"
          [disabled]="!hasPrevious()"
          (click)="goPrevious()"
        >
          <span class="material-symbols-outlined text-3xl" aria-hidden="true">arrow_back</span>
        </button>

        <span class="min-w-16 text-center text-body-md text-inverse-on-surface" aria-hidden="true">
          {{ activeIndex() + 1 }} / {{ photos().length }}
        </span>

        <button
          type="button"
          class="flex h-12 w-12 items-center justify-center rounded-full bg-inverse-on-surface/10 text-inverse-on-surface transition-colors hover:bg-inverse-on-surface/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse-on-surface disabled:opacity-30"
          aria-label="Następne zdjęcie"
          [disabled]="!hasNext()"
          (click)="goNext()"
        >
          <span class="material-symbols-outlined text-3xl" aria-hidden="true">arrow_forward</span>
        </button>
      </div>
    </div>
  `,
  imports: [NgOptimizedImage, LoadingSpinner],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => config.src,
    },
  ],
})
export class PhotoLightboxComponent {
  private readonly _destroyRef = inject(DestroyRef);

  readonly photos = input.required<GalleryPhoto[]>();
  readonly activeIndex = model.required<number>();
  readonly closed = output<void>();

  private readonly _closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');

  readonly isImageLoading = signal(true);
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
      this.isImageLoading.set(true);
      this.activeIndex.update((index) => index - 1);
    }
  }

  goNext(): void {
    if (this.hasNext()) {
      this.isImageLoading.set(true);
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
