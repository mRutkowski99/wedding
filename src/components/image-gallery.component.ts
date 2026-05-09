import { ScrollingModule } from '@angular/cdk/scrolling';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { GridVirtualScrollDirective } from './grid-virtual-scroll.directive';
import { NgOptimizedImage } from '@angular/common';

type GetImagesResponse = Array<{ id: string }>;

const ITEM_HEIGHT = 220;
const GAP = 16; // gap-4 = 1rem = 16px

@Component({
  selector: 'image-gallery',
  template: `
    <div class="h-screen w-full">
      <cdk-virtual-scroll-viewport
        gridVirtualScroll
        [rowHeight]="rowHeight"
        [columns]="columns"
        [minBufferPx]="minBufferPx"
        [maxBufferPx]="maxBufferPx"
        class="h-full w-full"
      >
        <div class="grid grid-cols-2 gap-4">
          <div
            *cdkVirtualFor="let url of photos(); let i = index; trackBy: trackByUrl"
            class="flex items-center justify-center overflow-hidden"
            [style.height.px]="itemHeight"
          >
            <img
              [ngSrc]="url"
              alt="Photo"
              [height]="itemHeight"
              [width]="itemHeight"
              [priority]="i > 6"
            />
          </div>
        </div>
      </cdk-virtual-scroll-viewport>
    </div>
  `,
  imports: [ScrollingModule, GridVirtualScrollDirective, NgOptimizedImage],
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
