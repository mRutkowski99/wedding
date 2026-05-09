import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgOptimizedImage } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { GridVirtualScrollDirective } from './grid-virtual-scroll.directive';
import { LoadingSpinner } from './loading-spinner.component';

type GetImagesResponse = Array<{ id: string }>;

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
          <div
            *cdkVirtualFor="let url of photos(); let i = index; trackBy: trackByUrl"
            class="relative flex items-center justify-center overflow-hidden bg-surface-variant"
            [style.height.px]="itemHeight"
          >
            <div #placeholder class="absolute inset-0 flex items-center justify-center">
              <loading-spinner />
            </div>
            <img
              #img
              [ngSrc]="url"
              alt="Photo"
              [height]="itemHeight"
              [width]="itemHeight"
              [priority]="i > 6"
              class="max-h-full max-w-full object-cover opacity-0 transition-opacity duration-300"
              (load)="placeholder.remove(); img.classList.add('opacity-100')"
              (error)="placeholder.remove()"
            />
          </div>
        </div>
      </cdk-virtual-scroll-viewport>
    </div>
  `,
  imports: [ScrollingModule, GridVirtualScrollDirective, NgOptimizedImage, LoadingSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGalleryComponent {
  readonly itemHeight = ITEM_HEIGHT;
  readonly columns = 2;
  readonly rowHeight = ITEM_HEIGHT + GAP;
  readonly minBufferPx = this.rowHeight * 2;
  readonly maxBufferPx = this.rowHeight * 4;

  private readonly _photosResource = httpResource(() => ({ url: '/api/get-photos' }), {
    parse: (response) =>
      (response as GetImagesResponse)
        .map((item) => item.id)
        .map((id) => `proxy-img/${id}=s${ITEM_HEIGHT}`),
  });

  readonly photos = computed(() => this._photosResource.value() ?? []);

  readonly trackByUrl = (_: number, url: string) => url;
}
