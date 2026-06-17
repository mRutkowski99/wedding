import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';
import { httpResource } from '@angular/common/http';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { GridVirtualScrollDirective } from './grid-virtual-scroll.directive';
import { LoadingSpinner } from './loading-spinner.component';
import type { GalleryPhoto } from '../models/gallery-photo';
import { PhotoLightboxComponent } from './photo-lightbox.component';
import { PendingGalleryPhotosService } from '../services/pending-gallery-photos.service';

type GetImagesResponse = GalleryPhoto[];

const THUMBNAIL_SIZE = 220;
const GAP = 16; // gap-4 = 1rem = 16px

@Component({
  selector: 'image-gallery',
  template: `
    <div #galleryContainer class="h-full w-full p-4">
      @if (isLoading()) {
        <div class="flex h-full items-center justify-center" role="status">
          <loading-spinner label="Ładowanie zdjęć..." />
        </div>
      } @else if (hasError()) {
        <div
          class="flex h-full flex-col items-center justify-center gap-4 p-4 text-center"
          role="alert"
        >
          <span class="material-symbols-outlined text-5xl text-primary" aria-hidden="true"
            >error</span
          >
          <p class="text-body-md text-on-surface-variant">Nie udało się załadować zdjęć.</p>
        </div>
      } @else if (isEmpty()) {
        <div class="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
          <span class="material-symbols-outlined text-5xl text-primary" aria-hidden="true"
            >photo_library</span
          >
          <p class="text-body-md text-on-surface-variant">
            Jeszcze nie ma zdjęć. Bądź pierwszy i dodaj wspomnienie!
          </p>
        </div>
      } @else {
        <cdk-virtual-scroll-viewport
          gridVirtualScroll
          appendOnly
          [rowHeight]="rowHeight()"
          [columns]="columns"
          [minBufferPx]="minBufferPx()"
          [maxBufferPx]="maxBufferPx()"
          class="h-full w-full"
        >
          <div class="grid grid-cols-2 gap-4">
            <button
              *cdkVirtualFor="let photo of photos(); let i = index; trackBy: trackById"
              type="button"
              class="relative aspect-square w-full cursor-pointer overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              [attr.aria-label]="'Zobacz zdjęcie ' + (i + 1)"
              (click)="openLightbox(i, $event.currentTarget)"
            >
              <div #placeholder class="absolute inset-0 flex items-center justify-center">
                <loading-spinner />
              </div>
              <img
                #img
                [ngSrc]="photo.url"
                alt=""
                [height]="itemSize()"
                [width]="itemSize()"
                [priority]="i < 7"
                class="h-full w-full object-cover opacity-0 transition-opacity duration-300"
                (load)="placeholder.remove(); img.classList.add('opacity-100')"
                (error)="placeholder.remove()"
              />
            </button>
          </div>
        </cdk-virtual-scroll-viewport>
      }

      @if (isLightboxOpen()) {
        <photo-lightbox
          [photos]="photos()"
          [(activeIndex)]="lightboxIndex"
          (closed)="closeLightbox()"
        />
      }
    </div>
  `,
  imports: [ScrollingModule, GridVirtualScrollDirective, NgOptimizedImage, LoadingSpinner, PhotoLightboxComponent],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => config.src,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGalleryComponent {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _pendingGalleryPhotos = inject(PendingGalleryPhotosService);
  private readonly _viewport = viewChild(CdkVirtualScrollViewport);
  private readonly _galleryContainer = viewChild.required<ElementRef<HTMLElement>>('galleryContainer');

  readonly columns = 2;
  readonly containerWidth = signal(0);

  readonly itemSize = computed(() => {
    const width = this.containerWidth();
    if (width === 0) {
      return THUMBNAIL_SIZE;
    }
    return Math.floor((width - GAP * (this.columns - 1)) / this.columns);
  });

  readonly rowHeight = computed(() => this.itemSize() + GAP);
  readonly minBufferPx = computed(() => this.rowHeight() * 2);
  readonly maxBufferPx = computed(() => this.rowHeight() * 4);

  private readonly _photosResource = httpResource(() => ({ url: '/api/get-photos' }), {
    parse: (response) => response as GetImagesResponse,
  });

  readonly photos = computed(() => {
    const apiPhotos = this._photosResource.value() ?? [];
    const pendingPhotos = this._pendingGalleryPhotos.pending();
    const pendingIds = new Set(pendingPhotos.map((photo) => photo.id));

    return [
      ...pendingPhotos,
      ...apiPhotos.filter((photo) => !pendingIds.has(photo.id)),
    ];
  });
  readonly isLoading = computed(() => {
    const status = this._photosResource.status();
    return status === 'idle' || status === 'loading';
  });
  readonly hasError = computed(() => this._photosResource.status() === 'error');
  readonly isEmpty = computed(
    () => !this.isLoading() && !this.hasError() && this.photos().length === 0,
  );

  readonly isLightboxOpen = signal(false);
  readonly lightboxIndex = signal(0);

  private _lightboxTrigger: HTMLElement | null = null;

  readonly trackById = (_: number, photo: GalleryPhoto) => photo.id;

  constructor() {
    afterNextRender(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

      const container = this._galleryContainer().nativeElement;
      const observer = new ResizeObserver(([entry]) => {
        this.containerWidth.set(entry.contentRect.width);
      });
      observer.observe(container);
      this._destroyRef.onDestroy(() => observer.disconnect());
    });

    effect(() => {
      const apiPhotos = this._photosResource.value();
      if (!apiPhotos) {
        return;
      }

      untracked(() => {
        this._pendingGalleryPhotos.removeIfPresentIn(apiPhotos.map((photo) => photo.id));
      });
    });

    effect(() => {
      if (this.isLoading() || this.hasError() || this.isEmpty()) {
        return;
      }

      const viewport = this._viewport();
      if (!viewport) {
        return;
      }

      untracked(() => {
        afterNextRender(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          viewport.scrollToOffset(0, 'instant');
          viewport.checkViewportSize();
        });
      });
    });
  }

  openLightbox(index: number, trigger: EventTarget | null): void {
    this._lightboxTrigger = trigger instanceof HTMLElement ? trigger : null;
    this.lightboxIndex.set(index);
    this.isLightboxOpen.set(true);
  }

  closeLightbox(): void {
    this.isLightboxOpen.set(false);
    this._lightboxTrigger?.focus();
    this._lightboxTrigger = null;
  }
}
