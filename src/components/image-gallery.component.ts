import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgOptimizedImage } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type GetImagesResponse = Array<{ id: string }>;

@Component({
  selector: 'image-gallery',
  template: `
    <div class="px-gutter md:px-margin-page">
      <cdk-virtual-scroll-viewport
        [itemSize]="itemSize"
        appendOnly
        class="h-[min(80vh,1100px)] w-full"
      >
        <div
          *cdkVirtualFor="let chunk of chunks(); trackBy: trackByFn"
          class="grid w-full grid-cols-2 gap-4"
        >
          @for (url of chunk; track url) {
            <div
              class="flex min-w-0 w-full items-center justify-center overflow-hidden"
              [style.height.px]="itemSize"
            >
              <img
                [src]="url"
                width="220"
                height="220"
                class="max-h-full max-w-full object-cover"
                loading="lazy"
                decoding="async"
                alt=""
              />
            </div>
          }
        </div>
      </cdk-virtual-scroll-viewport>
    </div>
  `,
  imports: [ScrollingModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGalleryComponent {
  readonly itemSize = 220;
  readonly rowSize = 2;

  private readonly _photosResource = httpResource(() => ({ url: '/api/get-photos' }), {
    parse: (response) =>
      (response as GetImagesResponse).map((item) => item.id).map((id) => `proxy-img/${id}=220`),
  });

  readonly chunks = computed(() =>
    this._rowChunkItems(this._photosResource.value() ?? [], this.rowSize),
  );

  readonly trackByFn = (index: number, chunk: string[]) => index;

  private _rowChunkItems(items: string[], chunkSize: number) {
    return items.reduce((acc, item, index) => {
      const rowIndex = Math.floor(index / chunkSize);
      if (!acc[rowIndex]) {
        acc[rowIndex] = [];
      }
      acc[rowIndex].push(item);
      return acc;
    }, [] as string[][]);
  }
}
