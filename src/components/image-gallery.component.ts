import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { GridVirtualScrollDirective } from './grid-virtual-scroll.directive';
import { LoadingSpinner } from './loading-spinner.component';
import { PhotoLightboxComponent } from './photo-lightbox.component';

type GetImagesResponse = Array<{ id: string; url: string }>;

const ITEM_HEIGHT = 220;
const GAP = 16; // gap-4 = 1rem = 16px

@Component({
  selector: 'image-gallery',
  template: `
    <div class="h-screen w-full p-4">
      <cdk-virtual-scroll-viewport
        gridVirtualScroll
        appendOnly
        [rowHeight]="rowHeight"
        [columns]="columns"
        [minBufferPx]="minBufferPx"
        [maxBufferPx]="maxBufferPx"
        class="h-full w-full"
      >
        <div class="grid grid-cols-2 gap-4">
          <button
            *cdkVirtualFor="let photo of photos(); let i = index; trackBy: trackById"
            type="button"
            class="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-md bg-surface-variant focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            [style.height.px]="itemHeight"
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
              [height]="itemHeight"
              [width]="itemHeight"
              [priority]="i > 6"
              class="max-h-full max-w-full object-cover opacity-0 transition-opacity duration-300"
              (load)="placeholder.remove(); img.classList.add('opacity-100')"
              (error)="placeholder.remove()"
            />
          </button>
        </div>
      </cdk-virtual-scroll-viewport>

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
  private readonly _viewport = viewChild.required(CdkVirtualScrollViewport);

  constructor() {
    afterNextRender(() => this._viewport().scrollToOffset(0, 'instant'));
  }

  readonly itemHeight = ITEM_HEIGHT;
  readonly columns = 2;
  readonly rowHeight = ITEM_HEIGHT + GAP;
  readonly minBufferPx = this.rowHeight * 2;
  readonly maxBufferPx = this.rowHeight * 4;

  private readonly _photosResource = httpResource(() => ({ url: '/api/get-photos' }), {
    parse: (response) => response as GetImagesResponse,
  });

  readonly photos = computed(() => this._photosResource.value() ?? []);

  readonly isLightboxOpen = signal(false);
  readonly lightboxIndex = signal(0);

  private _lightboxTrigger: HTMLElement | null = null;

  readonly trackById = (_: number, photo: { id: string; url: string }) => photo.id;

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
